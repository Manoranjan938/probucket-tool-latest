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
import com.tool.ProjectTool.repo.ProjectRepository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

// Removes deleted projects for good: by hand from Recently deleted, or every night once their
// ProjectService.RETENTION_DAYS are over. Team members keep their accounts; only their place on the team goes.
@Service
public class ProjectPurgeService {

	private static final Logger log = LoggerFactory.getLogger(ProjectPurgeService.class);

	@PersistenceContext
	private EntityManager em;

	@Autowired
	private ProjectRepository projectRepo;

	@Autowired
	private AttachmentStorage storage;

	@Autowired
	private PlatformTransactionManager transactionManager;

	/** Everything in the project goes in one transaction; the image files go once it has committed */
	public void purge(ProjectEntity project) {

		List<String> files = new TransactionTemplate(transactionManager).execute(status -> deleteRows(project));
		for (String file : files) {
			try {
				storage.delete(file);
			} catch (RuntimeException e) {
				// The project is already gone; a file left behind only takes space
				log.warn("Couldn't delete image file {}", file, e);
			}
		}
	}

	// Every night at 03:30 (server time), after the refresh-token clean-up. Each project is removed on its own,
	// so one that fails doesn't stop the rest and is tried again the next night.
	@Scheduled(cron = "${app.projects.purge-cron:0 30 3 * * *}")
	public void purgeExpired() {

		Date cutoff = new Date(System.currentTimeMillis() - TimeUnit.DAYS.toMillis(ProjectService.RETENTION_DAYS));
		List<ProjectEntity> expired = projectRepo.findDeletedBefore(cutoff);

		int removed = 0;
		for (ProjectEntity project : expired) {
			try {
				purge(project);
				removed++;
			} catch (RuntimeException e) {
				log.error("Couldn't remove deleted project {} for good", project.getProjectIdentifier(), e);
			}
		}
		if (!expired.isEmpty()) {
			log.info("Removed {} of {} deleted projects for good", removed, expired.size());
		}
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
