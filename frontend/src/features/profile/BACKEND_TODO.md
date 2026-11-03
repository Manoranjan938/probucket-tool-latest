# Profile page: backend checklist

The Profile page is built frontend first. Every item below still needs backend work before its "Coming soon" label can go.
Search the code for `TODO(profile-backend)` to find the matching spots in the frontend.

## Do first

- [ ] **Require the current password when changing it.** `UserService.updatePassword` only takes the user id and the new password, so anyone at an unlocked, logged-in computer can take over the account. Then add a Current password field to `ChangePasswordCard`.
- [ ] **Check password rules on the server.** `UpdatePasswordRequest` has no validation, and the 8 character minimum (`MIN_PASSWORD_LENGTH`) is only checked in the browser. Signup and password reset have no rule at all, so use one rule for all three.

## Coming soon on the page

### Profile tab

- [ ] **Edit name and phone.** `/user/updateMe` checks the numeric database id (`principal.id`), but the frontend only has the string `userId` from `/auth/me`. Accept the string id. `/auth/me` or `/user/me/{email}` must also return the phone. Refresh the signed-in user in the store after saving.
  - Decide what a rename does to the copies of the name in `project_leader`, `comments.username`, `activity_log.actor_name` and `deleted_by`. They keep the old name today.
- [ ] **Change email.** Stays read-only until this is done. `updateUser` changes `email` but not `username`, and login looks up `username`, while password reset and task assignment look up `email`. Also needs a duplicate check, and confirmation from both the old and new address.
- [ ] **Photo upload.** `user_details.image_url` exists but nothing sets it, and there is no upload endpoint. First decide where files are stored.
- [ ] **Job title and about me.** New columns, returned by the user endpoints and saved with the name and phone.
- [ ] **Out of office.** New fields for the dates, then show the status where people pick an assignee.
- [ ] **My work.** `/task/getTasksByAssignee/{email}` exists, but the frontend has never used it, so test it first. It needs the project id, name and type plus the due date. A task also can't be linked to yet, because the open task on the board is not in the URL.
- [ ] **Recent activity.** `activity_log.actor_id` is stored, but there is no query or endpoint by person. Limit it to the signed-in user.

### Security tab

- [ ] **Devices.** `refresh_token` has no device, IP or last-seen data. Add those columns, an endpoint to list sessions, and one to log out a single session.

## Not shown on the page

- [ ] **Member since and verified badge.** Not sent by the API. `user_details` already has `added_date` and `email_verified`, so return them and show them in `ProfileHeader`.

## Later, deliberately left off the page

- Two-step login or passkeys: its own project.
- Notification settings: there is no notification system to configure yet.
- Teammate-visible profiles: project membership checks have to come first.
- Per-field privacy: nothing in the app is public.
- Connected accounts: the Login page has a Google button, but the backend has no OAuth dependency, so check that first.
- API keys: nothing in the app needs them yet.
