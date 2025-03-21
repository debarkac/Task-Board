import { v4 as uuidv4 } from "uuid";

// EPAM API configuration
const endpoint = "https://ai-proxy.lab.epam.com";
const deployment = "gpt-4o";
const apiVersion = "2024-10-21";
const apiKey = "1fbc253c3214457e8d7477f8533215c1";
const temperature = 0.7;

// Extract JSON from the AI response
const extractJsonFromResponse = (content) => {
  // Try matching EPAM-specific markdown with a newline after ```json
  const jsonMatch = content.match(/```json\s*\n([\s\S]*?)\n```/);
  if (jsonMatch && jsonMatch[1]) {
    return JSON.parse(jsonMatch[1]);
  }
  // Fallback to the original regex pattern
  const fallbackMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
  if (fallbackMatch && fallbackMatch[1]) {
    return JSON.parse(fallbackMatch[1]);
  }
  try {
    return JSON.parse(content);
  } catch (e) {
    throw new Error("Could not extract valid JSON from response");
  }
};

export const generateTasksFromPrompt = async (prompt, options) => {
  // Skip the API call if no API key is configured, use the local implementation
  if (!apiKey) {
    return generateTasksLocally(prompt, options);
  }

  try {
    const response = await fetch(
      `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": apiKey,
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: `You are a task manager assistant. Generate tasks in JSON format. Each task should include: title, description, dueDate, and assignee.
                     Valid assignees are: ${[
                       "Ayush Garg",
                       "Debarka Chakraborti",
                       "Ganapuram Bhoomika",
                       "Harika Srutakeerti",
                       "Katta Abhigna Reddy",
                       "Kemburu Poorna Sai Krishna",
                       "Naga Venkata Akshaya Juluri",
                     ].join(", ")}.
                     Valid categories are: ${[
                       "Bug",
                       "Feature",
                       "Documentation",
                       "Design",
                     ].join(", ")}.
                     ${
                       options.assignee
                         ? `Assign all tasks to: ${options.assignee}.`
                         : ""
                     }
                     ${
                       options.category
                         ? `Set category for all tasks to: ${options.category}.`
                         : ""
                     }
                     Return the JSON array wrapped in \`\`\`json code blocks.`,
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: temperature,
          max_tokens: 800,
        }),
      }
    );

    const data = await response.json();

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error("Invalid response from AI API");
    }

    const content = data.choices[0].message.content;
    const aiTasks = extractJsonFromResponse(content);

    // Process the AI-generated tasks to ensure they conform to our app's requirements
    return aiTasks.map((task) => {
      const validCategories = ["Bug", "Feature", "Documentation", "Design"];
      const validUsers = [
        "Ayush Garg",
        "Debarka Chakraborti",
        "Ganapuram Bhoomika",
        "Harika Srutakeerti",
        "Katta Abhigna Reddy",
        "Kemburu Poorna Sai Krishna",
        "Naga Venkata Akshaya Juluri",
      ];

      // Validate and set the category
      let category = options.category || task.category || "Feature";
      if (!validCategories.includes(category)) {
        category = "Feature";
      }

      // Validate and set the assignee
      let assignee = options.assignee || task.assignee || "";
      if (assignee && !validUsers.includes(assignee)) {
        assignee = "";
      }

      return {
        id: uuidv4(),
        title: task.title || "Untitled Task",
        description: task.description || "",
        status: "TODO",
        dueDate: task.dueDate || formatDate(addDays(new Date(), 7)),
        assignee: assignee,
        category: category,
      };
    });
  } catch (error) {
    console.error("Error generating tasks with AI:", error);
    // Fallback to local implementation if API call fails
    return generateTasksLocally(prompt, options);
  }
};

// Local fallback implementation
const generateTasksLocally = (prompt, options) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const tasks = [];
      const today = new Date();

      // Analyze the prompt text
      const promptLower = prompt.toLowerCase();

      const createTask = (
        title,
        description,
        suggestedCategory,
        daysToComplete
      ) => {
        const validCategories = ["Bug", "Feature", "Documentation", "Design"];
        let finalCategory;

        if (options.category && validCategories.includes(options.category)) {
          finalCategory = options.category;
        } else {
          finalCategory = validCategories.includes(suggestedCategory)
            ? suggestedCategory
            : "Feature";
        }

        const validUsers = [
          "Ayush Garg",
          "Debarka Chakraborti",
          "Ganapuram Bhoomika",
          "Harika Srutakeerti",
          "Katta Abhigna Reddy",
          "Kemburu Poorna Sai Krishna",
          "Naga Venkata Akshaya Juluri",
        ];
        const validatedAssignee =
          options.assignee && validUsers.includes(options.assignee)
            ? options.assignee
            : "";

        return {
          id: uuidv4(),
          title: title,
          description: description,
          status: "TODO",
          dueDate: formatDate(addDays(today, daysToComplete)),
          assignee: validatedAssignee,
          category: finalCategory,
        };
      };

      // Determine task areas based on prompt keywords
      const containsDesign =
        promptLower.includes("design") ||
        promptLower.includes("ui") ||
        promptLower.includes("interface");
      const containsDev =
        promptLower.includes("develop") ||
        promptLower.includes("implement") ||
        promptLower.includes("code");
      const containsTest =
        promptLower.includes("test") ||
        promptLower.includes("qa") ||
        promptLower.includes("verify");
      const containsData =
        promptLower.includes("data") ||
        promptLower.includes("database") ||
        promptLower.includes("storage");
      const containsAPI =
        promptLower.includes("api") ||
        promptLower.includes("endpoint") ||
        promptLower.includes("service");
      const containsDoc =
        promptLower.includes("document") ||
        promptLower.includes("documentation") ||
        promptLower.includes("manual");

      let taskAreas = [
        containsDesign,
        containsDev,
        containsTest,
        containsData,
        containsAPI,
        containsDoc,
      ].filter(Boolean).length;

      if (taskAreas < 2) {
        tasks.push(
          createTask(
            "Plan and Design: " +
              prompt.substring(0, 40) +
              (prompt.length > 40 ? "..." : ""),
            "Initial planning and design phase for: " + prompt,
            "Design",
            3
          )
        );

        tasks.push(
          createTask(
            "Implement: " +
              prompt.substring(0, 40) +
              (prompt.length > 40 ? "..." : ""),
            "Implementation phase for: " + prompt,
            "Feature",
            7
          )
        );
      } else {
        let tasksAdded = 0;
        const maxTasks = Math.min(5, taskAreas);

        if (containsDesign && tasksAdded < maxTasks) {
          tasks.push(
            createTask(
              "Design UI/UX",
              "Create mockups and design user interface for: " + prompt,
              "Design",
              2
            )
          );
          tasksAdded++;
        }

        if (containsDev && tasksAdded < maxTasks) {
          tasks.push(
            createTask(
              "Develop Core Functionality",
              "Implement the core functionality required for: " + prompt,
              "Feature",
              4
            )
          );
          tasksAdded++;
        }

        if (containsData && tasksAdded < maxTasks) {
          tasks.push(
            createTask(
              "Design Data Model",
              "Create the data schema and storage solution for: " + prompt,
              "Feature",
              3
            )
          );
          tasksAdded++;
        }

        if (containsAPI && tasksAdded < maxTasks) {
          tasks.push(
            createTask(
              "Develop API Endpoints",
              "Create necessary API services and endpoints for: " + prompt,
              "Feature",
              5
            )
          );
          tasksAdded++;
        }

        if (containsTest && tasksAdded < maxTasks) {
          tasks.push(
            createTask(
              "Test Implementation",
              "Write and execute test cases for: " + prompt,
              "Bug",
              6
            )
          );
          tasksAdded++;
        }

        if (containsDoc && tasksAdded < maxTasks) {
          tasks.push(
            createTask(
              "Create Documentation",
              "Document usage and implementation details for: " + prompt,
              "Documentation",
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
  return date.toISOString().split("T")[0];
}
