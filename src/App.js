import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const createTask = async () => {
    if (!title || !description) return;
    try {
      const response = await axios.post('/tasks', { title, description });
      setTasks([...tasks, response.data]);
      setTitle('');
      setDescription('');
    } catch (error) {
      console.error(error);
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      const response = await axios.put(`/tasks/${taskId}`, { status: newStatus });
      const updatedTasks = tasks.map(task => (task.id === taskId ? { ...task, status: newStatus } : task));
      setTasks(updatedTasks);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`/tasks/${taskId}`);
      const updatedTasks = tasks.filter(task => task.id !== taskId);
      setTasks(updatedTasks);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="App">
      <div className="column">
        <h2>To Do</h2>
        <div className="tasks">
          {tasks.filter(task => task.status === 'To Do').map(task => (
            <div
              key={task.id}
              className="task"
              draggable
              onDragStart={() => console.log('Drag start')}
              onDragEnd={() => updateTaskStatus(task.id, 'Doing')}
            >
              <div>{task.title}</div>
              <div>{task.description}</div>
              <button onClick={() => deleteTask(task.id)}>Delete</button>
            </div>
          ))}
        </div>
      </div>
      <div className="column">
        {/* Similar JSX code for 'Doing' and 'Done' columns */}
      </div>
      <div className="add-task">
        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Task description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button onClick={createTask}>Add Task</button>
      </div>
    </div>
  );
}

export default App;
