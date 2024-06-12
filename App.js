import React, { useState, useEffect } from 'react';
import './App.css';
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';
import { BsCheckCircle } from 'react-icons/bs';

function App() {
  const [isCompleteScreen, setIsCompleteScreen] = useState(false);
  const [allTodos, setTodos] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [completedTasks, setCompletedTasks] = useState([]);
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTaskText, setEditTaskText] = useState('');

  useEffect(() => {
    const savedTodos = JSON.parse(localStorage.getItem('todos'));
    const savedCompletedTasks = JSON.parse(localStorage.getItem('completedTasks'));
    if (savedTodos) {
      setTodos(savedTodos);
    }
    if (savedCompletedTasks) {
      setCompletedTasks(savedCompletedTasks);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(allTodos));
  }, [allTodos]);

  useEffect(() => {
    localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
  }, [completedTasks]);

  const handleAddTodo = () => {
    if (newTask.trim() === '') return;

    const newTodoItem = {
      id: Date.now(),
      task: newTask,
      completed: false,
    };

    setTodos([...allTodos, newTodoItem]);
    setNewTask('');
  };

  const handleDeleteTodo = (id) => {
    const updatedTodos = allTodos.filter(todo => todo.id !== id);
    setTodos(updatedTodos);
  };

  const handleToggleComplete = (id) => {
    const updatedTodos = allTodos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);

    const completedTask = allTodos.find(todo => todo.id === id);
    if (completedTask) {
      setCompletedTasks([...completedTasks, completedTask]);
    }
  };

  const handleDeleteCompletedTask = (id) => {
    const updatedCompletedTasks = completedTasks.filter(task => task.id !== id);
    setCompletedTasks(updatedCompletedTasks);
  };

  const handleEditTask = (id, task) => {
    setEditTaskId(id);
    setEditTaskText(task);
  };

  const handleUpdateTask = () => {
    const updatedTodos = allTodos.map(todo =>
      todo.id === editTaskId ? { ...todo, task: editTaskText } : todo
    );
    setTodos(updatedTodos);
    setEditTaskId(null);
    setEditTaskText('');
  };

  return (
    <div className="App">

      <h1>Task Manager</h1>
      <h2>To-do-list</h2>

      <div className="todo-input">
        <input
          type="text"
          placeholder="Enter your task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button onClick={handleAddTodo}>Add Task</button>
      </div>

      <div className="tabs">
        <button className={!isCompleteScreen ? 'active' : ''} onClick={() => setIsCompleteScreen(false)}>Todo</button>
        <button className={isCompleteScreen ? 'active' : ''} onClick={() => setIsCompleteScreen(true)}>Completed</button>
      </div>

      {isCompleteScreen ? (
        <div className="todo-list">
          {completedTasks.map(task => (
            <div className="todo-item" key={task.id}>
              <div className="task-details">
                <p>{task.task}</p>
              </div>
              <div className="action-buttons">
                <AiOutlineDelete
                  className="delete-icon"
                  onClick={() => handleDeleteCompletedTask(task.id)}
                  title="Delete Task"
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="todo-list">
          {allTodos.map(todo => (
            <div className={`todo-item ${todo.completed ? 'completed' : ''}`} key={todo.id}>
              <div className="task-details">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleToggleComplete(todo.id)}
                />
                {editTaskId === todo.id ? (
                  <input
                    type="text"
                    value={editTaskText}
                    onChange={(e) => setEditTaskText(e.target.value)}
                  />
                ) : (
                  <p>{todo.task}</p>
                )}
              </div>
              <div className="action-buttons">
                {editTaskId === todo.id ? (
                  <button onClick={handleUpdateTask}>Update</button>
                ) : (
                  <>
                    <BsCheckCircle
                      className="check-icon"
                      onClick={() => handleToggleComplete(todo.id)}
                      title="Toggle Complete"
                    />
                    <AiOutlineEdit
                      className="edit-icon"
                      onClick={() => handleEditTask(todo.id, todo.task)}
                      title="Edit Task"
                    />
                    <AiOutlineDelete
                      className="delete-icon"
                      onClick={() => handleDeleteTodo(todo.id)}
                      title="Delete Task"
                    />
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
