import { v4 as uuidv4 } from 'uuid';

export const generateTasksFromPrompt = async (prompt, options) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Instead of keyword matching, we'll now use a more sophisticated approach
      // to divide the prompt into 2-5 distinct tasks
      
      const tasks = [];
      const today = new Date();
      
      // Simple analysis of the prompt to determine potential task breakdown
      const promptLower = prompt.toLowerCase();
      
      // Function to create a new task with proper defaults
      const createTask = (title, description, category, daysToComplete) => ({
        id: uuidv4(),
        title: title,
        description: description,
        status: 'TODO',
        dueDate: formatDate(addDays(today, daysToComplete)),
        assignee: options.assignee || '',
        category: category || options.category || ''
      });
      
      // Analyze the prompt to identify potential components or phases
      const containsDesign = promptLower.includes('design') || promptLower.includes('ui') || promptLower.includes('interface');
      const containsDev = promptLower.includes('develop') || promptLower.includes('implement') || promptLower.includes('code');
      const containsTest = promptLower.includes('test') || promptLower.includes('qa') || promptLower.includes('verify');
      const containsData = promptLower.includes('data') || promptLower.includes('database') || promptLower.includes('storage');
      const containsAPI = promptLower.includes('api') || promptLower.includes('endpoint') || promptLower.includes('service');
      const containsDoc = promptLower.includes('document') || promptLower.includes('documentation') || promptLower.includes('manual');
      
      // Count potential task areas to ensure we create between 2-5 tasks
      let taskAreas = [containsDesign, containsDev, containsTest, containsData, containsAPI, containsDoc].filter(Boolean).length;
      
      // If we identified less than 2 specific areas, default to a generic 2-task breakdown
      if (taskAreas < 2) {
        tasks.push(
          createTask(
            'Plan and Design: ' + prompt.substring(0, 40) + (prompt.length > 40 ? '...' : ''),
            'Initial planning and design phase for: ' + prompt,
            'Planning',
            3
          )
        );
        
        tasks.push(
          createTask(
            'Implement: ' + prompt.substring(0, 40) + (prompt.length > 40 ? '...' : ''),
            'Implementation phase for: ' + prompt,
            'Development',
            7
          )
        );
      } else {
        // Create specific tasks based on the identified areas (max 5)
        let tasksAdded = 0;
        const maxTasks = Math.min(5, taskAreas);
        
        if (containsDesign && tasksAdded < maxTasks) {
          tasks.push(
            createTask(
              'Design UI/UX',
              'Create mockups and design user interface for: ' + prompt,
              'Design',
              2
            )
          );
          tasksAdded++;
        }
        
        if (containsDev && tasksAdded < maxTasks) {
          tasks.push(
            createTask(
              'Develop Core Functionality',
              'Implement the core functionality required for: ' + prompt,
              'Development',
              4
            )
          );
          tasksAdded++;
        }
        
        if (containsData && tasksAdded < maxTasks) {
          tasks.push(
            createTask(
              'Design Data Model',
              'Create the data schema and storage solution for: ' + prompt,
              'Database',
              3
            )
          );
          tasksAdded++;
        }
        
        if (containsAPI && tasksAdded < maxTasks) {
          tasks.push(
            createTask(
              'Develop API Endpoints',
              'Create necessary API services and endpoints for: ' + prompt,
              'API',
              5
            )
          );
          tasksAdded++;
        }
        
        if (containsTest && tasksAdded < maxTasks) {
          tasks.push(
            createTask(
              'Test Implementation',
              'Write and execute test cases for: ' + prompt,
              'QA',
              6
            )
          );
          tasksAdded++;
        }
        
        if (containsDoc && tasksAdded < maxTasks) {
          tasks.push(
            createTask(
              'Create Documentation',
              'Document usage and implementation details for: ' + prompt,
              'Documentation',
              7
            )
          );
          tasksAdded++;
        }
      }
      
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