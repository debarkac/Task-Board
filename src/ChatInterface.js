import React, { useState } from 'react';
import './ChatInterface.css';

function ChatInterface({ onSubmitPrompt, users, categories }) {
  const [prompt, setPrompt] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [options, setOptions] = useState({
    temperature: 0.7,
    maxTokens: 500,
    agent: 'default',
    assignee: '',
    category: ''
  });

  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
  };

  const handleOptionChange = (e) => {
    const { name, value } = e.target;
    setOptions({
      ...options,
      [name]: name === 'temperature' || name === 'maxTokens' ? parseFloat(value) : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (prompt.trim()) {
      onSubmitPrompt(prompt, options);
      setPrompt('');
    }
  };

  return (
    <div className="chat-interface">
      <div className="chat-header">
        <h2>Task Generator</h2>
        <button 
          className="options-toggle" 
          onClick={() => setShowOptions(!showOptions)}
        >
          {showOptions ? 'Hide Options' : 'Show Options'}
        </button>
      </div>
      
      {showOptions && (
        <div className="chat-options">
          <div className="option-group">
            <label>
              Temperature:
              <input
                type="range"
                name="temperature"
                min="0"
                max="1"
                step="0.1"
                value={options.temperature}
                onChange={handleOptionChange}
              />
              <span>{options.temperature}</span>
            </label>
          </div>
          
          <div className="option-group">
            <label>
              Max Tokens:
              <input
                type="number"
                name="maxTokens"
                min="100"
                max="2000"
                value={options.maxTokens}
                onChange={handleOptionChange}
              />
            </label>
          </div>
          
          <div className="option-group">
            <label>
              Agent:
              <select name="agent" value={options.agent} onChange={handleOptionChange}>
                <option value="default">Default</option>
                <option value="creative">Creative</option>
                <option value="precise">Precise</option>
                <option value="analytical">Analytical</option>
              </select>
            </label>
          </div>
          
          <div className="option-group">
            <label>
              Default Assignee:
              <select name="assignee" value={options.assignee} onChange={handleOptionChange}>
                <option value="">None</option>
                {users.map(user => (
                  <option key={user} value={user}>{user}</option>
                ))}
              </select>
            </label>
          </div>
          
          <div className="option-group">
            <label>
              Default Category:
              <select name="category" value={options.category} onChange={handleOptionChange}>
                <option value="">None</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </label>
          </div>
        </div>
      )}
      
      <form className="chat-form" onSubmit={handleSubmit}>
        <textarea
          className="prompt-input"
          value={prompt}
          onChange={handlePromptChange}
          placeholder="Enter your prompt to generate tasks... (e.g., 'Create tasks for building a login page')"
        />
        <button type="submit" className="submit-button">Generate Tasks</button>
      </form>
    </div>
  );
}

export default ChatInterface;