import Todo from 'features/todos/components/Todo/Todo'
import React from 'react'

import type { TodoItem } from 'features/todos/types'

const TodoList = ({data}: { data: TodoItem[] }) => {

  return (
    <>
      <div className="flex flex-wrap gap-5 w-auto my-2.5 px-5">
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