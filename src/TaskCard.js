import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import TaskPopup from './TaskPopup';
import './TaskCard.css';

function TaskCard({ task, onEdit, onDelete, users, categories }) {
  const [isEditing, setIsEditing] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [editedTask, setEditedTask] = useState({ ...task });

  const [{ isDragging }, drag] = useDrag({
    type: 'TASK',
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const handleCardClick = (e) => {
    // Only show popup if not clicking edit or delete buttons
    if (!e.target.closest('button')) {
      setShowPopup(true);
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation(); // Prevent card click event
    setIsEditing(true);
  };

  const handleDelete = (e) => {
    e.stopPropagation(); // Prevent card click event
    onDelete(task.id);
  };

  const handleSave = (e) => {
    e.stopPropagation(); // Prevent card click event
    onEdit(task.id, editedTask);
    setIsEditing(false);
  };

  const handleCancel = (e) => {
    e.stopPropagation(); // Prevent card click event
    setEditedTask({ ...task });
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedTask({ ...editedTask, [name]: value });
  };

  return (
    <>
      <div 
        className={`task-card ${isDragging ? 'task-dragging' : ''}`}
        ref={drag}
        style={{ opacity: isDragging ? 0.5 : 1 }}
        data-category={task.category}
        data-status={task.status}
        onClick={handleCardClick}
      >
        {isEditing ? (
          <div className="task-edit-form" onClick={e => e.stopPropagation()}>
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
            <select 
              name="assignee" 
              value={editedTask.assignee} 
              onChange={handleChange}
            >
              <option value="">Unassigned</option>
              {users.map(user => (
                <option key={user} value={user}>{user}</option>
              ))}
            </select>
            <select 
              name="category" 
              value={editedTask.category} 
              onChange={handleChange}
            >
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
              <span className="task-category">{task.category || 'Uncategorized'}</span>
              <div className="card-actions">
                <button onClick={handleEdit}>Edit</button>
                <button onClick={handleDelete}>Delete</button>
              </div>
            </div>
            <h3 className="task-title">{task.title}</h3>
            <p className="task-description">
              {task.description.length > 100 
                ? `${task.description.substring(0, 100)}...` 
                : task.description}
            </p>
            <div className="task-meta">
              <div className="due-date">Due: {task.dueDate}</div>
              <div className="assignee">
                {task.assignee || 'Unassigned'}
              </div>
            </div>
            <div className="task-status">{task.status}</div>
          </>
        )}
      </div>

      {showPopup && (
        <TaskPopup 
          task={task}
          onClose={() => setShowPopup(false)}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </>
  );
}

export default TaskCard;