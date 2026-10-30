import Todo from 'Components/TodoCard/Todo'
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