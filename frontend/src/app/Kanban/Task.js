'use client';
import React, { useState, useEffect } from 'react';
import './App.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import CreatableSelect from 'react-select/creatable';
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { prism } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: '#1e1e1e',
      borderColor: '#555',
      color: '#fff',
      width: '100%',
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: '#1e1e1e',
      color: '#fff',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#333' : '#1e1e1e',
      color: '#fff',
      '&:hover': {
        backgroundColor: '#333',
      },
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: '#333',
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: '#fff',
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: '#fff',
      '&:hover': {
        backgroundColor: '#555',
        color: '#fff',
      },
    }),
  };
  
  const theme = (theme) => ({
    ...theme,
    colors: {
      ...theme.colors,
      primary: '#555',
      neutral0: '#1e1e1e',
      neutral80: '#fff',
    },
  });

const Task = ({ task, handleTaskChange, allAssignees, handleStatusChange, handleDeleteTask}) => {
    const [localTask, setLocalTask] = useState(task);
    const tagsOptions = localTask.tags.map(tag => ({ value: tag, label: tag }));
    const assignedToOptions = localTask.assignedTo.map(person => ({ value: person, label: person }));
    const [code, setCode] = useState(task.code);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setLocalTask({ ...localTask, [name]: value });
    };

    const handleCodeChange = (e) => {
        setCode(e.target.value);
        const updatedTask = { ...localTask, code: e.target.value };
        setLocalTask(updatedTask);
    };

    const handleDateChange = (date) => {
        setLocalTask({ ...localTask, deadline: date.toISOString() });
    };

    const handleTagsChange = (newValue) => {
        const newTags = newValue ? newValue.map(option => option.value) : [];
        setLocalTask({ ...localTask, tags: newTags });
    };

    const handleAssignedToChange = (newValue) => {
        const newAssignedTo = newValue ? newValue.map(option => option.value) : [];
        setLocalTask({ ...localTask, assignedTo: newAssignedTo });
    };

    const handleStatusChangeTask = (event) => {
        const newStatus = event.target.value;
        const updatedTask = { ...localTask, status: newStatus };
        setLocalTask(updatedTask);
        handleStatusChange(localTask.id, newStatus);
    };

    const updateTask = () => {
        handleTaskChange(localTask.id, localTask);
    };

    const handleDelete = () => {
        handleDeleteTask(task.id);
    };

    return (
        <div className="task">
            <select name="priority" value={localTask.priority} onChange={handleChange} onBlur={updateTask}>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
            </select>
            <select name="type" value={localTask.type} onChange={handleChange} onBlur={updateTask}>
                <option value="Bug">Bug</option>
                <option value="Improvement">Improvement</option>
                <option value="Feature">Feature</option>
            </select>
            <CreatableSelect
                isMulti
                styles={customStyles}
                theme={theme}
                name="tags"
                options={tagsOptions}
                value={tagsOptions}
                onChange={handleTagsChange}
                onBlur={updateTask}
                placeholder="Create or select tags..."
            />
            <DatePicker selected={new Date(localTask.deadline)} onChange={handleDateChange} onBlur={updateTask} />
            <CreatableSelect
                isMulti
                styles={customStyles}
                theme={theme}
                name="assignedTo"
                options={allAssignees}
                value={assignedToOptions}
                onChange={handleAssignedToChange}
                onBlur={updateTask}
                placeholder="Assign people..."
            />
            <textarea name="description" value={localTask.description} onChange={handleChange} onBlur={updateTask}></textarea>
            <select
                name="status"
                value={localTask.status}
                onChange={handleStatusChangeTask}
            >
                <option value="To-Do">To Do</option>
                <option value="In-Progress">In Progress</option>
                <option value="Done">Done</option>
            </select>
            <SyntaxHighlighter language="python" style={vscDarkPlus} customStyle={{ maxHeight: '150px', overflowY: 'auto', width: '100%' }}>
                {code}
            </SyntaxHighlighter>
            <textarea
                name="code"
                value={code}
                onChange={handleCodeChange}
                onBlur={updateTask}
                style={{ height: '150px', width: '100%', fontFamily: 'monospace', marginTop: '10px' }}
                placeholder="Paste your code here..."
            />
            <center><button onClick={handleDelete}>Delete</button></center>

        </div>
    );
};

export default Task;

