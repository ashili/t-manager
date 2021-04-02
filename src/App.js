import React, { Component } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import { DragDropContext } from 'react-beautiful-dnd';

import Header from './components/Header/Header';
import GridView from './components/Gridview/Gridview';
import ListView from './components/ListView/ListView';
import AddTask from './components/AddTask/AddTask';

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      allTasks: [],
      todo: [],
      wip: [],
      review: [],
      done: [],
    };
  }

  componentDidMount() {
    this.getTasks();
  }

  getTasks() {
    axios
      .get(`http://my-json-server.typicode.com/ashili/is332P2DB/tasks`)
      .then((response) => {
        this.setState({
          allTasks: response.data,
        });
        this.sortTasks(this.state.allTasks);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  sortTasks = (tasks) => {
    tasks.forEach((task) => {
      if (task.column === 'todo') {
        this.setState({
          todo: [...this.state.todo, task],
        });
      } else if (task.column === 'wip') {
        this.setState({
          wip: [...this.state.wip, task],
        });
      } else if (task.column === 'review') {
        this.setState({
          review: [...this.state.review, task],
        });
      } else if (task.column === 'done') {
        this.setState({
          done: [...this.state.done, task],
        });
      }
    });
  };

  addItem = (src, dest, item) => {
    this.setState({
      dest: [...this.state.todo, item],
    });
  };
  // update = (source, destination, arr, idx) => {
  //   let item = arr[idx];
  //   arr.splice(idx, 1);
  //   this.setState({
  //     [source]: arr,
  //     [destination]: [this.state[destination], item],
  //   });
  // };

  onDragEnd = (result) => {
    if (result.destination === null) {
      return;
    }
    console.log(result);
    // const idx = parseInt(result.draggableId.substring(1));
    const todos = [...this.state.todo];
    const wips = Object.assign([], this.state.wip);
    const reviews = Object.assign([], this.state.review);
    const srcIndex = result.source.index;
    const dstIndex = result.destination.index;
    const srcCol = result.source.droppableId;
    const dstCol = result.destination.droppableId;
    console.log(srcIndex, 'in', srcCol, 'to ', dstIndex, 'to ', dstCol);

    if (!result.destination) return;

    if (srcCol !== dstCol) {
      if (srcCol === 'todo' && dstCol === 'wip') {
        const item = todos[srcIndex];
        todos.splice(srcIndex, 1);
        this.setState({
          todo: todos,
          wip: [...this.state.wip, item],
        });
      }
      if (srcCol === 'wip' && dstCol === 'todo') {
        const item = wips[srcIndex];
        wips.splice(srcIndex, 1);
        this.setState({
          wip: wips,
          todo: [...this.state.todo, item],
        });
      }
      if (srcCol === 'review' && dstCol === 'todo') {
        const item = reviews[srcIndex];
        reviews.splice(srcIndex, 1);
        this.setState({
          review: reviews,
          todo: [...this.state.todo, item],
        });
      }
      if (srcCol === 'review' && dstCol === 'wip') {
        const item = reviews[srcIndex];
        reviews.splice(srcIndex, 1);
        this.setState({
          review: reviews,
          wip: [...this.state.wip, item],
        });
      }
      if (srcCol === 'todo' && dstCol === 'review') {
        const item = todos[srcIndex];
        todos.splice(srcIndex, 1);
        this.setState({
          todo: todos,
          review: [...this.state.review, item],
        });
      }

      if (srcCol === 'todo' && dstCol === 'done') {
        const item = todos[srcIndex];
        todos.splice(srcIndex, 1);
        this.setState({
          todo: todos,
          done: [...this.state.done, item],
        });
      }
      if (srcCol === 'review' && dstCol === 'done') {
        const item = reviews[srcIndex];
        reviews.splice(srcIndex, 1);
        this.setState({
          review: reviews,
          done: [...this.state.done, item],
        });
      }
      if (srcCol === 'wip' && dstCol === 'done') {
        const item = wips[srcIndex];
        wips.splice(srcIndex, 1);
        this.setState({
          wip: wips,
          done: [...this.state.done, item],
        });
      }
    }
  };

  render() {
    return (
      <Router>
        <div className='App'>
          <Header />
          <Switch>
            <Route exact path='/'>
              <DragDropContext onDragEnd={this.onDragEnd}>
                <div className='GridView'>
                  <GridView
                    className='todo'
                    tasks={this.state.todo}
                    title='TODO'
                    id='todo'
                    onDragEnd={this.onDragEnd}
                  />
                  <GridView
                    className='wip'
                    tasks={this.state.wip}
                    title='WIP'
                    id='wip'
                    onDragEnd={this.onDragEnd}
                  />
                  <GridView
                    className='review'
                    tasks={this.state.review}
                    title='REVIEW'
                    id='review'
                    onDragEnd={this.onDragEnd}
                  />
                  <GridView
                    className='done'
                    tasks={this.state.done}
                    title='DONE'
                    id='done'
                    onDragEnd={this.onDragEnd}
                  />
                </div>
              </DragDropContext>
            </Route>
            <Route path='/listView'>
              <ListView />
            </Route>
            <Route path='/addTask'>
              <AddTask />
            </Route>
          </Switch>
        </div>
      </Router>
    );
  }
}
