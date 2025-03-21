import React, { useState } from 'react';
import TaskBoard from './TaskBoard';
import ChatInterface from './ChatInterface';
import { generateTasksFromPrompt } from './api';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState(['Ayush Garg', 'Debarka Chakraborti', 'Ganapuram Bhoomika','Harika Srutakeerti','Katta Abhigna Reddy','Kemburu Poorna Sai Krishna','Naga Venkata Akshaya Juluri']);
  const [categories, setCategories] = useState(['Bug', 'Feature', 'Documentation', 'Design']);
  
  const handlePromptSubmit = async (prompt, options) => {
    try {
      const newTasks = await generateTasksFromPrompt(prompt, options);
      setTasks([...tasks, ...newTasks]);
    } catch (error) {
      console.error("Error generating tasks:", error);
    }
  };

  const handleTaskMove = (taskId, newStatus) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  const handleTaskEdit = (taskId, updatedTask) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, ...updatedTask } : task
    ));
  };

  const handleTaskDelete = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Task Board App</h1>
      </header>
      <main className="app-main">
        <ChatInterface onSubmitPrompt={handlePromptSubmit} users={users} categories={categories} />
        <TaskBoard 
          tasks={tasks} 
          onTaskMove={handleTaskMove} 
          onTaskEdit={handleTaskEdit} 
          onTaskDelete={handleTaskDelete}
          users={users}
          categories={categories}
        />
      </main>
    </div>
  );
}

export default App;