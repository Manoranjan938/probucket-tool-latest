import React from "react";
import { FaListUl } from "react-icons/fa";

import "./BoardPreview.css";

import { boardColumns } from "features/landing/data";

const BoardPreview = () => {
  return (
    <div
      className="landing__board"
      role="img"
      aria-label="Preview of a ProBucket task board with To Do, In Progress and Completed columns"
    >
      <div className="landing__board__bar">
        <span className="landing__board__dot" />
        <span className="landing__board__dot" />
        <span className="landing__board__dot" />
        <span className="landing__board__title">Your Work</span>
      </div>
      <div className="landing__board__columns">
        {boardColumns.map((column) => (
          <div className="landing__board__column" key={column.type}>
            <div className="landing__board__column__header">
              <span className={`landing__board__status landing__board__status--${column.type}`} />
              <h3>{column.title}</h3>
              <span className="landing__board__count">{column.tasks.length}</span>
            </div>
            {column.tasks.map((task) => (
              <div className="landing__board__card" key={task.key}>
                <p>{task.name}</p>
                <div className="landing__board__card__meta">
                  <span className="landing__board__key">{task.key}</span>
                  <span
                    className={`landing__board__priority landing__board__priority--${task.priority.toLowerCase()}`}
                  >
                    {task.priority}
                  </span>
                  {task.subtasks && (
                    <span className="landing__board__subtasks">
                      <FaListUl /> {task.subtasks}
                    </span>
                  )}
                  <img src={task.avatar} alt="" />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BoardPreview;
