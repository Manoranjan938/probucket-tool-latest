-- ddl-auto=update does not add unique constraints to tables that already exist, so these are created here.
-- Runs on every start. If a database already has duplicates the index is skipped and the app still starts.
CREATE UNIQUE INDEX IF NOT EXISTS uk_projects_project_identifier ON projects (project_identifier);
CREATE UNIQUE INDEX IF NOT EXISTS uk_backlog_project_identifier ON backlog (project_identifier);

-- ddl-auto=update does not change column types. Due dates have no time, and nothing wrote this column before it became a date.
ALTER TABLE project_task ALTER COLUMN due_date TYPE date USING due_date::date;

-- Descriptions can be longer than the varchar(255) Hibernate first created
ALTER TABLE project_task ALTER COLUMN task_desc TYPE text;
