import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import './TaskCard.css';

function TaskCard({ task, onEdit, onDelete, users, categories }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({ ...task });

  const [{ isDragging }, drag] = useDrag({
    type: 'TASK',
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    onEdit(task.id, editedTask);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTask({ ...task });
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedTask({ ...editedTask, [name]: value });
  };

  return (
    <div 
      className={`task-card ${isDragging ? 'task-dragging' : ''}`}
      ref={drag}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {isEditing ? (
        <div className="task-edit-form">
          <input
            name="title"
            value={editedTask.title}
            onChange={handleChange}
            placeholder="Task title"
          />
          <textarea
            name="description"
            value={editedTask.description}
            onChange={handleChange}
            placeholder="Description"
          />
          <input
            type="date"
            name="dueDate"
            value={editedTask.dueDate}
            onChange={handleChange}
          />
          <select name="assignee" value={editedTask.assignee} onChange={handleChange}>
            <option value="">Unassigned</option>
            {users.map(user => (
              <option key={user} value={user}>{user}</option>
            ))}
          </select>
          <select name="category" value={editedTask.category} onChange={handleChange}>
            <option value="">Uncategorized</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <div className="edit-actions">
            <button onClick={handleSave}>Save</button>
            <button onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      ) : (
        <>
          <div className="card-header">
            <span className="task-category">{task.category}</span>
            <div className="card-actions">
              <button onClick={handleEdit}>Edit</button>
              <button onClick={() => onDelete(task.id)}>Delete</button>
            </div>
          </div>
          <h3 className="task-title">{task.title}</h3>
          <p className="task-description">{task.description}</p>
          <div className="task-meta">
            <div className="due-date">Due: {task.dueDate}</div>
            <div className="assignee">Assigned to: {task.assignee || 'Unassigned'}</div>
          </div>
          <div className="task-status">Status: {task.status}</div>
        </>
      )}
    </div>
  );
}

export default TaskCard;