import TodoForm from "Components/TodoForm/TodoForm";
import React, { useEffect, useState } from "react";

import "./TodoHeader.css";

const TodoHeader = ({ todoData, setFilteredTodo, activeBtn, setActiveBtn }) => {

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
              className={activeBtn === "all" ? "active_tab" : null}
              onClick={() => setActiveBtn("all")}
            >
              All
            </span>
            <span
              className={activeBtn === "done" ? "active_tab" : null}
              onClick={() => setActiveBtn("done")}
            >
              Completed
            </span>
            <span
              className={activeBtn === "pending" ? "active_tab" : null}
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
