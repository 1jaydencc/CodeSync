'use client';
import '@/app/globals.css'
import '@/app/kanban/kanban.css'
import { onDragStart, onDragOver, onDrop } from '@/app/kanban/draggable.js'
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

const Noti = ( { type, }) => {

  return (
    <div className='noti'>
      <div className='noti-content'>

      </div>
    </div>
  )
}

export default function KanbanPage() {
  const [taskList, setTaskList] = useState([]);
  const [taskText, setTaskText] = useState('');
  const [collaborators, setCollaborators] = useState('');

  // BACKEND FUNCTIONS // 
  const onAddTaskClick = () => {
    const docRef = addDoc(collection(db, "tasks"), {
      // task fields
    });

    const newComment = <Comment
        // create new DOM task object to input into list
    />

    setTaskList([...taskList, newComment]);
}

    return (
      <div className="example-parent">
        <div className='noti-section'>
        <h1>Notifications Testing</h1>
        

        </div>
        <h1>To-do list</h1>
        
        <div className='kanban-section'>
          
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
                value={taskText}
                onChange={(e) => setTaskText(e.target.value)}
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
          {taskList.map(commentID => (
            <div key={commentID} className='comment-item'>
              {commentID}
            </div>
          ))}
        </div>

      </div>
    );
}