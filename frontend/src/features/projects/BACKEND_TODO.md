# Project settings: backend checklist

The Project settings page is built frontend first. Every item below still needs backend work before its "Coming soon" label can go.
Search the code for `TODO(project-backend)` to find the matching spots in the frontend.

## Do first

- [ ] **Only the project lead can rename a project.** `PUT /project/updateProject` has no owner check, so any logged-in user can rename any project. The frontend only hides the form from everyone else.
- [ ] **Reject a blank project name on the server.** `UpdateProjectRequest` has no validation, so only the browser checks it today.
- [ ] **Only the project lead can delete a project.** `PUT /project/deleteProject/{projectId}/{userId}` only checks that `userId` is the caller, not that the caller owns the project.

## Coming soon on the page

- [ ] **Description.** `projects.project_description` is saved when the project is created, but `getProjectDetails` doesn't return it and `updateProject` can't change it.
- [ ] **Project icon.** `projects.project_image` exists and is returned as `projectAvatar`, but nothing sets it and there is no upload endpoint. First decide where files are stored.
- [ ] **Change project lead.** The lead is stored as `projects.user_id` and as a copied name in `projects.project_leader`, so both must change. The lead isn't in `team_details` but other members are, so decide what happens to the old and new lead there. Also decide who gets which role in `user_details.role_name`.
- [ ] **Default assignee.** `UpdateProjectRequest.defaultAssignee` exists, but the service ignores it and `projects` has no column for it. Creating a task must then use it.
- [ ] **Archive project.** Needs a state to store, the rules for what an archived project allows, a place to list archived projects, and a way to bring one back.
- [ ] **Delete project, with restore.**
  - `deleteProject` only sets `status = 0`. `getProjectsByUserId`, `getProjectsByTeamMember` and `findByProjectId` never check `status`, so a deleted project still appears and opens.
  - Filter deleted projects out of those queries.
  - Add an endpoint to restore a project, and decide how long deleted projects are kept (most tools keep them 30 days).
  - Decide where deleted projects are listed. The Trash page is inside a project, so it can't show a deleted one. The Projects page is the obvious place.

## Not shown on the page

- [ ] **Project template.** `projects.project_template_type` is saved but not returned. Return it and add it to the details in `ProjectGeneralCard`.

## Later, deliberately left off the page

- Changing the project key: task IDs are built from it, and it's stored in `projects`, `backlog`, `project_task`, `activity_log` and the task sequences. Jira keeps old keys working when one changes, so that would need planning too.
- Custom statuses: To do, In progress and Completed are hard-coded in the SQL and the frontend.
- Labels and automation: neither exists in the app yet.
- Visibility and per-project roles: project membership checks have to come first.
- Notification settings: there is no notification system to configure yet.
