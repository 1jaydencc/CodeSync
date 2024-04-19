'use client';
import React, { useState, useEffect, useCallback } from 'react';
import Taskbar from './taskbar.js';
import './App.css';
import _ from 'lodash';
import KanbanBoard from './KanbanBoard.js';
import AddTaskForm from './AddTaskForm.js';

import { db, auth } from "@/firebase-config"; // make sure these imports are correct
import {
    collection,
    query,
    orderBy,
    where,
    onSnapshot,
    addDoc,
    deleteDoc,
    setDoc,
    doc
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const App = () => {
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([
        { id: 1, description: "Your first notification goes here, it's pretty long to test the ellipsis...", isRead: false, timestamp: "2024-03-28T20:19:52.279787+00:00" },
        { id: 2, description: "Second notification, also lengthy enough...", isRead: true, timestamp: "2024-03-28T20:09:52.279787+00:00" },
        { id: 3, description: "Third notification example...", isRead: false, timestamp: "2024-03-28T19:59:52.279787+00:00" },
        { id: 4, description: "Fourth notification here...", isRead: true, timestamp: "2024-03-28T19:49:52.279787+00:00" },
        { id: 5, description: "Fifth notification content...", isRead: false, timestamp: "2024-03-28T19:39:52.279787+00:00" },
    ]);
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [hoveredNotification, setHoveredNotification] = useState(null);
    const [hoverTimeoutId, setHoverTimeoutId] = useState(null);
    const priorityOrder = { 'High': 1, 'Medium': 2, 'Low': 3 };
    const sortTasksByPriority = (tasks) => {
        return tasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    };
    const updateOrdering = (tasks) => {
        Object.keys(tasks).forEach(status => {
            tasks[status] = sortTasksByPriority(tasks[status]);
        });
        return tasks;
    };
    // const sortedUserTasks = updateOrdering(initialTasks.userTasks);
    // const sortedProjectTasks = updateOrdering(initialTasks.projectTasks)
    const [userTasks, setUserTasks] = useState({
        toDo: [],
        inProgress: [],
        done: []
    });
    const [projectTasks, setProjectTasks] = useState({});
    const allAssignees = [
        { label: 'adrien.qi304@gmail.com', value: 'adrien.qi304@gmail.com' },
        { label: 'abatth@purdue.edu', value: 'abatth@purdue.edu' },
        { label: 'arandha@purdue.edu', value: 'arandha@purdue.edu' },
        { label: 'jaydenccc@gmail.com', value: 'jaydenccc@gmail.com' },
    ];

    const [allAssigness, setAllAssigness] = useState(allAssignees);
    const handleDeleteTask = async (taskId) => {
        const updateTasks = (tasks) => {
            const updatedTasks = {};
            Object.keys(tasks).forEach(status => {
                updatedTasks[status] = tasks[status].filter(task => task.id !== taskId);
            });
            return updatedTasks;
        };

        const docRef = await doc(db, "tasks", taskId);
        await deleteDoc(docRef);
        // setUserTasks(prevTasks => updateTasks(prevTasks));
        // setProjectTasks(prevTasks => updateTasks(prevTasks));
    };

    // firebase logic
    const [currentUserEmail, setCurrentUserEmail] = useState('adrien.qi304@gmail.com');

    // const [tasks, setTasks] = useState([]);
    const [userToDo, setUserToDo] = useState();
    const [userInProgress, setUserInProgress] = useState();
    const [userDone, setUserDone] = useState();
    const [projToDo, setProjToDo] = useState();
    const [projInProgress, setProjInProgress] = useState();
    const [projDone, setProjDone] = useState();

    useEffect(() => {   // USER TODO
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            setCurrentUserEmail(user?.email);
            // console.log("User:", user?.email, currentUserEmail)
        });

        const q = query(collection(db, "tasks"), where("assignedto", "array-contains", currentUserEmail), where("status", "==", "To-Do"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const tasks = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            // console.log('To-Do from DB:', tasks)
            // console.log('userTasks before', userTasks)
            setUserToDo(tasks);
            setProjToDo(tasks);
            setUserTasks({
                ...userTasks,
                toDo: tasks
            });
            setProjectTasks({
                ...projectTasks,
                'To-Do': tasks
            });
            // console.log("userTasks To-Do:", userTasks)
        });

        return () => {
            unsubscribe();
            unsubscribeAuth && unsubscribeAuth();
        };
    });
    useEffect(() => {   // USER INPROGRESS
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            setCurrentUserEmail(user?.email);
            // console.log("User:", user?.email, currentUserEmail)
        });

        const q = query(collection(db, "tasks"), where("assignedto", "array-contains", currentUserEmail), where("status", "==", "In-Progress"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const tasks = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            // console.log('In-Progress from DB:', tasks)
            // console.log('userTasks before', userTasks)
            setUserInProgress(tasks);
            setProjInProgress(tasks);
            setUserTasks({
                ...userTasks,
                inProgress: tasks
            });
            setProjectTasks({
                ...projectTasks,
                'In-Progress': tasks
            });
            // console.log("userTasks In-Progress:", userTasks)
        });

        return () => {
            unsubscribe();
            unsubscribeAuth && unsubscribeAuth();
        };
    });

    useEffect(() => {   // USER INPROGRESS
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            setCurrentUserEmail(user?.email);
            // console.log("User:", user?.email, currentUserEmail)
        });

        const q = query(collection(db, "tasks"), where("assignedto", "array-contains", currentUserEmail),
            where("status", "==", "Done"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const tasks = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            // console.log('Done from DB:', tasks)
            // console.log('userTasks before', userTasks)
            setUserDone(tasks);
            setProjDone(tasks);
            setUserTasks({
                ...userTasks,
                done: tasks
            });
            setProjectTasks({
                ...projectTasks,
                'Done': tasks
            });
            // console.log('userTasks Done:', userTasks)
        });

        return () => {
            unsubscribe();
            unsubscribeAuth && unsubscribeAuth();
        };
    });
    useEffect(() => {   // all notification listener
        // console.log("User:", auth.currentUser);
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            setCurrentUserEmail(user?.email);
        });

        const q = query(collection(db, "tasks"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const tasks = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            // console.log('all tasks:', tasks)
            // setTasks(tasks);
        });

        return () => {
            unsubscribe();
            unsubscribeAuth && unsubscribeAuth();
        };
    });
    var lastID = 10;
    const addTask = async (newTaskData) => {
        console.log('New Task Data:', newTaskData);
        lastID = lastID + 1;
        const newTask = {
            ...newTaskData,
            id: lastID,
            tags: newTaskData.tags.map(tag => typeof tag === 'object' ? tag.value : tag)
        };
        const selectedStatus = newTask.status;

        // setProjectTasks(prevProjectTasks => {
        //     const updatedTasks = {
        //         ...prevProjectTasks,
        //         [selectedStatus]: [...prevProjectTasks[selectedStatus], newTask]
        //     };
        //     return updateOrdering(updatedTasks);
        // });

        // w/ firebase
        const githubUsername = auth.currentUser.reloadUserInfo.screenName;
        console.log(githubUsername)
        await addDoc(collection(db, "tasks"), {
            assignedto: newTask.assignedTo,
            deadline: (newTask.deadline).toISOString(),
            description: newTask.description,
            priority: newTask.priority,
            status: newTask.status,
            tags: newTask.tags,
            taskId: newTask.id,
            type: newTask.type,
        });
    };

    const handleTaskChange = async (taskId, updates = {}) => {
        const updateTasks = async (tasks) => {
            let taskUpdated = false; // Flag to check if task update was successful
            const newTasks = Object.entries(tasks).reduce((acc, [status, taskList]) => {
                const taskIndex = taskList.findIndex(task => task.id === taskId);
                if (taskIndex > -1) {
                    const updatedTaskList = [...taskList];
                    updatedTaskList[taskIndex] = { ...taskList[taskIndex], ...updates };
                    acc[status] = updatedTaskList;
                    taskUpdated = true; // Task was found and updated
                } else {
                    acc[status] = taskList; // No changes for this status
                }
                return acc;
            }, {});

            return taskUpdated ? updateOrdering(newTasks) : tasks; // Only reorder if task was updated
        };

        setUserTasks(prevUserTasks => updateTasks(prevUserTasks));
        setProjectTasks(prevProjectTasks => updateTasks(prevProjectTasks));
    };

    const handleStatusChange = async (taskId, newStatus) => {
        const updateTasks = (tasks) => {
            let updatedTasks = { ...tasks };

            for (const status in updatedTasks) {
                updatedTasks[status] = updatedTasks[status].filter((task) => task.id !== taskId);
            }

            const taskToUpdate = Object.values(tasks).flatMap((taskList) => taskList).find((task) => task.id === taskId);
            if (taskToUpdate) {
                updatedTasks[newStatus].push({ ...taskToUpdate, status: newStatus });
            }

            updatedTasks = updateOrdering(updatedTasks);

            return updatedTasks;
        };

        const updatedUserTasks = updateTasks(userTasks);
        const updatedProjectTasks = updateTasks(projectTasks);

        setUserTasks(updatedUserTasks);
        setProjectTasks(updatedProjectTasks);

        // w/ firebase
        await setDoc(doc(db, "tasks", taskId), { status: newStatus }, { merge: true });
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setNotifications(currentNotifications => {
                return [...currentNotifications].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            });
        }, 1000);

        return () => clearInterval(interval);
    });
    const handleClearCurrentNotification = () => {
        setNotifications(notifications.filter(n => n.id !== selectedNotification.id));
        setSelectedNotification(null);
    };
    const handleNotificationMouseEnter = (notificationId) => {
        const timeoutId = setTimeout(() => {
            const notification = notifications.find(n => n.id === notificationId);
            setHoveredNotification(notification);
        }, 1000);
        setHoverTimeoutId(timeoutId);
    };
    const handleNotificationMouseLeave = () => {
        clearTimeout(hoverTimeoutId);
        setHoverTimeoutId(null);
        setHoveredNotification(null);
    };
    const handleNotificationClick = (notificationId) => {
        setSelectedNotification(notifications.find(n => n.id === notificationId));
        setNotifications(notifications.map(n => {
            if (n.id === notificationId) {
                return { ...n, isRead: true };
            }
            return n;
        }));
    };
    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
    };
    const handleClosePopup = () => {
        setSelectedNotification(null);
    };
    const handleClearNotifications = () => {
        setNotifications([]);
        setShowConfirmation(true);
        setTimeout(() => {
            setShowConfirmation(false);
        }, 3000);
    };
    const handleHelp = () => {
        // Placeholder for help/documentation logic
    };

    return (
        <div className="app">
            <div className="container0">
                <div className="container1">
                    <div className="logo">
                        CodeSync
                    </div>
                    <div className="taskBar">
                        <Taskbar
                            onHelp={handleHelp}
                            onToggleNotifications={toggleNotifications}
                        />
                    </div>
                    {showNotifications && (
                        <div className="notifications-area">
                            Notifications
                            <button className="clear-notifications" onClick={handleClearNotifications}>Clear</button>
                            {notifications.map((notification) => (
                                <div key={notification.id} className={`notification-item ${notification.isRead ? 'read' : 'unread'}`} onClick={() => handleNotificationClick(notification.id)}
                                    onMouseEnter={() => handleNotificationMouseEnter(notification.id)}
                                    onMouseLeave={handleNotificationMouseLeave}>
                                    <span className="notification-description">{notification.description.slice(0, 15)}...</span>
                                    <span className="notification-timestamp">
                                        {new Date(notification.timestamp).toLocaleString('en-US', {
                                            month: 'long',
                                            day: 'numeric',
                                            year: 'numeric',
                                            hour: 'numeric',
                                            minute: 'numeric',
                                            hour12: true
                                        })}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                    {selectedNotification && (
                        <div className="popup-overlay" onClick={handleClosePopup}>
                            <div className="popup" onClick={(e) => e.stopPropagation()}> {/* Prevent popup from closing when clicking inside */}
                                <p><strong>Time:</strong> {new Date(selectedNotification.timestamp).toLocaleString('en-US', {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric',
                                    hour: 'numeric',
                                    minute: 'numeric',
                                    hour12: true
                                })}</p>
                                <p><strong>Message:</strong> {selectedNotification.description}</p>
                                <button onClick={handleClearCurrentNotification} className="clear-current-notification">Clear</button>
                            </div>
                        </div>
                    )}
                    {showConfirmation && (
                        <div className="confirmation-message">
                            Notifications cleared
                        </div>
                    )}
                    {hoveredNotification && (
                        <div className="hover-popup" style={{ position: 'absolute', top: '40px', left: '470px' }}>
                            <p>{hoveredNotification.description}</p>
                            <p className="notification-timestamp">{hoveredNotification.timestamp}</p>
                        </div>
                    )}
                </div>
                <div className="container2">
                    <div className="container3">
                        <div className="container7">
                            Project Information
                        </div>
                        <div className="container8">
                            <AddTaskForm addTask={addTask} allAssignees={allAssignees} />
                        </div>
                    </div>
                    <div className="container4">
                        <div className="title">User Kanban Board</div>
                        <div className="container5">
                            <KanbanBoard todo={userToDo} ip={userInProgress} done={userDone} tasks={userTasks} handleTaskChange={handleTaskChange} taskType="userTasks" allAssignees={allAssignees} handleStatusChange={handleStatusChange} handleDeleteTask={handleDeleteTask} />
                        </div>
                        <div className="title">Project Kanban Board</div>
                        <div className="container6">
                            <KanbanBoard todo={projToDo} ip={projInProgress} done={projDone} tasks={projectTasks} handleTaskChange={handleTaskChange} taskType="projectTasks" allAssignees={allAssignees} handleStatusChange={handleStatusChange} handleDeleteTask={handleDeleteTask} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;