package com.tool.ProjectTool.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.ArgumentMatchers.startsWith;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.inOrder;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Date;
import java.util.List;
import java.util.concurrent.TimeUnit;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InOrder;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionStatus;

import com.tool.ProjectTool.cache.CacheClearer;
import com.tool.ProjectTool.entity.ProjectEntity;
import com.tool.ProjectTool.messaging.FileCleanupMessage;
import com.tool.ProjectTool.messaging.JobPublisher;
import com.tool.ProjectTool.messaging.MessagingConfig;
import com.tool.ProjectTool.messaging.ProjectPurgeMessage;
import com.tool.ProjectTool.repo.ProjectRepository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;

@ExtendWith(MockitoExtension.class)
class ProjectPurgeServiceTest {

	@Mock
	private ProjectRepository projectRepo;

	@Mock
	private JobPublisher publisher;

	@Mock
	private EntityManager em;

	@Mock
	private PlatformTransactionManager transactionManager;

	@Mock
	private CacheClearer cacheClearer;

	private ProjectPurgeService service;

	@BeforeEach
	void setUp() {
		service = new ProjectPurgeService();
		ReflectionTestUtils.setField(service, "projectRepo", projectRepo);
		ReflectionTestUtils.setField(service, "publisher", publisher);
		ReflectionTestUtils.setField(service, "em", em);
		ReflectionTestUtils.setField(service, "transactionManager", transactionManager);
		ReflectionTestUtils.setField(service, "cacheClearer", cacheClearer);
	}

	private static ProjectEntity project(String projectId, int status) {
		ProjectEntity project = new ProjectEntity();
		project.setId(7L);
		project.setProjectId(projectId);
		project.setProjectIdentifier(projectId.toUpperCase());
		project.setStatus(status);
		return project;
	}

	// --- Queueing ---

	@Test
	void queueingHidesTheProjectAtOnceAndQueuesItsRemoval() {
		ProjectEntity project = project("p1", ProjectEntity.DELETED);

		service.queuePurge(project);

		assertEquals(ProjectEntity.REMOVING, project.getStatus());
		InOrder order = inOrder(projectRepo, cacheClearer, publisher);
		order.verify(projectRepo).save(project);
		order.verify(cacheClearer).projectChanged(project);
		order.verify(publisher).publish(MessagingConfig.PROJECT_PURGE_ROUTING_KEY, new ProjectPurgeMessage("p1"));
	}

	@Test
	void nightlyOnlyAsksForProjectsDeletedMoreThanThirtyDaysAgo() {
		when(projectRepo.findDeletedBefore(any())).thenReturn(List.of());
		when(projectRepo.findByStatus(ProjectEntity.REMOVING)).thenReturn(List.of());
		long before = System.currentTimeMillis();

		service.purgeExpired();

		ArgumentCaptor<Date> cutoff = ArgumentCaptor.forClass(Date.class);
		verify(projectRepo).findDeletedBefore(cutoff.capture());
		long expected = before - TimeUnit.DAYS.toMillis(30);
		assertTrue(Math.abs(cutoff.getValue().getTime() - expected) < 5_000);
		verify(publisher, never()).publish(anyString(), any());
	}

	@Test
	void nightlyQueuesExpiredProjectsAndRequeuesOnesStillBeingRemoved() {
		ProjectEntity expired = project("old", ProjectEntity.DELETED);
		ProjectEntity stuck = project("stuck", ProjectEntity.REMOVING);
		when(projectRepo.findDeletedBefore(any())).thenReturn(List.of(expired));
		when(projectRepo.findByStatus(ProjectEntity.REMOVING)).thenReturn(List.of(stuck));

		service.purgeExpired();

		assertEquals(ProjectEntity.REMOVING, expired.getStatus());
		verify(publisher).publish(MessagingConfig.PROJECT_PURGE_ROUTING_KEY, new ProjectPurgeMessage("old"));
		verify(publisher).publish(MessagingConfig.PROJECT_PURGE_ROUTING_KEY, new ProjectPurgeMessage("stuck"));
		// Already marked, so it isn't saved again
		verify(projectRepo, never()).save(stuck);
	}

	@Test
	void nightlyOneFailureDoesntStopTheRest() {
		ProjectEntity broken = project("aa", ProjectEntity.DELETED);
		ProjectEntity fine = project("bb", ProjectEntity.DELETED);
		when(projectRepo.findDeletedBefore(any())).thenReturn(List.of(broken, fine));
		when(projectRepo.findByStatus(ProjectEntity.REMOVING)).thenReturn(List.of());
		doThrow(new RuntimeException("boom")).when(projectRepo).save(broken);

		service.purgeExpired();

		verify(publisher, never()).publish(MessagingConfig.PROJECT_PURGE_ROUTING_KEY, new ProjectPurgeMessage("aa"));
		verify(publisher).publish(MessagingConfig.PROJECT_PURGE_ROUTING_KEY, new ProjectPurgeMessage("bb"));
	}

	// --- Removing, from the project queue ---

	private Query deletes;

	// The image query finds the given files; every delete statement succeeds
	private void database(List<String> files) {
		when(transactionManager.getTransaction(any())).thenReturn(mock(TransactionStatus.class));
		Query fileQuery = mock(Query.class);
		when(fileQuery.setParameter(anyString(), any())).thenReturn(fileQuery);
		when(fileQuery.getResultList()).thenReturn(files);
		deletes = mock(Query.class);
		lenient().when(deletes.setParameter(anyString(), any())).thenReturn(deletes);
		when(em.createNativeQuery(anyString())).thenReturn(deletes);
		when(em.createNativeQuery(startsWith("select stored_name"))).thenReturn(fileQuery);
	}

	@Test
	void removesEverythingInOneTransactionThenQueuesTheImageFiles() {
		when(projectRepo.findByProjectId("p1")).thenReturn(project("p1", ProjectEntity.REMOVING));
		database(List.of("a.png", "b.png"));

		service.purge("p1");

		verify(transactionManager, times(1)).commit(any());
		verify(em).createNativeQuery("delete from projects where id = :id");
		verify(cacheClearer).projectRemoved(any(ProjectEntity.class));
		verify(publisher).publish(MessagingConfig.FILE_CLEANUP_ROUTING_KEY, new FileCleanupMessage("a.png"));
		verify(publisher).publish(MessagingConfig.FILE_CLEANUP_ROUTING_KEY, new FileCleanupMessage("b.png"));
	}

	// A repeated message (the nightly re-queue, or a replay from the dead-letter queue) does nothing
	@Test
	void aProjectAlreadyRemovedIsSkipped() {
		when(projectRepo.findByProjectId("p1")).thenReturn(null);

		service.purge("p1");

		verify(transactionManager, never()).getTransaction(any());
		verify(publisher, never()).publish(anyString(), any());
	}

	@Test
	void aProjectNotMarkedForRemovalIsLeftAlone() {
		when(projectRepo.findByProjectId("p1")).thenReturn(project("p1", ProjectEntity.DELETED));

		service.purge("p1");

		verify(em, never()).createNativeQuery(anyString());
		verify(publisher, never()).publish(anyString(), any());
	}

	// Throwing hands the message back to the queue for a retry; nothing is half-done, and no file is touched
	@Test
	void aDatabaseFailureIsThrownAndRolledBack() {
		when(projectRepo.findByProjectId("p1")).thenReturn(project("p1", ProjectEntity.REMOVING));
		database(List.of("a.png"));
		when(deletes.executeUpdate()).thenThrow(new RuntimeException("db down"));

		assertThrows(RuntimeException.class, () -> service.purge("p1"));

		verify(transactionManager).rollback(any());
		verify(transactionManager, never()).commit(any());
		verify(cacheClearer, never()).projectRemoved(any());
		verify(publisher, never()).publish(eq(MessagingConfig.FILE_CLEANUP_ROUTING_KEY), any());
	}
}
