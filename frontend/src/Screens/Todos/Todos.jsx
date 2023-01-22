import TodoHeader from "Components/TodoHeader/TodoHeader";
import React, { useState } from "react";
import TodoList from "Components/TodoList/TodoList";
import { TodoData } from "./TodoData";
import Helmet from "react-helmet";

const Todos = ({ title }) => {
  const [todoData] = useState(TodoData);
  const [filteredTodo, setFilteredTodo] = useState(TodoData);
  const [activeBtn, setActiveBtn] = useState("all");

  return (
    <>
      <Helmet>
        <title>{title} | Todos</title>
      </Helmet>
      <TodoHeader
        todoData={todoData}
        setFilteredTodo={setFilteredTodo}
        activeBtn={activeBtn}
        setActiveBtn={setActiveBtn}
      />
      <TodoList data={filteredTodo} />
    </>
  );
};

export default Todos;
