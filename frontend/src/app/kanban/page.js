'use client';
import '@/app/globals.css'
import '@/app/kanban/kanban.css'
import React, { } from 'react';


export default function KanbanPage() {
  const onDragStart = (event) => {
    event
      .dataTransfer
      .setData('text/plain', event.target.id);
  
    event
      .currentTarget
      .style
      .backgroundColor = 'yellow';
  }

  function onDragOver(event) {
    event.preventDefault();
  }

  const onDrop = (event) => {
    event.preventDefault();

    const id = event.dataTransfer.getData("text");
    const draggableElement = document.getElementById(id);
    draggableElement.removeAttribute('style')

    if (event.target.className === "example-draggable") {
      const referenceNode = event.target;
      referenceNode.parentNode.insertBefore(draggableElement, referenceNode);
    } else {
      event.target.appendChild(draggableElement);
    }

    event.dataTransfer.clearData();
  }

    return (
      <div className="example-parent">
        <h1>To-do list</h1>
        <div className="example-origin"
              onDragOver={onDragOver}
              onDrop={onDrop}>
          To-do
          <div
            id="draggable-1"
            className="example-draggable"
            draggable="true"
            onDragStart={onDragStart}
          >
            thing 1
          </div>
          <div
            id="draggable-2"
            className="example-draggable"
            draggable="true"
            onDragStart={onDragStart}
          >
            thing 2
          </div>
          <div
            id="draggable-3"
            className="example-draggable"
            draggable="true"
            onDragStart={onDragStart}
          >
            thing 3
          </div>
          <div
            id="draggable-4"
            className="example-draggable"
            draggable="true"
            onDragStart={onDragStart}
          >
            thing 4
          </div>
        </div>

        <div
          className="example-dropzone"
          onDragOver={onDragOver}
          onDrop={onDrop}
        >
          Done
        </div>
      </div>
    );
}