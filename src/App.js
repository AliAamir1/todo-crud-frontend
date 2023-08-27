import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
function App() {
  const [todos, setTodos] = useState([]);
  const [todoText, setTodoText] = useState("");
  console.log(process.env.API_URL);
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/todos`
      );
      setTodos(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const addTodo = async () => {
    if (todoText) {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/todos`,
          {
            text: todoText,
          }
        );
        setTodos([...todos, response.data]);
        setTodoText("");
      } catch (error) {
        console.error(error);
      }
    }
  };

  const toggleCompleted = async (id, completed) => {
    try {
      await axios.patch(`${process.env.REACT_APP_API_URL}/api/todos/${id}`, {
        completed: !completed,
      });
      const updatedTodos = todos.map((todo) =>
        todo._id === id ? { ...todo, completed: !completed } : todo
      );
      setTodos(updatedTodos);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/todos/${id}`);
      const updatedTodos = todos.filter((todo) => todo._id !== id);
      setTodos(updatedTodos);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="App">
      <h1>Todo List</h1>
      <input
        type="text"
        value={todoText}
        onChange={(e) => setTodoText(e.target.value)}
      />
      <button onClick={addTodo}>Add Todo</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo._id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleCompleted(todo._id, todo.completed)}
            />
            {todo.text}
            <button onClick={() => deleteTodo(todo._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
