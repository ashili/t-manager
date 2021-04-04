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
  constructor(props) {
    super(props);
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

  update = (sIndex, dIndex, arr,  destArrName, arrName) => {
    let item = arr[sIndex];
    arr.splice(sIndex, 1);
    this.setState({
      [arrName]: arr,
      [destArrName]: [...this.state[destArrName], item],
    });
  };

  onDragEnd = (result) => {
    if (!result.destination) return;

    const todos = [...this.state.todo];
    const wips = [...this.state.wip];
    const reviews = [...this.state.review];
    const dones = [...this.state.done];
    const srcIndex = result.source.index;
    const dstIndex = result.destination.index;
    const srcCol = result.source.droppableId;
    const dstCol = result.destination.droppableId;
    if(srcCol === "todo"  && dstCol){
      this.update(srcIndex,dstIndex,todos,dstCol,srcCol)
    }
    if(srcCol === "wip"  && dstCol){
      this.update(srcIndex,dstIndex,wips,dstCol,srcCol)
    }
    if(srcCol === "review"  && dstCol){
      this.update(srcIndex,dstIndex,reviews,dstCol,srcCol)
    }
    if(srcCol === "done"  && dstCol){
      this.update(srcIndex,dstIndex,dones,dstCol,srcCol)
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
                  {
                    //TODO: refactor into 1 function and 1 array then map through
                  }
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
