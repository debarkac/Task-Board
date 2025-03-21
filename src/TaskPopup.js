// TaskPopup.js
import React from 'react';
import './TaskPopup.css';

function TaskPopup({ task, onClose }) {
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <div className="popup-header">
          <h2>{task.title}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="popup-body">
          <div className="popup-section">
            <h3>Description</h3>
            <p>{task.description || 'No description provided'}</p>
          </div>
          
          <div className="popup-section">
            <h3>Details</h3>
            <div className="detail-item">
              <span className="detail-label">Status:</span>
              <span className="detail-value status-badge">{task.status}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Category:</span>
              <span className="detail-value">{task.category || 'Uncategorized'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Assignee:</span>
              <span className="detail-value">{task.assignee || 'Unassigned'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Due Date:</span>
              <span className="detail-value">{task.dueDate}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskPopup;