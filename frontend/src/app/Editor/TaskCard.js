import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';

const TaskCard = ({ task }) => {
    return (
      <div className="task-card">
        <h3>{task.description}</h3>
        <p>Estimated Time: {task.estimatedTime}</p>
        <p>Owner: {task.owner}</p>
        <p>Priority: {task.priority}</p> {/* TO DO */}
      </div>
    );
  };