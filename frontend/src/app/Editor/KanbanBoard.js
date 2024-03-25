import React, { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import Column from './Column'; // Make sure you have this component
import { DragDropContext } from 'react-beautiful-dnd';

const KanbanBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [columns, setColumns] = useState({
    todo: { name: 'To Do', taskIds: [] },
    inProgress: { name: 'In Progress', taskIds: [] },
    done: { name: 'Done', taskIds: [] },
  });

  useEffect(() => {
    // Fetch tasks from Firestore and organize by priority within columns
    const fetchTasks = async () => {
      try {
        const snapshot = await firebase.firestore().collection('tasks').orderBy('priority', 'desc').get();
        const fetchedTasks = snapshot.docs.map(doc => {
          const data = doc.data();
          return { ...data, id: doc.id, timestamp: data.timestamp.toDate() };
        });

        // Assuming tasks have a 'status' field that matches the keys in columns
        const newColumns = { ...columns };
        fetchedTasks.forEach(task => {
          newColumns[task.status].taskIds.push(task.id);
        });

        setTasks(fetchedTasks);
        setColumns(newColumns);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
  
    // Do nothing if the item is dropped outside the list
    if (!destination) {
      return;
    }
  
    // Do nothing if the item is dropped into the same place
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
  
    // Handling task reordering within the same column or moving between columns
    const start = columns[source.droppableId];
    const finish = columns[destination.droppableId];
  
    // Moving within the same column
    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);
  
      const newColumn = {
        ...start,
        taskIds: newTaskIds,
      };
  
      setColumns({
        ...columns,
        [newColumn.id]: newColumn,
      });
    } else {
      // Moving from one column to another
      const startTaskIds = Array.from(start.taskIds);
      startTaskIds.splice(source.index, 1);
      const newStart = {
        ...start,
        taskIds: startTaskIds,
      };
  
      const finishTaskIds = Array.from(finish.taskIds);
      finishTaskIds.splice(destination.index, 0, draggableId);
      const newFinish = {
        ...finish,
        taskIds: finishTaskIds,
      };
  
      setColumns({
        ...columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      });
    }
    // Update Firebase with Task Locations (TO DO)
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {Object.entries(columns).map(([columnId, column]) => (
        <Column key={columnId} columnId={columnId} column={column} tasks={tasks} />
        // Pass necessary props to Column for rendering tasks
      ))}
    </DragDropContext>
  );
};

export default KanbanBoard;
