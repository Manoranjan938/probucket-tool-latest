package com.tool.ProjectTool.cache;

import java.time.Duration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.SmartInitializingSingleton;
import org.springframework.boot.data.redis.autoconfigure.LettuceClientOptionsBuilderCustomizer;
import org.springframework.cache.Cache;
import org.springframework.cache.annotation.CachingConfigurer;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.interceptor.CacheErrorHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnection;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.serializer.JacksonJsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext.SerializationPair;

import com.tool.ProjectTool.model.response.ActivityPageResponse;
import com.tool.ProjectTool.model.response.ActivityPersonResponse;
import com.tool.ProjectTool.model.response.ActivityResponse;
import com.tool.ProjectTool.model.response.CommentsList;
import com.tool.ProjectTool.model.response.DeletedProjectResponse;
import com.tool.ProjectTool.model.response.NoteDetails;
import com.tool.ProjectTool.model.response.NoteList;
import com.tool.ProjectTool.model.response.ProjectResponse;
import com.tool.ProjectTool.model.response.TeamMembersList;

import io.lettuce.core.ClientOptions;
import tools.jackson.databind.DeserializationFeature;
import tools.jackson.databind.JavaType;
import tools.jackson.databind.json.JsonMapper;
import tools.jackson.databind.type.TypeFactory;

// Redis cache for reads that change rarely (see CacheNames). Each cache stores one known type as JSON, so nothing
// in Redis decides which class gets created. Clears wait for the transaction to commit.
// Redis is required at startup; if it fails later, requests read from the database instead (errorHandler).
@Configuration
@EnableCaching
public class CacheConfig implements CachingConfigurer {

	private static final Logger log = LoggerFactory.getLogger(CacheConfig.class);

	/** A safety net: every change also clears what it affects (CacheClearer) */
	public static final Duration TTL = Duration.ofMinutes(10);

	/** The JSON mapper for cached values. Fields added or removed in a later version don't break old entries. */
	static JsonMapper cacheMapper() {
		return JsonMapper.builder().disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES).build();
	}

	/** The type stored in each cache */
	static Map<String, JavaType> valueTypes(JsonMapper mapper) {
		TypeFactory types = mapper.getTypeFactory();
		Map<String, JavaType> valueTypes = new HashMap<>();
		valueTypes.put(CacheNames.USERS, types.constructType(CachedUser.class));
		valueTypes.put(CacheNames.PROJECTS, types.constructCollectionType(List.class, ProjectResponse.class));
		valueTypes.put(CacheNames.PROJECT_DETAILS, types.constructType(ProjectResponse.class));
		valueTypes.put(CacheNames.DELETED_PROJECTS, types.constructCollectionType(List.class, DeletedProjectResponse.class));
		valueTypes.put(CacheNames.TEAM_MEMBERS, types.constructCollectionType(List.class, TeamMembersList.class));
		valueTypes.put(CacheNames.TEAM_PROJECTS, types.constructCollectionType(List.class, ProjectResponse.class));
		valueTypes.put(CacheNames.PROJECT_ACTIVITY, types.constructCollectionType(List.class, ActivityResponse.class));
		valueTypes.put(CacheNames.ACTIVITY_LOG, types.constructType(ActivityPageResponse.class));
		valueTypes.put(CacheNames.ACTIVITY_PEOPLE, types.constructCollectionType(List.class, ActivityPersonResponse.class));
		valueTypes.put(CacheNames.TASK_ACTIVITY, types.constructCollectionType(List.class, ActivityResponse.class));
		valueTypes.put(CacheNames.COMMENTS, types.constructCollectionType(List.class, CommentsList.class));
		valueTypes.put(CacheNames.NOTES, types.constructCollectionType(List.class, NoteList.class));
		valueTypes.put(CacheNames.NOTE_DETAILS, types.constructType(NoteDetails.class));
		return valueTypes;
	}

	// Keys look like probucket:projectDetails::<projectId>
	@Bean
	RedisCacheManager cacheManager(RedisConnectionFactory connectionFactory) {

		JsonMapper mapper = cacheMapper();
		RedisCacheConfiguration defaults = RedisCacheConfiguration.defaultCacheConfig()
				.entryTtl(TTL)
				.disableCachingNullValues()
				.prefixCacheNameWith("probucket:");

		Map<String, RedisCacheConfiguration> caches = new HashMap<>();
		valueTypes(mapper).forEach((name, type) -> caches.put(name,
				defaults.serializeValuesWith(SerializationPair.fromSerializer(new JacksonJsonRedisSerializer<>(mapper, type)))));

		return RedisCacheManager.builder(connectionFactory)
				.cacheDefaults(defaults)
				.withInitialCacheConfigurations(caches)
				// Only the caches above, each with its own type
				.disableCreateOnMissingCache()
				// A clear inside a transaction happens once it commits, so nobody re-reads the old rows into the cache
				.transactionAware()
				.build();
	}

	// While Redis can't be reached, commands fail at once instead of waiting, so requests fall back quickly
	@Bean
	LettuceClientOptionsBuilderCustomizer failFastWhenDisconnected() {
		return builder -> builder.disconnectedBehavior(ClientOptions.DisconnectedBehavior.REJECT_COMMANDS);
	}

	// Redis is required: without it the app doesn't start. Runs before the web server starts.
	@Bean
	SmartInitializingSingleton requireRedis(RedisConnectionFactory connectionFactory) {
		return () -> {
			try (RedisConnection connection = connectionFactory.getConnection()) {
				connection.ping();
			}
		};
	}

	// If Redis fails while the app runs, a cache read counts as a miss and the database answers;
	// a failed write or clear is only logged (the entry expires after TTL anyway)
	@Override
	public CacheErrorHandler errorHandler() {
		return new CacheErrorHandler() {
			@Override
			public void handleCacheGetError(RuntimeException e, Cache cache, Object key) {
				log.warn("Cache read failed ({} {}), reading from the database: {}", cache.getName(), key, e.getMessage());
			}

			@Override
			public void handleCachePutError(RuntimeException e, Cache cache, Object key, Object value) {
				log.warn("Cache write failed ({} {}): {}", cache.getName(), key, e.getMessage());
			}

			@Override
			public void handleCacheEvictError(RuntimeException e, Cache cache, Object key) {
				log.warn("Cache clear failed ({} {}): {}", cache.getName(), key, e.getMessage());
			}

			@Override
			public void handleCacheClearError(RuntimeException e, Cache cache) {
				log.warn("Cache clear failed ({}): {}", cache.getName(), e.getMessage());
			}
		};
	}
}
