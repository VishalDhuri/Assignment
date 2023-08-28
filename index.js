npm install express body-parser pg
 dex-screener-ui
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db'); // Your database connection

const app = express();
const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());

// Get all tasks
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await db.query('SELECT * FROM tasks');
    res.json(tasks.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create a new task
app.post('/tasks', async (req, res) => {
  const { title, description } = req.body;
  try {
    const newTask = await db.query(
      'INSERT INTO tasks (title, description, status) VALUES ($1, $2, $3) RETURNING *',
      [title, description, 'To Do']
    );
    res.status(201).json(newTask.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update task status
app.put('/tasks/:id', async (req, res) => {
  const taskId = req.params.id;
  const { status } = req.body;
  try {
    const updatedTask = await db.query(
      'UPDATE tasks SET status = $1 WHERE id = $2 RETURNING *',
      [status, taskId]
    );
    res.json(updatedTask.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a task
app.delete('/tasks/:id', async (req, res) => {
  const taskId = req.params.id;
  try {
    await db.query('DELETE FROM tasks WHERE id = $1', [taskId]);
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
const { Pool } = require('pg');

const pool = new Pool({
  user: 'your_username',
  host: 'localhost',
  database: 'your_database_name',
  password: 'your_password',
  port: 5432, // default PostgreSQL port
});

module.exports = pool;
npx create-react-app kanban-board
cd kanban-board
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
// src/components/DataDisplay.js
import React from 'react';

const DataDisplay = ({ data }) => {
  return (
    <div>
      {/* Display fetched data here */}
    </div>
  );
};

export default DataDisplay;
// src/components/DataFetcher.js
import React, { useState, useEffect } from 'react';

const DataFetcher = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fetch data from API endpoints
    // Update the 'data' state with the fetched data
  }, []);

  return (
    // Render your fetched data here
  );
};

export default DataFetcher;
