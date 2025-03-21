import React from 'react';
import TaskColumn from './TaskColumn';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './TaskBoard.css';

function TaskBoard({ tasks, onTaskMove, onTaskEdit, onTaskDelete, users, categories }) {
  const todoTasks = tasks.filter(task => task.status === 'TODO');
  const inProgressTasks = tasks.filter(task => task.status === 'InProgress');
  const completedTasks = tasks.filter(task => task.status === 'Completed');

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="task-board">
        <TaskColumn 
          title="TODO" 
          tasks={todoTasks} 
          onTaskMove={onTaskMove} 
          onTaskEdit={onTaskEdit} 
          onTaskDelete={onTaskDelete} 
          users={users}
          categories={categories}
        />
        <TaskColumn 
          title="InProgress" 
          tasks={inProgressTasks} 
          onTaskMove={onTaskMove} 
          onTaskEdit={onTaskEdit} 
          onTaskDelete={onTaskDelete} 
          users={users}
          categories={categories}
        />
        <TaskColumn 
          title="Completed" 
          tasks={completedTasks} 
          onTaskMove={onTaskMove} 
          onTaskEdit={onTaskEdit} 
          onTaskDelete={onTaskDelete} 
          users={users}
          categories={categories}
        />
      </div>
    </DndProvider>
  );
}

export default TaskBoard;
