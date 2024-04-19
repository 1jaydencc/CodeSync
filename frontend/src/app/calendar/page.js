'use client';
import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./App.css";
import Taskbar from './taskbar.js';
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
 
const App = () => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [eventName, setEventName] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [events, setEvents] = useState([
        {
        id: 1713500132313, // Unique ID generated using new Date().getTime()
        date: new Date(2024, 3, 20), // Date object representing the event date
        title: "a", // Event title
        startTime: "a", // Event start time
        endTime: "a" // Event end time
        },
        {
            id: new Date(2024, 3, 20).getTime(), // Unique ID based on timestamp
            date: new Date(2024, 3, 10),
            title: "Meeting",
            startTime: "10:00 AM",
            endTime: "11:00 AM"
        },
        // Add more events as needed
    ]);
 
    const Date_Click = (date) => {
        setSelectedDate(date);
    };
 
    const Event_Data_Update = (event) => {
        setEventName(event.target.value);
    };

    const Start_Time_Update = (event) => {
        setStartTime(event.target.value);
    };

    const End_Time_Update = (event) => {
        setEndTime(event.target.value);
    };
 
    const Create_Event = async () => {
        if (selectedDate && eventName) {
            const newEvent = {
                id: new Date().getTime(),
                date: selectedDate,
                title: eventName,
                startTime: startTime,
                endTime: endTime,
             // Assuming you have authentication set up
            };
            try {
               // await setDoc(doc(db, "Events", eventName));
                console.log(newEvent);
                setEvents([...events, newEvent]); // Update local state
                setSelectedDate(null);
                setEventName("");
                setStartTime("");
                setEndTime("");
                setSelectedDate(newEvent.date);
            } catch (error) {
                console.error("Error adding document: ", error);
            }
        }
    };
 
    const Update_Event = async (eventId, newName, newStartTime, newEndTime) => {
        try {
           /* await setDoc(doc(db, "Events", newName), 
            {
                title: newName,
                startTime: newStartTime,
                endTime: newEndTime
            }, { merge: true }); */
            const updatedEvents = events.map(event => {
                if (event.id === eventId) {
                    return { ...event, title: newName, startTime: newStartTime, endTime: newEndTime };
                }
                return event;
            });
            setEvents(updatedEvents); // Update local state
        } catch (error) {
            console.error("Error updating document: ", error);
        }
    };
 
    const Delete_Event = async (eventId) => {
        try {
           // await deleteDoc(doc(db, "Events", eventId));
            const updatedEvents = events.filter(event => event.id !== eventId);
            setEvents(updatedEvents); // Update local state
        } catch (error) {
            console.error("Error deleting document: ", error);
        }
    };
 
    return (
        <div className="app">
            <div className="logo">
                        CodeSync
                    </div>
          <div className="taskBar">
                        <Taskbar
                      
                        />
                    </div>
            <h1> Schedule Coding Sessions </h1>
            <div className="container">
                <div className="calendar-container">
                    <Calendar
                        value={selectedDate}
                        onClickDay={Date_Click}
                        tileClassName={({ date }) =>
                            selectedDate &&
                            date.toDateString() === selectedDate.toDateString()
                                ? "selected"
                                : events.some(
                                      (event) =>
                                          event.date.toDateString() ===
                                          date.toDateString(),
                                  )
                                ? "event-marked"
                                : ""
                        }
                    />{" "}
                </div>
                <div className="event-container">
                    {" "}
                    {selectedDate && (
                        <div className="event-form">
                            <h2> Create Sessions </h2>{" "}
                            <p>
                                {" "}
                                Selected Date: {selectedDate.toDateString()}{" "}
                            </p>{" "}
                            <input
                                type="text"
                                placeholder="Session Name"
                                value={eventName}
                                onChange={Event_Data_Update}
                            /> <br />
                            {" "}<input
                                type="text"
                                placeholder="Start Time"
                                value={startTime}
                                onChange={Start_Time_Update}
                            /> {" "} <br />
                            <input
                                type="text"
                                placeholder="End Time"
                                value={endTime}
                                onChange={End_Time_Update}
                            /> {" "} <br />
                            <button
                                className="create-btn"
                                onClick={Create_Event}
                            >
                                Add Session{" "}
                            </button>{" "}
                        </div>
                    )}
                    {events.length > 0 && selectedDate && (
                        <div className="event-list">
                            <h2> Session List </h2>{" "}
                            <div className="event-cards">
                                {" "}
                                {events.map((event) =>
                                    event.date.toDateString() ===
                                    selectedDate.toDateString() ? (
                                        <div
                                            key={event.id}
                                            className="event-card"
                                        >
                                            <div className="event-card-header">
                                                <span className="event-date">
                                                    {" "}
                                                    {event.date.toDateString()}{" "}
                                                </span>{" "}
                                                <div className="event-actions">
                                                    <button
                                                        className="update-btn"
                                                        onClick={() =>
                                                            {
                                                                const newTitle = eventName || event.title;
                                                                const newStartTime = startTime || event.startTime;
                                                                const newEndTime = endTime || event.endTime;
                                                                Update_Event(event.id, newTitle, newStartTime, newEndTime);
                                                            }
                                                        }
                                                    >
                                                        Update Session{" "}
                                                    </button>{" "}
                                                    <button
                                                        className="delete-btn"
                                                        onClick={() =>
                                                            Delete_Event(
                                                                event.id,
                                                            )
                                                        }
                                                    >
                                                        Delete Session{" "}
                                                    </button>{" "}
                                                </div>{" "}
                                            </div>{" "}
                                            <div className="event-card-body">
                                                <p className="event-title">
                                                    {" "}
                                                    {event.title} ({event.startTime} - {event.endTime}){" "}
                                                </p>{" "}
                                            </div>{" "}
                                        </div>
                                    ) : null,
                                )}{" "}
                            </div>{" "}
                        </div>
                    )}{" "}
                </div>{" "}
            </div>{" "}
        </div>
    );
};
 
export default App;
