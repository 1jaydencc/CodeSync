'use client';
import '@/app/globals.css'
import '@/app/kanban/kanban.css'
import TitleBar from "../title-bar/title-bar";

import { onDragStart, onDragOver, onDrop } from '@/app/kanban/draggable.js'

import React, { useRef, useState, useEffect } from 'react';
import { useRouter } from "next/navigation";

import { auth, db  } from "@/firebase-config";
import { onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, getDocs, query, orderBy, onSnapshot, where } from "firebase/firestore";

const Task = ( /* params */ ) => {
  // console.log("making new task", taskId);
  return  (
      <div className="task">
        <span onClick={() => handleCloseComment(commentID)}> ✖ </span> {}
      </div>
  );
}

const Noti = ( { sender, uid, notiId, type, title, desc, recipients, timestamp } ) => {
  // console.log("making new notification", notiID);
  return (
    <div className='noti'>
      <p> 
        {sender} <br></br>
        {uid} <br></br>
        {notiId} <br></br>
        {title} <br></br>
        {timestamp} <br></br>
        {recipients} <br></br>
        <h3> Noti </h3><p>{desc}</p>
      </p>
      <span onClick={() => handleCloseComment(notiId)}> ✖ </span> {}
      {(type == "friend-request") &&
        <div>
          <button onClick={() => onAcceptClick()}>Accept</button>
          <button onClick={() => onDeclineClick()}>Decline</button>
        </div>
      }

    </div>
  )
}

export default function KanbanPage() {
  const router = useRouter(); // Using the useRouter hook for navigation

// ------------------------- NOTIFICATION FUNCTIONS ------------------------- // 
  const [notiList, setNotiList] = useState([]);
  const [notiType, setNotiType] = useState('');
  const [notiTitle, setNotiTitle] = useState('');
  const [notiDesc, setNotiDesc] = useState('');

  const [currentUserEmail, setCurrentUserEmail] = useState(null);

  const [email, setEmail] = useState('');
  const [foundEmail, setFoundEmail] = useState('');

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
        setCurrentUserEmail(user?.email);
        console.log("here")
        console.log(currentUserEmail)
    });

    const q = query(collection(db, "notifications"),
                    where("recipient", "==", currentUserEmail));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const notifications = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
        console.log("notifications", notifications)
        setNotiList(notifications);
    });

    return () => {
        unsubscribe();
        unsubscribeAuth && unsubscribeAuth();
    };
  }, []);

  const onCheckEmailClick = async () => {
    const emailSnapshot = await getDocs(collection(db, "emails"));
    emailSnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      // console.log(doc.id, " => ", doc.data());
      if (doc.data().email == email) {
        console.log("found email");
        setFoundEmail(email);
        return;
      }
    });
    if (setFoundEmail == '') {
      console.log("email not found");
    }
  }

  const onSendNotiClick = () => {
    if ( (notiTitle == '') && (notiDesc == '') ) {
      console.log("friend-request");
      setNotiType('friend-request');
    } else {
      console.log("g");
      setNotiType("general");
    }
    
    console.log("foundEmail:", foundEmail); 
    console.log(auth.currentUser.uid, notiType, notiTitle, notiDesc, new Date())

    const docRef = addDoc(collection(db, "notifications"), {  // add doc to firestore
      sender: currentUserEmail,
      type: notiType,
      recipient: foundEmail,
      title: notiTitle,
      desc: notiDesc,
      timestamp: new Date(),
      isRead: false,
      isResolved: false
    });

    setFoundEmail(false);
    // setNotiType('');
    setNotiTitle('');
    setNotiDesc('');
    setEmail('');
  }

  const navigateToEditor = () => {
    router.push("/editor");
  };

  return (
    <div className="container0">
      <TitleBar />
      <div className="container1"></div>
      <div className="chat-page">
        <button onClick={navigateToEditor} className="back-to-editor-btn">
          {" "}
          &lt; Editor
        </button>
      </div>
      <div className='noti-section'>
        <h1>Notifications Testing</h1>
        
        <button onClick={() => onSendNotiClick()}>Send Notification</button>
        {(true) &&  // can create a boolean set to true once a button to send notis is clicked
          <div className="noti-input">
              <button onClick={() => onCheckEmailClick()}> Find Friend </button>
                <input
                    value={email}
                    onChange={ (e) => setEmail(e.target.value) }
                    type={"request email"}
                    placeholder="friend's email"
                />
              <br></br>
              <h1> Title </h1>
                <input
                    value={notiTitle}
                    onChange={(e) => setNotiTitle(e.target.value)}
                    type={"title"}
                    placeholder="leave your title"
                />
              <br></br>
              <h1> Description </h1>
                <input
                    value={notiDesc}
                    onChange={(e) => setNotiDesc(e.target.value)}
                    type={"description"}
                    placeholder="leave your description"
                />
              {/* <span onClick={() => handleCloseComment(commentID)}> ✖ </span> {} */}
          </div>
        }
        <div className="noti-list">
          {notiList.map((noti, index) => {
            const showDisplayName =
              index === 0 || notiList[index - 1].uid !== noti.uid;

            return (
              <div
                key={noti.id}
                className={`message-wrapper ${noti.uid === auth.currentUser.uid ? "sent-wrapper" : "received-wrapper"}`}
              >
                {true && (
                  <div className="noti-header">
                    {noti.sender || "anon@anon.com"}
                  </div>
                )}
                <div
                  className={`message ${noti.uid === auth.currentUser.uid ? "sent" : "received"}`}
                >
                  <div className="noti-content">
                    <div className="noti-header">title: {noti.title}</div>
                    <div className="noti-header">desc: {noti.desc}</div>
                    <div className="noti-header">recipient: {noti.recipient}</div>
                  </div>
                </div>
              </div>
            );
          })}

        </div>
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
    </div>
  );
}