package com.tool.ProjectTool.cache;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.stereotype.Component;

import com.tool.ProjectTool.entity.ProjectEntity;

/**
 * Clears cached reads when the data behind them changes; each method names the change. Inside a transaction the
 * clear waits for the commit (CacheConfig). If Redis can't be reached it is only logged: the entry expires after
 * CacheConfig.TTL anyway.
 */
@Component
public class CacheClearer {

	private static final Logger log = LoggerFactory.getLogger(CacheClearer.class);

	private final CacheManager cacheManager;

	public CacheClearer(CacheManager cacheManager) {
		this.cacheManager = cacheManager;
	}

	/** Name, email, phone, role or status changed: the login and the team lists show them, and project details show the lead's email */
	public void userChanged(String userId) {
		evict(CacheNames.USERS, userId);
		clear(CacheNames.TEAM_MEMBERS);
		clear(CacheNames.PROJECT_DETAILS);
	}

	/** Only what the login reads changed (e.g. the role, when someone creates a project) */
	public void loginChanged(String userId) {
		evict(CacheNames.USERS, userId);
	}

	/** Created, renamed, template changed, deleted, restored or being removed */
	public void projectChanged(ProjectEntity project) {
		evict(CacheNames.PROJECT_DETAILS, project.getProjectId());
		if (project.getUser() != null) {
			evict(CacheNames.PROJECTS, project.getUser().getUserId());
			evict(CacheNames.DELETED_PROJECTS, project.getUser().getUserId());
		}
		// Keyed by member, and a project has many
		clear(CacheNames.TEAM_PROJECTS);
	}

	/** A new project: only its lead's list changes */
	public void projectCreated(String leadUserId) {
		evict(CacheNames.PROJECTS, leadUserId);
	}

	/** Removed for good, with everything in it. Rare, so the caches that hold its parts are emptied. */
	public void projectRemoved(ProjectEntity project) {
		projectChanged(project);
		evict(CacheNames.TEAM_MEMBERS, project.getProjectId());
		evict(CacheNames.PROJECT_ACTIVITY, project.getProjectIdentifier());
		evict(CacheNames.ACTIVITY_PEOPLE, project.getProjectIdentifier());
		clear(CacheNames.ACTIVITY_LOG);
		clear(CacheNames.TASK_ACTIVITY);
		clear(CacheNames.COMMENTS);
		clear(CacheNames.NOTES);
		clear(CacheNames.NOTE_DETAILS);
	}

	/** Someone joined the project, or a member's role or status changed */
	public void teamChanged(String projectId) {
		if (projectId != null) {
			evict(CacheNames.TEAM_MEMBERS, projectId);
		} else {
			clear(CacheNames.TEAM_MEMBERS);
		}
		clear(CacheNames.TEAM_PROJECTS);
	}

	/** A new activity entry, for the project and, when it is about one, the task */
	public void activityAdded(String projectIdentifier, String taskSequence) {
		evict(CacheNames.PROJECT_ACTIVITY, projectIdentifier);
		evict(CacheNames.ACTIVITY_PEOPLE, projectIdentifier);
		if (taskSequence != null) {
			evict(CacheNames.TASK_ACTIVITY, taskSequence);
		}
		// Its keys hold every filter, so the pages can't be picked out one project at a time
		clear(CacheNames.ACTIVITY_LOG);
	}

	public void commentAdded(String taskSequence) {
		evict(CacheNames.COMMENTS, taskSequence);
	}

	public void notesChanged(String userId, String projectId) {
		evict(CacheNames.NOTES, notesKey(userId, projectId));
	}

	public void noteChanged(Long noteId) {
		evict(CacheNames.NOTE_DETAILS, noteId);
	}

	/** The key of someone's notes in a project; the @Cacheable on NotesService.getAllNotes builds the same one */
	public static String notesKey(String userId, String projectId) {
		return userId + ":" + projectId;
	}

	private void evict(String cacheName, Object key) {
		try {
			Cache cache = cacheManager.getCache(cacheName);
			if (cache != null) {
				cache.evict(key);
			}
		} catch (RuntimeException e) {
			log.warn("Cache clear failed ({} {}): {}", cacheName, key, e.getMessage());
		}
	}

	private void clear(String cacheName) {
		try {
			Cache cache = cacheManager.getCache(cacheName);
			if (cache != null) {
				cache.clear();
			}
		} catch (RuntimeException e) {
			log.warn("Cache clear failed ({}): {}", cacheName, e.getMessage());
		}
	}
}
