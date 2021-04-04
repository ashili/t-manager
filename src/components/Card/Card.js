import React from 'react';
import './Card.css';

const Card = (task) => (
  <div className='Card'>
    <div className='Card draggable'>
      <h2>{task.task.title}</h2>
      <h4>{task.task.description}</h4>
      <p>By : {task.task.author}</p>
    </div>
  </div>
);

export default Card;
