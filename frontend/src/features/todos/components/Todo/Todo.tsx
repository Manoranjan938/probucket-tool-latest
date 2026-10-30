import React from 'react'

import type { TodoItem } from 'features/todos/types'

// Keyed by todoItems.status
const statusClasses: Record<string, string> = {
  done: "w-auto py-[3px] px-2 rounded-[3px] bg-[#40fc98] text-[12px] font-semibold text-white capitalize",
  pending: "w-auto py-[3px] px-2 rounded-[3px] bg-[#fbc536] text-[12px] font-semibold text-white capitalize",
};

const Todo = ({todoItems}: { todoItems: TodoItem }) => {

  const truncate = (string: string, n: number) => {
    return string?.length > n ? string.substr(0, n - 1) + "..." : string;
  };

  return (
    <>
      <div className="w-[250px] py-[5px] px-[15px] rounded-[5px] shadow-[1px_1px_10px_#0006] max-[1400px]:w-[210px]">
        <div className="w-[80%]">
          <span>{truncate(todoItems.title, 30)}</span>
        </div>
        <div className="flex justify-between items-center mt-2.5">
          <div className="w-[180px] max-[1400px]:w-[150px]">
            <span className={statusClasses[todoItems.status]}>{todoItems.status}</span>
          </div>
          <div>
            <button className="w-[100px] py-[3px] px-0 border-none rounded-[3px] bg-[#827ED8] font-semibold text-white cursor-pointer max-[1400px]:w-[90px]">Add to Task</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Todo