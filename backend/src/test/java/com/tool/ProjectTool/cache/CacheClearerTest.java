package com.tool.ProjectTool.cache;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatCode;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;

import com.tool.ProjectTool.entity.ProjectEntity;
import com.tool.ProjectTool.entity.Users;

class CacheClearerTest {

	private ConcurrentMapCacheManager caches;
	private CacheClearer clearer;

	@BeforeEach
	void setUp() {
		caches = new ConcurrentMapCacheManager();
		clearer = new CacheClearer(caches);
	}

	private void put(String cache, Object key) {
		caches.getCache(cache).put(key, "cached");
	}

	private boolean cached(String cache, Object key) {
		return caches.getCache(cache).get(key) != null;
	}

	private static ProjectEntity project() {
		Users lead = new Users();
		lead.setUserId("lead");
		ProjectEntity project = new ProjectEntity();
		project.setProjectId("p1");
		project.setProjectIdentifier("AP");
		project.setUser(lead);
		return project;
	}

	@Test
	void aProfileChangeClearsTheLoginAndWhereTheNameOrEmailShows() {
		put(CacheNames.USERS, "u1");
		put(CacheNames.USERS, "u2");
		put(CacheNames.TEAM_MEMBERS, "p1");
		put(CacheNames.PROJECT_DETAILS, "p1");

		clearer.userChanged("u1");

		assertThat(cached(CacheNames.USERS, "u1")).isFalse();
		assertThat(cached(CacheNames.USERS, "u2")).isTrue();
		assertThat(cached(CacheNames.TEAM_MEMBERS, "p1")).isFalse();
		assertThat(cached(CacheNames.PROJECT_DETAILS, "p1")).isFalse();
	}

	@Test
	void aProjectChangeClearsItsDetailsAndItsLeadsLists() {
		put(CacheNames.PROJECT_DETAILS, "p1");
		put(CacheNames.PROJECT_DETAILS, "p2");
		put(CacheNames.PROJECTS, "lead");
		put(CacheNames.PROJECTS, "other");
		put(CacheNames.DELETED_PROJECTS, "lead");
		put(CacheNames.TEAM_PROJECTS, "member");

		clearer.projectChanged(project());

		assertThat(cached(CacheNames.PROJECT_DETAILS, "p1")).isFalse();
		assertThat(cached(CacheNames.PROJECT_DETAILS, "p2")).isTrue();
		assertThat(cached(CacheNames.PROJECTS, "lead")).isFalse();
		assertThat(cached(CacheNames.PROJECTS, "other")).isTrue();
		assertThat(cached(CacheNames.DELETED_PROJECTS, "lead")).isFalse();
		assertThat(cached(CacheNames.TEAM_PROJECTS, "member")).isFalse();
	}

	@Test
	void newActivityClearsThatProjectAndTaskOnly() {
		put(CacheNames.PROJECT_ACTIVITY, "AP");
		put(CacheNames.PROJECT_ACTIVITY, "BB");
		put(CacheNames.ACTIVITY_PEOPLE, "AP");
		put(CacheNames.TASK_ACTIVITY, "AP-1");
		put(CacheNames.TASK_ACTIVITY, "AP-2");
		put(CacheNames.ACTIVITY_LOG, "AP|null|null|null|null|null");

		clearer.activityAdded("AP", "AP-1");

		assertThat(cached(CacheNames.PROJECT_ACTIVITY, "AP")).isFalse();
		assertThat(cached(CacheNames.PROJECT_ACTIVITY, "BB")).isTrue();
		assertThat(cached(CacheNames.ACTIVITY_PEOPLE, "AP")).isFalse();
		assertThat(cached(CacheNames.TASK_ACTIVITY, "AP-1")).isFalse();
		assertThat(cached(CacheNames.TASK_ACTIVITY, "AP-2")).isTrue();
		assertThat(cached(CacheNames.ACTIVITY_LOG, "AP|null|null|null|null|null")).isFalse();
	}

	@Test
	void activityNotAboutATaskLeavesTaskHistoriesAlone() {
		put(CacheNames.TASK_ACTIVITY, "AP-1");

		clearer.activityAdded("AP", null);

		assertThat(cached(CacheNames.TASK_ACTIVITY, "AP-1")).isTrue();
	}

	@Test
	void aRemovedProjectTakesItsTeamActivityCommentsAndNotesWithIt() {
		put(CacheNames.TEAM_MEMBERS, "p1");
		put(CacheNames.PROJECT_ACTIVITY, "AP");
		put(CacheNames.TASK_ACTIVITY, "AP-1");
		put(CacheNames.COMMENTS, "AP-1");
		put(CacheNames.NOTES, CacheClearer.notesKey("lead", "p1"));
		put(CacheNames.NOTE_DETAILS, 5L);
		put(CacheNames.PROJECT_DETAILS, "p1");

		clearer.projectRemoved(project());

		assertThat(cached(CacheNames.TEAM_MEMBERS, "p1")).isFalse();
		assertThat(cached(CacheNames.PROJECT_ACTIVITY, "AP")).isFalse();
		assertThat(cached(CacheNames.TASK_ACTIVITY, "AP-1")).isFalse();
		assertThat(cached(CacheNames.COMMENTS, "AP-1")).isFalse();
		assertThat(cached(CacheNames.NOTES, "lead:p1")).isFalse();
		assertThat(cached(CacheNames.NOTE_DETAILS, 5L)).isFalse();
		assertThat(cached(CacheNames.PROJECT_DETAILS, "p1")).isFalse();
	}

	@Test
	void notesAndCommentsAreClearedByTheirOwnKeys() {
		put(CacheNames.NOTES, "u1:p1");
		put(CacheNames.NOTES, "u2:p1");
		put(CacheNames.NOTE_DETAILS, 5L);
		put(CacheNames.COMMENTS, "AP-1");

		clearer.notesChanged("u1", "p1");
		clearer.noteChanged(5L);
		clearer.commentAdded("AP-1");

		assertThat(cached(CacheNames.NOTES, "u1:p1")).isFalse();
		assertThat(cached(CacheNames.NOTES, "u2:p1")).isTrue();
		assertThat(cached(CacheNames.NOTE_DETAILS, 5L)).isFalse();
		assertThat(cached(CacheNames.COMMENTS, "AP-1")).isFalse();
	}

	// Redis being down mustn't turn a saved change into an error; the entry expires on its own
	@Test
	void aRedisFailureIsLoggedNotThrown() {
		CacheManager broken = mock(CacheManager.class);
		Cache cache = mock(Cache.class);
		when(broken.getCache(anyString())).thenReturn(cache);
		doThrow(new RuntimeException("redis down")).when(cache).evict(any());
		doThrow(new RuntimeException("redis down")).when(cache).clear();

		CacheClearer clearer = new CacheClearer(broken);

		assertThatCode(() -> {
			clearer.userChanged("u1");
			clearer.projectRemoved(project());
			clearer.activityAdded("AP", "AP-1");
		}).doesNotThrowAnyException();
	}
}
