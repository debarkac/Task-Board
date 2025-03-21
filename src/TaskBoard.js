import React, { useState } from "react";
import TaskColumn from "./TaskColumn";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./TaskBoard.css";

function TaskBoard({
  tasks,
  onTaskMove,
  onTaskEdit,
  onTaskDelete,
  users,
  categories,
}) {
  // const todoTasks = tasks.filter((task) => task.status === "TODO");
  // const inProgressTasks = tasks.filter((task) => task.status === "InProgress");
  // const completedTasks = tasks.filter((task) => task.status === "Completed");

  // Add filter state
  const [filters, setFilters] = useState({
    assignee: "",
    category: "",
    date: "",
  });

  // Filter tasks based on criteria
  const filterTasks = (tasksToFilter) => {
    return tasksToFilter.filter((task) => {
      const assigneeMatch =
        !filters.assignee || task.assignee === filters.assignee;
      const categoryMatch =
        !filters.category || task.category === filters.category;
      const dateMatch = !filters.date || task.dueDate === filters.date;
      return assigneeMatch && categoryMatch && dateMatch;
    });
  };

  // Filter tasks for each column
  const todoTasks = filterTasks(tasks.filter((task) => task.status === "TODO"));
  const inProgressTasks = filterTasks(
    tasks.filter((task) => task.status === "InProgress")
  );
  const completedTasks = filterTasks(
    tasks.filter((task) => task.status === "Completed")
  );

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        {/* Add filter controls */}
        <div className="task-filters">
          <select
            name="assignee"
            value={filters.assignee}
            onChange={handleFilterChange}
          >
            <option value="">All Assignees</option>
            {users.map((user) => (
              <option key={user} value={user}>
                {user}
              </option>
            ))}
          </select>

          <select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <input
            type="date"
            name="date"
            value={filters.date}
            onChange={handleFilterChange}
          />
        </div>
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
      </div>
    </DndProvider>
  );
}

export default TaskBoard;
