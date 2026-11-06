package com.tool.ProjectTool.service;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Date;
import java.util.List;
import java.util.concurrent.TimeUnit;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import com.tool.ProjectTool.entity.ProjectEntity;
import com.tool.ProjectTool.repo.ProjectRepository;

@ExtendWith(MockitoExtension.class)
class ProjectPurgeServiceTest {

	@Mock
	private ProjectRepository projectRepo;

	private ProjectPurgeService service;

	@BeforeEach
	void setUp() {
		service = spy(new ProjectPurgeService());
		ReflectionTestUtils.setField(service, "projectRepo", projectRepo);
	}

	private static ProjectEntity project(String identifier) {
		ProjectEntity project = new ProjectEntity();
		project.setProjectIdentifier(identifier);
		project.setStatus(ProjectEntity.DELETED);
		return project;
	}

	@Test
	void onlyProjectsDeletedMoreThanThirtyDaysAgoAreAskedFor() {
		when(projectRepo.findDeletedBefore(any())).thenReturn(List.of());
		long before = System.currentTimeMillis();

		service.purgeExpired();

		ArgumentCaptor<Date> cutoff = ArgumentCaptor.forClass(Date.class);
		verify(projectRepo).findDeletedBefore(cutoff.capture());
		long expected = before - TimeUnit.DAYS.toMillis(30);
		assertTrue(Math.abs(cutoff.getValue().getTime() - expected) < 5_000);
		verify(service, never()).purge(any());
	}

	@Test
	void oneFailureDoesntStopTheRest() {
		ProjectEntity broken = project("AA");
		ProjectEntity fine = project("BB");
		when(projectRepo.findDeletedBefore(any())).thenReturn(List.of(broken, fine));
		doThrow(new RuntimeException("boom")).when(service).purge(broken);
		doNothing().when(service).purge(fine);

		service.purgeExpired();

		verify(service).purge(fine);
	}

}
