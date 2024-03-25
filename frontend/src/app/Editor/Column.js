import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import TaskCard from './TaskCard';

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
  

const Column = ({ columnId, column, tasks }) => {
  return (
    <div className="column-container">
      <h2>{column.name}</h2>
      <Droppable droppableId={columnId}>
        {(provided) => (
          <div className="task-list" ref={provided.innerRef} {...provided.droppableProps}>
            {tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <TaskCard task={task} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default Column;
