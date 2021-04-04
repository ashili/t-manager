import React from 'react';
import './Gridview.css';
import Card from '../Card/Card';
import { Draggable, Droppable } from 'react-beautiful-dnd';

const GridView = ({ tasks, title, id, onDragEnd }) => {
    const classname="Gridview " + title
  if (tasks) {
    return (
      <div  className = {classname}>
        <h1 className='title'>{title}</h1>
        <Droppable droppableId={id}>
          {(provided, snapshot) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {tasks.map((task, i) => {
                return (
                  <Draggable
                    key={task.id}
                    draggableId={'d' + task.id}
                    index={i}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <Card key={task.id} task={task} />
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    );
  }
};

export default GridView;
