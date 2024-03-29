'use client';
import React from 'react';
import Task from './Task';
import './App.css';

const KanbanBoard = ({ todo, ip, done, handleTaskChange, allAssignees, handleStatusChange, handleDeleteTask}) => {
  if (todo === undefined || ip === undefined || done === undefined) {
    return;
  }

  console.log("todo", todo)
  console.log("ip", ip)
  console.log("done", done) 
  // console.log("kanban board receives", Object.entries(tasks))
  const tasks = {todo, ip, done}

  return (
    <div className="kanban-board">
      {Object.entries(tasks).map(([status, tasksInStatus]) => (
        <div key={status} className="kanban-column">
          <h2>{status}</h2>
          {tasksInStatus.map(task => (
            <Task key={task.id} task={task} handleTaskChange={handleTaskChange} allAssignees={allAssignees} handleStatusChange={handleStatusChange} handleDeleteTask={handleDeleteTask}/>
          ))}
        </div>
      ))}
    </div>
  );
};

export default KanbanBoard;