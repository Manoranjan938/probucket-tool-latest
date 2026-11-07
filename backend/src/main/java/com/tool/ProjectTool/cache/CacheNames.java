package com.tool.ProjectTool.cache;

/**
 * The Redis caches and what each is keyed by. CacheConfig gives each its value type; CacheClearer clears them
 * when the data behind them changes. Entries also expire after CacheConfig.TTL in case a clear is missed.
 */
public final class CacheNames {

	/** The logged-in user, read on every request by the auth filter. Key: userId */
	public static final String USERS = "users";

	/** A lead's own projects (Projects page). Key: the lead's userId */
	public static final String PROJECTS = "projects";

	/** One project (dashboard, settings). Key: projectId */
	public static final String PROJECT_DETAILS = "projectDetails";

	/** A lead's Recently deleted list. Key: the lead's userId */
	public static final String DELETED_PROJECTS = "deletedProjects";

	/** A project's team list. Key: projectId */
	public static final String TEAM_MEMBERS = "teamMembers";

	/** The projects someone is a team member of. Key: userId */
	public static final String TEAM_PROJECTS = "teamProjects";

	/** The dashboard's latest project activity. Key: projectIdentifier */
	public static final String PROJECT_ACTIVITY = "projectActivity";

	/** Pages of the Activity page. Key: projectIdentifier plus every filter */
	public static final String ACTIVITY_LOG = "activityLog";

	/** Who has made changes in a project (Activity page filter). Key: projectIdentifier */
	public static final String ACTIVITY_PEOPLE = "activityPeople";

	/** A task's history. Key: task sequence, e.g. AB-1 */
	public static final String TASK_ACTIVITY = "taskActivity";

	/** A task's comments. Key: task sequence */
	public static final String COMMENTS = "comments";

	/** Someone's notes in a project. Key: userId:projectId */
	public static final String NOTES = "notes";

	/** One note. Key: note id */
	public static final String NOTE_DETAILS = "noteDetails";

	private CacheNames() {
	}
}
