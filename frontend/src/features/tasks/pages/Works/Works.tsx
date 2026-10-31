import React, { useEffect, useState } from "react";
import Helmet from "react-helmet";
import { connect, type ConnectedProps } from "react-redux";
import { useLocation } from "react-router-dom";
import { compose } from "redux";
import { FiInbox, FiPlus } from "react-icons/fi";

import * as task from "features/tasks/styles/taskClasses";

import { getAllTask } from "features/tasks/store/taskAction";
import NewTask from "features/tasks/components/NewTask/NewTask";
import TeamWorkHeader from "features/tasks/components/TeamWorkHeader/TeamWorkHeader";
import ProjectWorks from "features/tasks/components/ProjectWorks/ProjectWorks";
import TaskDetailsView from "features/tasks/components/TaskDetailsView/TaskDetailsView";
import { BoardSkeleton } from "features/tasks/pages/Works/WorksSkeleton";
import useGetTaskLists from "features/tasks/hooks/useGetTaskLists";
import type { AppDispatch, RootState } from "app/store";
import type { TaskListItem } from "features/tasks/types";

const Works = ({ title, getTaskList, myTasks }: { title: string } & Props) => {
  const [, getTaskLists] = useGetTaskLists();
  const [loading, setLoading] = useState(true);
  const [showNewTask, setShowNewTask] = useState(false);
  const [openTask, setOpenTask] = useState<string | null>(null);

  const { pathname, search } = useLocation();
  const query = new URLSearchParams(search);
  const projectId = query.get("project");
  const name = query.get("name");
  const isTeam = pathname.startsWith("/project/team/");

  const loadTasks = async () => {
    try {
      const resp = await getTaskLists(name);
      getTaskList(resp.data);
    } catch {
      // The backend answers 400 "Task not found" when the project has no tasks
      getTaskList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const tasks = myTasks ?? [];

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

      {loading ? (
        <BoardSkeleton />
      ) : tasks.length > 0 ? (
        <ProjectWorks
          tasks={tasks}
          selectedTask={openTask}
          onOpenTask={setOpenTask}
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
        onCreated={loadTasks}
        projectIdentifier={name}
      />
      <TaskDetailsView sequence={openTask} onClose={() => setOpenTask(null)} onTaskChanged={loadTasks} />
    </div>
  );
};

function mapDispatchToProps(dispatch: AppDispatch) {
  return {
    getTaskList: (data: TaskListItem[] | undefined) => dispatch(getAllTask(data)),
  };
}

const mapStateToProps = (state: RootState) => ({
  myTasks: state.tasks.allTask,
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof withConnect>;

export default compose(withConnect)(Works);
