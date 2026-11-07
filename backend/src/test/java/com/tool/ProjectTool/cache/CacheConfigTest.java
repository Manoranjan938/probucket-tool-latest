package com.tool.ProjectTool.cache;

import static org.assertj.core.api.Assertions.assertThat;

import java.lang.reflect.Field;
import java.lang.reflect.Modifier;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Stream;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.springframework.data.redis.serializer.JacksonJsonRedisSerializer;

import com.tool.ProjectTool.entity.ActivityType;
import com.tool.ProjectTool.entity.Users;
import com.tool.ProjectTool.model.response.ActivityPageResponse;
import com.tool.ProjectTool.model.response.ActivityPersonResponse;
import com.tool.ProjectTool.model.response.ActivityResponse;
import com.tool.ProjectTool.model.response.CommentsList;
import com.tool.ProjectTool.model.response.DeletedProjectResponse;
import com.tool.ProjectTool.model.response.NoteDetails;
import com.tool.ProjectTool.model.response.NoteList;
import com.tool.ProjectTool.model.response.ProjectResponse;
import com.tool.ProjectTool.model.response.TeamMembersList;

import tools.jackson.databind.JavaType;
import tools.jackson.databind.json.JsonMapper;

// Every cached value comes back from Redis the same as it went in
class CacheConfigTest {

	private static final JsonMapper MAPPER = CacheConfig.cacheMapper();
	private static final Map<String, JavaType> TYPES = CacheConfig.valueTypes(MAPPER);
	private static final Date WHEN = new Date(1_762_510_530_123L);

	@Test
	void everyCacheHasAType() throws IllegalAccessException {
		for (Field field : CacheNames.class.getDeclaredFields()) {
			if (Modifier.isStatic(field.getModifiers()) && field.getType() == String.class) {
				assertThat(TYPES).as(field.getName()).containsKey((String) field.get(null));
			}
		}
	}

	static Stream<Arguments> values() {
		ProjectResponse project = new ProjectResponse();
		project.setProjectName("Apollo");
		project.setProjectId("p1");
		project.setProjectIdentifier("AP");
		project.setLeadBy("Asha");
		project.setProjectType("team");
		project.setProjectAvatar("a.png");
		project.setCreatedOn(WHEN);
		project.setLeadEmail("asha@x.test");
		project.setProjectTemplate("project");

		TeamMembersList member = new TeamMembersList();
		member.setEmail("ravi@x.test");
		member.setName("Ravi");
		member.setUserid(4L);
		member.setMemberId("u4");
		member.setRole("Developer");
		member.setAddedDate("2026-11-07");
		member.setStatus(1);

		ActivityResponse activity = new ActivityResponse(9L, ActivityType.STATUS_CHANGED, "Asha", "AP-1", "Ship it",
				"TODO", "COMPLETED", WHEN);

		CommentsList comment = new CommentsList();
		comment.setName("Asha");
		comment.setId(3L);
		comment.setComment("Looks good");
		comment.setCommentDate("2026-11-07 10:00:00");

		NoteList note = new NoteList();
		note.setId(5L);
		note.setTitle("Plan");
		note.setDescription("Steps");

		NoteDetails details = new NoteDetails();
		details.setTitle("Plan");
		details.setDescription("Steps");

		return Stream.of(
				Arguments.of(CacheNames.USERS, new CachedUser(1L, "u1", "asha@x.test", "Asha", "asha@x.test", "123",
						"a.png", 0, "ROLE_TEAM-ADMIN")),
				Arguments.of(CacheNames.PROJECTS, List.of(project)),
				Arguments.of(CacheNames.PROJECT_DETAILS, project),
				Arguments.of(CacheNames.DELETED_PROJECTS,
						List.of(new DeletedProjectResponse("p1", "Apollo", "AP", "team", WHEN, null))),
				Arguments.of(CacheNames.TEAM_MEMBERS, List.of(member)),
				Arguments.of(CacheNames.TEAM_PROJECTS, List.of(project)),
				Arguments.of(CacheNames.PROJECT_ACTIVITY, List.of(activity)),
				Arguments.of(CacheNames.ACTIVITY_LOG, new ActivityPageResponse(List.of(activity), true)),
				Arguments.of(CacheNames.ACTIVITY_PEOPLE, List.of(new ActivityPersonResponse("u1", "Asha"))),
				Arguments.of(CacheNames.TASK_ACTIVITY, List.of(activity)),
				Arguments.of(CacheNames.COMMENTS, List.of(comment)),
				Arguments.of(CacheNames.NOTES, List.of(note)),
				Arguments.of(CacheNames.NOTE_DETAILS, details));
	}

	@ParameterizedTest(name = "{0}")
	@MethodSource("values")
	void readsBackWhatWasStored(String cacheName, Object value) {
		JacksonJsonRedisSerializer<Object> serializer = new JacksonJsonRedisSerializer<>(MAPPER, TYPES.get(cacheName));

		Object read = serializer.deserialize(serializer.serialize(value));

		assertThat(read).usingRecursiveComparison().isEqualTo(value);
	}

	// An entry written by an older version with a field that no longer exists still reads
	@Test
	void unknownFieldsAreIgnored() {
		JacksonJsonRedisSerializer<Object> serializer = new JacksonJsonRedisSerializer<>(MAPPER,
				TYPES.get(CacheNames.NOTE_DETAILS));

		NoteDetails read = (NoteDetails) serializer.deserialize("{\"title\":\"Plan\",\"gone\":1}".getBytes());

		assertThat(read.getTitle()).isEqualTo("Plan");
	}

	// The login cache keeps what the app reads of a user, and nothing secret
	@Test
	void theCachedUserHasNoPasswordOrToken() {
		Users user = new Users();
		user.setId(1L);
		user.setUserId("u1");
		user.setUsername("asha@x.test");
		user.setName("Asha");
		user.setEmail("asha@x.test");
		user.setRoleName("ROLE_USER");
		user.setPassword("$2a$10$hash");
		user.setVerifyToken("secret-token");

		String json = new String(new JacksonJsonRedisSerializer<>(MAPPER, TYPES.get(CacheNames.USERS))
				.serialize(CachedUser.of(user)));
		Users back = CachedUser.of(user).toUser();

		assertThat(json).doesNotContain("$2a$10$hash").doesNotContain("secret-token");
		assertThat(Arrays.asList(back.getId(), back.getUserId(), back.getUsername(), back.getName(), back.getEmail(),
				back.getRoleName())).containsExactly(1L, "u1", "asha@x.test", "Asha", "asha@x.test", "ROLE_USER");
		assertThat(back.getPassword()).isNull();
	}
}
