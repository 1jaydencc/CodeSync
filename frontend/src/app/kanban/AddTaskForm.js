import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import CreatableSelect from 'react-select/creatable';
import './App.css';

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

const AddTaskForm = ({ addTask, allAssignees }) => {
  const initialFormState = {
    id: '',
    priority: 'High',
    type: 'Bug',
    tags: [],
    deadline: '',
    assignedTo: [],
    description: '',
    status: 'To-Do',
  };

  const [formState, setFormState] = useState(initialFormState);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleDateChange = (date) => {
    setFormState({ ...formState, deadline: date });
  };

  const handleTagsChange = (tags) => {
    setFormState({ ...formState, tags });
  };

  const handleAssignedToChange = (assignedTo) => {
    setFormState({ ...formState, assignedTo: assignedTo.map(option => option.value) });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const { id, ...restOfForm } = formState;
    const isEmpty = Object.values(restOfForm).some(value => value === '' || (Array.isArray(value) && value.length === 0));
    if (isEmpty) {
        alert("Please fill in all fields before adding a task.");
        return;
    }
    addTask(formState);
    setFormState(initialFormState);
  };

  return (
    <div className="task1">
    <form onSubmit={handleSubmit}>
      <select name="priority" value={formState.priority} onChange={handleChange}>
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>
      <select name="type" value={formState.type} onChange={handleChange}>
        <option value="Bug">Bug</option>
        <option value="Improvement">Improvement</option>
        <option value="Feature">Feature</option>
      </select>
      <CreatableSelect
        isMulti
        styles={customStyles}
        theme={theme}
        name="tags"
        getOptionValue={(option) => option.value}
        getOptionLabel={(option) => option.label}
        value={formState.tags}
        onChange={handleTagsChange}
        placeholder="Create or select tags..."
      />
      <DatePicker
        selected={formState.deadline}
        onChange={handleDateChange}
      />
      <CreatableSelect
        isMulti
        styles={customStyles}
        theme={theme}
        name="assignedTo"
        getOptionValue={(option) => option.value}
        getOptionLabel={(option) => option.label}
        value={allAssignees.filter(assignee => formState.assignedTo.includes(assignee.value))}
        options={allAssignees}
        onChange={handleAssignedToChange}
        placeholder="Assign people..."
      />
      <textarea name="description" value={formState.description} onChange={handleChange}></textarea>
      <select name="status" value={formState.status} onChange={handleChange}>
        <option value="To-Do">To Do</option>
        <option value="In-Progress">In Progress</option>
        <option value="Done">Done</option>
      </select>
      <center><button type="submit">Add Task</button></center>
    </form>
    </div>
  );
};

export default AddTaskForm;