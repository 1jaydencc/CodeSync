'use client';
import '@/app/globals.css'
import '@/app/kanban/kanban.css'
import React, { useRef, useState, useEffect } from 'react';
import { auth, db } from "@/firebase-config";
import { collection, doc, addDoc, setDoc, deleteDoc } from "firebase/firestore";

const Task = ( /* params */ ) => {
  // console.log("making new task", taskId);
  return  (
      <div className="task">
        <span onClick={() => handleCloseComment(commentID)}> ✖ </span> {}
      </div>
  );
}

export default function KanbanPage() {
  const [commentList, setCommentList] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [collaborators, setCollaborators] = useState('');

  // BACKEND FUNCTIONS // 
  const onAddTaskClick = () => {
    const docRef = addDoc(collection(db, "tasks"), {
      // task fields
    });

    const newComment = <Comment
        // create new DOM task object to input into list
    />

    setCommentList([...commentList, newComment]);
}

  // DRAGGABLE FUNCTIONS https://codesandbox.io/p/sandbox/todo-list-dragdrop-local-storage-u91q0?file=%2Fsrc%2Fdraggable.js%3A22%2C37 // 
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
        
        <div className='kanban-sections'>
          
          <div
            className="example-dropzone"
            onDragOver={onDragOver}
            onDrop={onDrop}
          >
            <h2> Assigned Tasks </h2>
          </div>
          <div className="example-dropzone"
                onDragOver={onDragOver}
                onDrop={onDrop}>
            <h2> To-do </h2>
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
            <h2> Doing </h2>
          </div>

          <div
            className="example-dropzone"
            onDragOver={onDragOver}
            onDrop={onDrop}
          >
            <h2> Done </h2>
          </div>
        </div>

        <div className="comment-container">
          <h2>Comments
            <button onClick={() => onAddTaskClick( // onAddTaskClick submits to firestore collection
              // pass to backend
            )}>Add Comment</button>
          </h2>
          {/* {((startColumn != endColumn) || (startLineNumber != endLineNumber)) && */}
          <div className="comment">
            <p>Add a task <br></br>
              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                type={"comment"}
                placeholder="leave your comment"
              />
                <input
                  value={collaborators}
                  onChange={(e) => setCollaborators(e.target.value)}
                  type={"collaborators"}
                  placeholder="list your collaborators"
                />
            </p>
            <span onClick={() => handleCloseComment(commentID)}> ✖ </span> {}
          </div>
          {/* } */}
          {commentList.map(commentID => (
            <div key={commentID} className='comment-item'>
              {commentID}
            </div>
          ))}
        </div>

      </div>
    );
}