import { v4 as uuidv4 } from 'uuid';

// Mock function to simulate API call for task generation
export const generateTasksFromPrompt = async (prompt, options) => {
  // In a real app, this would be an API call to a backend service
  // that would use NLP or AI to interpret the prompt and create appropriate tasks
  
  // For demo purposes, we're creating mock tasks based on some simple rules
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simple keyword matching for demo purposes
      const tasks = [];
      const today = new Date();
      
      if (prompt.toLowerCase().includes('login')) {
        tasks.push({
          id: uuidv4(),
          title: 'Create login UI',
          description: 'Design and implement the login user interface',
          status: 'TODO',
          dueDate: formatDate(addDays(today, 3)),
          assignee: options.assignee || '',
          category: options.category || 'Design'
        });
        
        tasks.push({
          id: uuidv4(),
          title: 'Implement authentication logic',
          description: 'Write backend code for user authentication',
          status: 'TODO',
          dueDate: formatDate(addDays(today, 5)),
          assignee: options.assignee || '',
          category: options.category || 'Feature'
        });
      }
      
      if (prompt.toLowerCase().includes('database')) {
        tasks.push({
          id: uuidv4(),
          title: 'Design database schema',
          description: 'Create schema for storing user data',
          status: 'TODO',
          dueDate: formatDate(addDays(today, 2)),
          assignee: options.assignee || '',
          category: options.category || 'Documentation'
        });
      }
      
      // Add a generic task if no specific keywords match or in addition to matched ones
      tasks.push({
        id: uuidv4(),
        title: prompt.length > 30 ? prompt.substring(0, 30) + '...' : prompt,
        description: 'Task generated from prompt: ' + prompt,
        status: 'TODO',
        dueDate: formatDate(addDays(today, 7)),
        assignee: options.assignee || '',
        category: options.category || ''
      });
      
      resolve(tasks);
    }, 1000); // Simulate API delay
  });
};

// Helper functions
function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function formatDate(date) {
  return date.toISOString().split('T')[0];
}