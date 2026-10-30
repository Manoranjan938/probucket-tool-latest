import React from 'react'

import './Todo.css'
import type { TodoItem } from 'features/todos/types'

const Todo = ({todoItems}: { todoItems: TodoItem }) => {

  const truncate = (string: string, n: number) => {
    return string?.length > n ? string.substr(0, n - 1) + "..." : string;
  };

  return (
    <>
      <div className="todo__card">
        <div className="todo__title">
          <span>{truncate(todoItems.title, 30)}</span>
        </div>
        <div className="todo__extras">
          <div className="status">
            <span className={todoItems.status}>{todoItems.status}</span>
          </div>
          <div className="task__btn">
            <button className="btn__task">Add to Task</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Todo