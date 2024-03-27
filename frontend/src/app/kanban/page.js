'use client';
import '@/app/globals.css'
import '@/app/kanban/kanban.css'
import React, { } from 'react';


const tasks = [
  { id: 1, title: 'Fix the bug', status: 'Todo' },
  { id: 2, title: 'Write documentation', status: 'In Progress' },
  { id: 3, title: 'Deploy to production', status: 'Done' },
  // Add more tasks as needed
];

export default function KanbanPage() {
  const [tasksByStatus, setTasksByStatus] = React.useState({
    Todo: tasks.filter((task) => task.status === 'Todo'),
    'In Progress': tasks.filter((task) => task.status === 'In Progress'),
    Done: tasks.filter((task) => task.status === 'Done'),
  });

  const handleDragStart = (event, taskId, sourceStatus) => {
    event.dataTransfer.setData('text/plain', taskId);
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (event, destinationStatus) => {
    event.preventDefault();
    if (event.dataTransfer.items[0].kind === 'text') {
      event.dataTransfer.dropEffect = 'move';
    }
  };

  const handleDrop = (event, destinationStatus) => {
    event.preventDefault();
    const taskId = event.dataTransfer.getData('text/plain');
    const sourceTasks = tasksByStatus[destinationStatus]; // Assume tasks are already loaded

    const updatedTasksByStatus = { ...tasksByStatus };
    const [removedTask] = updatedTasksByStatus[sourceStatus].splice(
      updatedTasksByStatus[sourceStatus].findIndex((task) => task.id === taskId),
      1
    );
    removedTask.status = destinationStatus;
    updatedTasksByStatus[destinationStatus].push(removedTask);

    setTasksByStatus(updatedTasksByStatus);

    // Simulate server update (replace with your actual data update logic)
    setTimeout(() => {
      // Update tasks array based on updatedTasksByStatus
    }, 1000);
  };

  return (
    <div className="kanban-board">
      <div className="kanban-section">
        <h3>Todo</h3>
        <ul onDragOver={(e) => handleDragOver(e, 'Todo')}>
          {tasksByStatus.Todo.map((task) => (
            <li
              key={task.id}
              draggable
              onDragStart={(e) => handleDragStart(e, task.id, 'Todo')}
            >
              {task.title}
            </li>
          ))}
        </ul>
      </div>
      <div className="kanban-section">
        <h3>In Progress</h3>
        <ul onDragOver={(e) => handleDragOver(e, 'In Progress')}>
          {tasksByStatus['In Progress'].map((task) => (
            <li
              key={task.id}
draggable
              onDragStart={(e) => handleDragStart(e, task.id, 'In Progress')}
            >
              {task.title}
            </li>
          ))}
        </ul>
      </div>
      <div className="kanban-section">
        <h3>Done</h3>
        <ul onDragOver={(e) => handleDragOver(e, 'Done')}>
          {tasksByStatus.Done.map((task) => (
            <li
              key={task.id}
              draggable
              onDragStart={(e) => handleDragStart(e, task.id, 'Done')}
            >
              {task.title}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

}