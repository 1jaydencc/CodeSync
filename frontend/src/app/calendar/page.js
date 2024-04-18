'use client';
import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./App.css";
import Taskbar from './taskbar.js';
 
const App = () => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [eventName, setEventName] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [events, setEvents] = useState([]);
 
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
 
    const Create_Event = () => {
        if (selectedDate && eventName) {
            const newEvent = {
                id: new Date().getTime(),
                date: selectedDate,
                title: eventName,
                startTime: startTime,
                endTime: endTime
            };
            setEvents([...events, newEvent]);
            setSelectedDate(null);
            setEventName("");
            setStartTime("");
            setEndTime("");
            setSelectedDate(newEvent.date);
        }
    };
 
    const Update_Event = (eventId, newName, newStartTime, newEndTime) => {
        const updated_Events = events.map((event) => {
            if (event.id === eventId) {
                return {
                    ...event,
                    title: newName,
                    startTime: newStartTime,
                    endTime: newEndTime,
                };
            }
            return event;
        });
        setEvents(updated_Events);
    };
 
    const Delete_Event = (eventId) => {
        const updated_Events = events.filter((event) => event.id !== eventId);
        setEvents(updated_Events);
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
