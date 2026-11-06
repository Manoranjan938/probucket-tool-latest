import React, { useEffect, useState } from "react";
import Helmet from "react-helmet";
import { useLocation } from "react-router-dom";
import { FiInbox, FiPlus } from "react-icons/fi";

import * as task from "features/tasks/styles/taskClasses";

import NewTask from "features/tasks/components/NewTask/NewTask";
import TeamWorkHeader from "features/tasks/components/TeamWorkHeader/TeamWorkHeader";
import ProjectWorks from "features/tasks/components/ProjectWorks/ProjectWorks";
import TaskDetailsView from "features/tasks/components/TaskDetailsView/TaskDetailsView";
import { BoardSkeleton } from "features/tasks/pages/Works/WorksSkeleton";
import { useGetTasksQuery } from "features/tasks/api/tasksApi";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { clearSelectedTask, selectTask } from "features/tasks/store/tasksSlice";

const Works = ({ title }: { title: string }) => {
  const openTask = useAppSelector((state) => state.tasks.selectedTaskSequence);
  const dispatch = useAppDispatch();
  const [showNewTask, setShowNewTask] = useState(false);

  const { pathname, search } = useLocation();
  const query = new URLSearchParams(search);
  const projectId = query.get("project");
  const name = query.get("name");
  const isTeam = pathname.startsWith("/project/team/");

  // Shown as empty if they couldn't be loaded
  const { data: tasks = [], isLoading } = useGetTasksQuery(name);

  const openTaskDetails = (sequence: string) => dispatch(selectTask(sequence));

  // Leaving the board closes the panel, so it isn't open again on the next visit
  useEffect(() => {
    return () => {
      dispatch(clearSelectedTask());
    };
  }, [dispatch]);

  return (
    <div className={task.page}>
      <Helmet>
        <title>{title} | Tasks</title>
      </Helmet>

      <div className={task.toolbar}>
        <div className={task.toolbarStart}>
          {isTeam ? (
            <TeamWorkHeader projectId={projectId} />
          ) : (
            <p className={task.taskCount}>
              {tasks.length > 0 ? `${tasks.length} ${tasks.length === 1 ? "task" : "tasks"}` : ""}
            </p>
          )}
        </div>
        <button type="button" className={`${task.btnPrimary} ${task.toolbarButton}`} onClick={() => setShowNewTask(true)}>
          <FiPlus aria-hidden="true" />
          New task
        </button>
      </div>

      {isLoading ? (
        <BoardSkeleton />
      ) : tasks.length > 0 ? (
        <ProjectWorks
          tasks={tasks}
          selectedTask={openTask}
          onOpenTask={openTaskDetails}
          onNewTask={() => setShowNewTask(true)}
        />
      ) : (
        <div className={task.empty}>
          <span className={task.emptyIcon} aria-hidden="true">
            <FiInbox />
          </span>
          <h2 className={task.emptyTitle}>No tasks yet</h2>
          <p className={task.emptyText}>Create your first task to start planning the work on this project.</p>
          <button type="button" className={task.btnPrimary} onClick={() => setShowNewTask(true)}>
            <FiPlus aria-hidden="true" />
            Create task
          </button>
        </div>
      )}

      <NewTask
        open={showNewTask}
        onClose={() => setShowNewTask(false)}
        projectIdentifier={name}
      />
      <TaskDetailsView
        sequence={openTask}
        onClose={() => dispatch(clearSelectedTask())}
        onOpenTask={openTaskDetails}
      />
    </div>
  );
};

export default Works;
