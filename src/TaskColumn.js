import React from 'react';
import TaskCard from './TaskCard';
import { useDrop } from 'react-dnd';
import './TaskColumn.css';

function TaskColumn({ title, tasks, onTaskMove, onTaskEdit, onTaskDelete, users, categories }) {
  const [{ isOver }, drop] = useDrop({
    accept: 'TASK',
    drop: (item) => {
      onTaskMove(item.id, title);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div 
      className={`task-column ${isOver ? 'task-column-highlight' : ''}`}
      ref={drop}
    >
      <h2 className="column-title">{title}</h2>
      <div className="column-tasks">
        {tasks.map(task => (
          <TaskCard 
            key={task.id} 
            task={task} 
            onEdit={onTaskEdit} 
            onDelete={onTaskDelete}
            users={users}
            categories={categories}
          />
        ))}
      </div>
    </div>
  );
}

export default TaskColumn;