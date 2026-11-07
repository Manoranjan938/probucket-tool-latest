package com.tool.ProjectTool.service;

import java.util.Date;
import java.util.List;
import java.util.concurrent.TimeUnit;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;

import com.tool.ProjectTool.entity.ProjectEntity;
import com.tool.ProjectTool.messaging.FileCleanupMessage;
import com.tool.ProjectTool.messaging.JobPublisher;
import com.tool.ProjectTool.messaging.MessagingConfig;
import com.tool.ProjectTool.messaging.ProjectPurgeMessage;
import com.tool.ProjectTool.repo.ProjectRepository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

// Removes deleted projects for good: by hand from Recently deleted, or every night once their
// ProjectService.RETENTION_DAYS are over. Either way the project is first marked REMOVING, which hides it and
// stops a restore, and queued; the project queue (ProjectPurgeListener) then removes it.
// Team members keep their accounts; only their place on the team goes.
@Service
public class ProjectPurgeService {

	private static final Logger log = LoggerFactory.getLogger(ProjectPurgeService.class);

	@PersistenceContext
	private EntityManager em;

	@Autowired
	private ProjectRepository projectRepo;

	@Autowired
	private JobPublisher publisher;

	@Autowired
	private PlatformTransactionManager transactionManager;

	/** Hides the project at once and queues its removal */
	public void queuePurge(ProjectEntity project) {
		project.setStatus(ProjectEntity.REMOVING);
		projectRepo.save(project);
		publish(project);
	}

	// Every night at 03:30 (server time), after the refresh-token clean-up: queues the deleted projects whose days
	// are over, and again any project still being removed (its queueing failed, or its removal ended in the
	// dead-letter queue). Removing a project twice is harmless.
	@Scheduled(cron = "${app.projects.purge-cron:0 30 3 * * *}")
	public void purgeExpired() {

		Date cutoff = new Date(System.currentTimeMillis() - TimeUnit.DAYS.toMillis(ProjectService.RETENTION_DAYS));
		List<ProjectEntity> expired = projectRepo.findDeletedBefore(cutoff);
		List<ProjectEntity> stuck = projectRepo.findByStatus(ProjectEntity.REMOVING);

		int queued = 0;
		for (ProjectEntity project : expired) {
			try {
				queuePurge(project);
				queued++;
			} catch (RuntimeException e) {
				// Tried again the next night
				log.error("Couldn't queue deleted project {} for removal", project.getProjectIdentifier(), e);
			}
		}
		stuck.forEach(this::publish);

		if (!expired.isEmpty() || !stuck.isEmpty()) {
			log.info("Queued {} of {} expired projects for removal, and {} still being removed again", queued,
					expired.size(), stuck.size());
		}
	}

	/**
	 * Called from the project queue. Everything in the project goes in one transaction, and its image files are
	 * queued for clean-up once that has committed. Throws if it fails, so the queue retries it.
	 */
	public void purge(String projectId) {

		ProjectEntity project = projectRepo.findByProjectId(projectId);
		if (project == null) {
			log.info("Project {} is already removed", projectId);
			return;
		}
		if (!project.isRemoving()) {
			log.warn("Project {} isn't marked for removal, so it is left as it is", project.getProjectIdentifier());
			return;
		}

		List<String> files = new TransactionTemplate(transactionManager).execute(status -> deleteRows(project));
		for (String file : files) {
			publisher.publish(MessagingConfig.FILE_CLEANUP_ROUTING_KEY, new FileCleanupMessage(file));
		}
		log.info("Removed project {} for good", project.getProjectIdentifier());
	}

	private void publish(ProjectEntity project) {
		publisher.publish(MessagingConfig.PROJECT_PURGE_ROUTING_KEY, new ProjectPurgeMessage(project.getProjectId()));
	}

	// Children first, so no row is left pointing at one that is gone. Returns the stored names of the images.
	@SuppressWarnings("unchecked")
	private List<String> deleteRows(ProjectEntity project) {

		Long id = project.getId();
		String projectId = project.getProjectId();
		String identifier = project.getProjectIdentifier();
		String tasks = "(select t.id from project_task t join backlog b on b.id = t.backlog_id where b.project_id = :id)";

		List<String> files = em
				.createNativeQuery("select stored_name from task_attachment where project_identifier = :identifier")
				.setParameter("identifier", identifier).getResultList();

		run("delete from comments where commented_on_type in " + tasks, "id", id);
		run("delete from project_task_label where task_id in " + tasks, "id", id);
		run("delete from task_attachment where project_identifier = :identifier", "identifier", identifier);
		run("delete from activity_log where project_identifier = :identifier", "identifier", identifier);
		run("delete from project_task where backlog_id in (select b.id from backlog b where b.project_id = :id)", "id", id);
		run("delete from backlog where project_id = :id", "id", id);
		run("delete from team_details where project_id = :projectId", "projectId", projectId);
		run("delete from sprints where project_id = :projectId", "projectId", projectId);
		run("delete from notifications where project_id = :projectId", "projectId", projectId);
		run("delete from notes where project_id = :projectId", "projectId", projectId);
		run("delete from projects where id = :id", "id", id);

		return files;
	}

	private void run(String sql, String name, Object value) {
		em.createNativeQuery(sql).setParameter(name, value).executeUpdate();
	}

}
