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
