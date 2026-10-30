import TodoForm from "features/todos/components/TodoForm/TodoForm";
import React, { useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { TodoItem } from "features/todos/types";
import { button } from "shared/styles/sharedClasses";

interface TodoHeaderProps {
  todoData: TodoItem[];
  setFilteredTodo: Dispatch<SetStateAction<TodoItem[]>>;
  activeBtn: string;
  setActiveBtn: Dispatch<SetStateAction<string>>;
}

const tab =
  "py-1.5 px-5 border border-[#827ed8] rounded-[5px] uppercase font-bold text-[#827ed8] hover:cursor-pointer hover:text-white hover:bg-[#827ed8] hover:rounded-[5px] hover:[transition:color_.3s_ease-in]";
const activeTab = `${tab} cursor-pointer bg-[#827ed8] text-white!`;

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
      <div className="w-auto px-5">
        <div className="flex justify-between items-center border-b-2 border-[#777]">
          <div className="flex items-center gap-5">
            <span
              className={activeBtn === "all" ? activeTab : tab}
              onClick={() => setActiveBtn("all")}
            >
              All
            </span>
            <span
              className={activeBtn === "done" ? activeTab : tab}
              onClick={() => setActiveBtn("done")}
            >
              Completed
            </span>
            <span
              className={activeBtn === "pending" ? activeTab : tab}
              onClick={() => setActiveBtn("pending")}
            >
              Pending
            </span>
          </div>
          <div>
            <button className={button} onClick={openTodoForm}>Create a Todo</button>
          </div>
        </div>
      </div>
      {openForm && <TodoForm open={openForm} setOpen={setOpenForm} />}
    </>
  );
};

export default TodoHeader;
