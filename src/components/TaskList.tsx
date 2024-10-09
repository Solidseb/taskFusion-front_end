import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./TaskList.css";
import { Task, User } from "./types";  // Import the correct Task type

interface TaskListProps {
  tasks: Task[];  // Ensure that tasks is an array
  onDelete: (id: number) => void;
  onEdit: (task: Task) => void; 
  users: User[];
}

const TaskList: React.FC<TaskListProps> = ({ tasks = [], onDelete, onEdit }) => {
  const [sortConfig, setSortConfig] = useState<{ key: string | null; direction: 'asc' | 'desc' }>({ key: null, direction: 'asc' });

  const sortedTasks = [...tasks].sort((a, b) => {
    if (sortConfig.key) {
      let aValue = a[sortConfig.key as keyof Task];
      let bValue = b[sortConfig.key as keyof Task];

      if (sortConfig.key === 'dueDate') {
        aValue = new Date(a.dueDate) as unknown as string; // Convert to comparable date string
        bValue = new Date(b.dueDate) as unknown as string;
      }

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key: keyof Task) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="task-list-container">
      <table className="task-list-table">
        <thead>
          <tr>
            <th onClick={() => requestSort('title')}>Task Name</th>
            <th onClick={() => requestSort('dueDate')}>Due Date</th>
            <th>Assigned To</th>
            <th onClick={() => requestSort('status')}>Status</th>
            <th onClick={() => requestSort('priority')}>Priority</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedTasks.length > 0 ? (
            sortedTasks.map((task) => (
              <tr key={task.id}>
                <td>
                  <Link to={`/tasks/${task.id}`} className="task-link">
                    {task.title}
                  </Link>
                </td>
                <td>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No Due Date'}</td>
                <td>
                  {task.assignedUsers && task.assignedUsers.length > 0 ? (
                    task.assignedUsers.map((user) => (
                      <span key={user.id} className="assigned-avatar">{user.name[0]}</span>
                    ))
                  ) : (
                    'Unassigned'
                  )}
                </td>
                <td>{task.status}</td>
                <td>{task.priority}</td>
                <td>
                  <button onClick={() => onEdit(task)}>✏️ Edit</button>
                  <button onClick={() => onDelete(task.id)}>🗑️ Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6}>No tasks found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TaskList;
