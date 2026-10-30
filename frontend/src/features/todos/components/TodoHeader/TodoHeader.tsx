import TodoForm from "features/todos/components/TodoForm/TodoForm";
import React, { useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { TodoItem } from "features/todos/types";

interface TodoHeaderProps {
  todoData: TodoItem[];
  setFilteredTodo: Dispatch<SetStateAction<TodoItem[]>>;
  activeBtn: string;
  setActiveBtn: Dispatch<SetStateAction<string>>;
}

import "./TodoHeader.css";

const TodoHeader = ({ todoData, setFilteredTodo, activeBtn, setActiveBtn }: TodoHeaderProps) => {

  const [openForm, setOpenForm] = useState(false);

  useEffect(() => {
    if (activeBtn === "all") {
      setFilteredTodo(todoData);
      return;
    }

    const filtered = todoData.filter((todo) => todo.status.includes(activeBtn));
    setFilteredTodo(filtered);
  }, [activeBtn]);

  const openTodoForm = () => {
    setOpenForm(!openForm);
  }

  return (
    <>
      <div className="todo_header_component">
        <div className="header_details">
          <div className="todo_header_tabs">
            <span
              className={activeBtn === "all" ? "active_tab" : undefined}
              onClick={() => setActiveBtn("all")}
            >
              All
            </span>
            <span
              className={activeBtn === "done" ? "active_tab" : undefined}
              onClick={() => setActiveBtn("done")}
            >
              Completed
            </span>
            <span
              className={activeBtn === "pending" ? "active_tab" : undefined}
              onClick={() => setActiveBtn("pending")}
            >
              Pending
            </span>
          </div>
          <div className="todo_header">
            <button className="btn" onClick={openTodoForm}>Create a Todo</button>
          </div>
        </div>
      </div>
      {openForm && <TodoForm open={openForm} setOpen={setOpenForm} />}
    </>
  );
};

export default TodoHeader;
