import React from "react";
import { FiMoreHorizontal, FiPlus } from "react-icons/fi";

import * as task from "features/tasks/styles/taskClasses";

import WorkTask from "features/tasks/components/WorkTask/WorkTask";
import { taskStatuses } from "features/tasks/data";
import type { TaskListItem } from "features/tasks/types";

const columns = ["TODO", "INPROGRESS", "COMPLETED"];

interface ProjectWorksProps {
  tasks: TaskListItem[];
  /** Sequence of the task whose details are open */
  selectedTask: string | null;
  onOpenTask: (sequence: string) => void;
  onNewTask: () => void;
}

// The task board: one column per status
const ProjectWorks = ({ tasks, selectedTask, onOpenTask, onNewTask }: ProjectWorksProps) => {
  return (
    <div className={task.board}>
      {columns.map((status) => {
        const style = taskStatuses[status];
        const columnTasks = tasks.filter((item) => item.status === status);
        const titleId = `column-${status}`;

        return (
          <section key={status} className={task.column} aria-labelledby={titleId}>
            <div className={task.columnHeader}>
              <span className={`${task.columnDot} ${style.solid}`} aria-hidden="true" />
              <h2 id={titleId} className={task.columnTitle}>{style.label}</h2>
              <span className={task.columnCount}>{columnTasks.length}</span>
              <div className={task.columnActions}>
                {/* Column options aren't wired up yet */}
                <button type="button" className={task.iconButton} aria-label={`${style.label} options`}>
                  <FiMoreHorizontal />
                </button>
                {status === "TODO" ? (
                  <button type="button" className={task.iconButton} onClick={onNewTask} aria-label="New task">
                    <FiPlus />
                  </button>
                ) : null}
              </div>
            </div>

            {columnTasks.length > 0 ? (
              <ul className={task.cardList}>
                {columnTasks.map((item) => (
                  <li key={item.taskSequence}>
                    <WorkTask
                      taskDetails={item}
                      selected={item.taskSequence === selectedTask}
                      onOpen={onOpenTask}
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <p className={task.columnEmpty}>No tasks</p>
            )}
          </section>
        );
      })}
    </div>
  );
};

export default ProjectWorks;
