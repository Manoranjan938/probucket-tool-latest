import Todo from 'features/todos/components/Todo/Todo'
import React from 'react'

import './TodoList.css'

const TodoList = ({data}) => {

  return (
    <>
      <div className="todo__lists">
        {
          data.map((item, index) => {
            return(
              <Todo todoItems={item} key={index} />
            )
          })
        }
      </div>
    </>
  );
}

export default TodoList