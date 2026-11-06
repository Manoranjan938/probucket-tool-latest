package com.tool.ProjectTool.service;

import java.time.Instant;
import java.util.Comparator;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.tool.ProjectTool.entity.ActivityLog;
import com.tool.ProjectTool.entity.ActivityType;
import com.tool.ProjectTool.entity.ProjectTask;
import com.tool.ProjectTool.entity.Users;
import com.tool.ProjectTool.model.response.ActivityPageResponse;
import com.tool.ProjectTool.model.response.ActivityPersonResponse;
import com.tool.ProjectTool.model.response.ActivityResponse;
import com.tool.ProjectTool.repo.ActivityLogRepository;

@Service
public class ActivityService {

	private static final int PROJECT_FEED_SIZE = 10;

	private static final int TASK_FEED_SIZE = 50;

	static final int LOG_PAGE_SIZE = 30;

	@Autowired
	private ActivityLogRepository activityRepo;

	public void recordTaskActivity(ActivityType type, ProjectTask task, String oldValue, String newValue) {

		ActivityLog activity = newActivity(type, task.getProjectIdentifier());
		activity.setTaskSequence(task.getProjectSequence());
		activity.setTaskName(task.getTaskName());
		activity.setOldValue(oldValue);
		activity.setNewValue(newValue);

		activityRepo.save(activity);
	}

	public void recordMemberAdded(String projectIdentifier, String memberName) {

		ActivityLog activity = newActivity(ActivityType.MEMBER_ADDED, projectIdentifier);
		activity.setNewValue(memberName);

		activityRepo.save(activity);
	}

	public List<ActivityResponse> getProjectActivity(String projectIdentifier) {

		return activityRepo
				.findByProjectIdentifierOrderByCreatedAtDescIdDesc(projectIdentifier, PageRequest.of(0, PROJECT_FEED_SIZE))
				.stream().map(this::toResponse).toList();
	}

	/**
	 * The project's full log, newest first, LOG_PAGE_SIZE entries at a time. Every filter is optional.
	 *
	 * @param before the id of the last entry already shown; the page continues after it
	 * @param from   earliest time, inclusive
	 * @param to     latest time, exclusive
	 */
	public ActivityPageResponse getProjectActivityLog(String projectIdentifier, Long before, String actorId,
			List<ActivityType> types, Instant from, Instant to) {

		Specification<ActivityLog> spec = (root, query, cb) -> cb.equal(root.get("projectIdentifier"),
				projectIdentifier);

		if (before != null) {
			// Continues from where the previous page ended, so entries added since then don't shift the pages
			ActivityLog last = activityRepo.findById(before)
					.filter(activity -> projectIdentifier.equals(activity.getProjectIdentifier())).orElse(null);
			if (last == null) {
				return new ActivityPageResponse(List.of(), false);
			}
			Date lastAt = last.getCreatedAt();
			spec = spec.and((root, query, cb) -> cb.or(cb.lessThan(root.get("createdAt"), lastAt),
					cb.and(cb.equal(root.get("createdAt"), lastAt), cb.lessThan(root.get("id"), before))));
		}
		if (actorId != null && !actorId.isBlank()) {
			spec = spec.and((root, query, cb) -> cb.equal(root.get("actorId"), actorId));
		}
		if (types != null && !types.isEmpty()) {
			// The type is stored as its name
			List<String> names = types.stream().map(ActivityType::name).toList();
			spec = spec.and((root, query, cb) -> root.get("type").in(names));
		}
		if (from != null) {
			Date fromAt = Date.from(from);
			spec = spec.and((root, query, cb) -> cb.greaterThanOrEqualTo(root.get("createdAt"), fromAt));
		}
		if (to != null) {
			Date toAt = Date.from(to);
			spec = spec.and((root, query, cb) -> cb.lessThan(root.get("createdAt"), toAt));
		}

		// One more than a page, to know whether there is another one
		List<ActivityLog> found = activityRepo.findBy(spec,
				q -> q.sortBy(Sort.by(Sort.Order.desc("createdAt"), Sort.Order.desc("id"))).limit(LOG_PAGE_SIZE + 1)
						.all());
		boolean hasMore = found.size() > LOG_PAGE_SIZE;

		return new ActivityPageResponse(
				found.stream().limit(LOG_PAGE_SIZE).map(this::toResponse).toList(), hasMore);
	}

	/** Everyone who has made a change in the project, by their latest name, sorted by name */
	public List<ActivityPersonResponse> getProjectActivityPeople(String projectIdentifier) {

		Map<String, String> names = new LinkedHashMap<>();
		activityRepo.findActors(projectIdentifier)
				.forEach(actor -> names.putIfAbsent(actor.getActorId(), actor.getActorName()));

		return names.entrySet().stream().map(entry -> new ActivityPersonResponse(entry.getKey(), entry.getValue()))
				.sorted(Comparator.comparing(ActivityPersonResponse::name,
						Comparator.nullsLast(String.CASE_INSENSITIVE_ORDER)))
				.toList();
	}

	public List<ActivityResponse> getTaskActivity(String taskSequence) {

		return activityRepo.findByTaskSequenceOrderByCreatedAtDescIdDesc(taskSequence, PageRequest.of(0, TASK_FEED_SIZE))
				.stream().map(this::toResponse).toList();
	}

	// The actor comes from the login, never from the request, so an entry can't name someone else
	private ActivityLog newActivity(ActivityType type, String projectIdentifier) {

		ActivityLog activity = new ActivityLog();
		activity.setType(type);
		activity.setProjectIdentifier(projectIdentifier);

		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		if (auth != null && auth.getPrincipal() instanceof Users actor) {
			activity.setActorId(actor.getUserId());
			activity.setActorName(actor.getName());
		}

		return activity;
	}

	private ActivityResponse toResponse(ActivityLog activity) {
		return new ActivityResponse(activity.getId(), activity.getType(), activity.getActorName(),
				activity.getTaskSequence(), activity.getTaskName(), activity.getOldValue(), activity.getNewValue(),
				activity.getCreatedAt());
	}

}
