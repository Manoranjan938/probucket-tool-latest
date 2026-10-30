import React from "react";
import { FaListUl } from "react-icons/fa";

import { boardColumns } from "features/landing/data";

// Keyed by column.type
const statusClasses: Record<string, string> = {
  todo: "bg-[#a3a1b8]",
  inprogress: "bg-[#e9a23b]",
  completed: "bg-[#2fa36b]",
};

// Keyed by the lowercased task.priority
const priorityClasses: Record<string, string> = {
  high: "bg-[#fdeaea] text-[#b42318]",
  medium: "bg-[#fdf3e2] text-[#93590b]",
  low: "bg-[#e7f6ee] text-[#1c7a4c]",
};

const BoardPreview = () => {
  return (
    <div
      className="max-w-[980px] mt-16 mx-auto mb-0 border border-brand-border rounded-brand bg-brand-surface shadow-[0_2px_4px_rgba(31,29,58,0.04),0_24px_60px_rgba(95,89,201,0.14)] overflow-hidden max-[768px]:mt-12"
      role="img"
      aria-label="Preview of a ProBucket task board with To Do, In Progress and Completed columns"
    >
      <div className="flex items-center gap-1.5 py-3 px-4 border-b border-brand-border bg-brand-surface-alt">
        <span className="w-2.5 h-2.5 rounded-[50%] bg-brand-border" />
        <span className="w-2.5 h-2.5 rounded-[50%] bg-brand-border" />
        <span className="w-2.5 h-2.5 rounded-[50%] bg-brand-border" />
        <span className="ml-3 text-[13px] font-semibold text-brand-muted">Your Work</span>
      </div>
      <div className="grid grid-cols-[repeat(3,1fr)] gap-4 p-5 text-left max-[768px]:grid-cols-[1fr] max-[768px]:p-3.5">
        {boardColumns.map((column) => (
          <div className="flex flex-col gap-2.5 p-3 rounded-[10px] bg-brand-surface-alt" key={column.type}>
            <div className="flex items-center gap-2 pt-0.5 px-1 pb-1">
              <span className={`w-2 h-2 rounded-[50%] ${statusClasses[column.type]}`} />
              <h3 className="m-0 text-[13px] font-bold tracking-[0.04em] uppercase text-brand-ink">{column.title}</h3>
              <span className="ml-auto px-2 rounded-[999px] bg-brand-border text-[12px] font-semibold text-brand-text">
                {column.tasks.length}
              </span>
            </div>
            {column.tasks.map((task) => (
              <div
                className="p-3 border border-brand-border rounded-lg bg-brand-surface shadow-[0_1px_2px_rgba(31,29,58,0.05)]"
                key={task.key}
              >
                <p className="mb-2.5 text-[14px] font-medium leading-[1.4] text-brand-ink">{task.name}</p>
                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-semibold text-brand-muted">{task.key}</span>
                  <span
                    className={`py-px px-[7px] rounded-[4px] text-[11px] font-bold tracking-[0.03em] ${priorityClasses[task.priority.toLowerCase()]}`}
                  >
                    {task.priority}
                  </span>
                  {task.subtasks && (
                    <span className="inline-flex items-center gap-1 text-[12px] text-brand-muted">
                      <FaListUl /> {task.subtasks}
                    </span>
                  )}
                  <img src={task.avatar} alt="" className="w-[22px] h-[22px] ml-auto rounded-[50%]" />
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
