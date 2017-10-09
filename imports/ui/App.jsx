import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { Tasks } from '../api/tasks.js';

import { Routines } from '../api/routine.js';

import Task from './Task.jsx';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';

// App component - represents the whole app
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hideCompleted: false,
      showRoutineForm: false,
      exercises: [],
      formError: ''
    };
  }

  handleSubmit(event) {
    // event.preventDefault();

    const comment = ReactDOM.findDOMNode(this.refs.comment).value.trim();
    Meteor.call('routines.addComment', this.state.routine._id, comment);
    ReactDOM.findDOMNode(this.refs.comment).value = '';
  }

  toggleHideCompleted() {
    this.setState({
      hideCompleted: !this.state.hideCompleted,
    });
  }
  toggleShowForm() {
    this.setState({
      showRoutineForm: !this.state.showRoutineForm,
    });
  }
  addRoutine() {
    const purpose = ReactDOM.findDOMNode(this.refs.purpose).value.trim();
    const name = ReactDOM.findDOMNode(this.refs.name).value.trim();
    Meteor.call('routines.insert', name, purpose, this.state.exercises);
  }
  addComment() {
    const comment = ReactDOM.findDOMNode(this.refs.comment).value.trim();
    Meteor.call('routines.addComment', this.state.routine._id, comment);
  }
  showRoutine(r) {

    this.setState({
      routine: r,
    });

    var modal = document.getElementById('myModal');

    modal.style.display = "block";

    window.onclick = function (event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    }
  }
  closeModal() {
    var modal = document.getElementById('myModal');
    modal.style.display = "none";
  }
  addExercise() {
    const name = ReactDOM.findDOMNode(this.refs.exercise).value.trim();
    const series = ReactDOM.findDOMNode(this.refs.series).value.trim();
    const repetitions = ReactDOM.findDOMNode(this.refs.repetitions).value.trim();
    const restTime = ReactDOM.findDOMNode(this.refs.restTime).value.trim();
    if (name !== '' && series !== '' && repetitions !== '' && restTime !== '') {
      const newExercise = {
        name,
        series,
        repetitions,
        restTime,
      };
      const updateExercises = this.state.exercises;
      updateExercises.push(newExercise);
      this.setState({
        exercises: updateExercises,
        formError: '',
      });
    } else {
      this.setState({
        formError: 'Some fields are missing',
      });
    }
  }
  deleteExercise(key) {
    const updateExercises = this.state.exercises;
    updateExercises.splice(key, 1);
    this.setState({
      exercises: updateExercises,
      formError: '',
    });
  }
  renderTasks() {
    let filteredTasks = this.props.tasks;
    if (this.state.hideCompleted) {
      filteredTasks = filteredTasks.filter(task => !task.checked);
    }
    return filteredTasks.map((task) => {
      const currentUserId = this.props.currentUser && this.props.currentUser._id;
      const showPrivateButton = task.owner === currentUserId;

      return (
        <Task
          key={task._id}
          task={task}
          showPrivateButton={showPrivateButton}
        />
      );
    });
  }
  renderRoutines() {
    return this.props.routines.map((routine) => {

      return (<div key={routine._id}>{routine.username} | <button onClick={() => this.showRoutine(routine)}>See Routine</button></div>);
    });
  }
  renderNewRoutine() {
    if (this.state.exercises.length > 0) {
      return this.state.exercises.map((exercise, key) => {
        return (<div>
          {exercise.name} |
          {exercise.repetitions} |
          {exercise.restTime} |
          {exercise.series} |
          <button type="button" onClick={() => this.deleteExercise(key)}>Delete Exercise</button>
        </div>)
      });
    }
    return (<div> <br /> Add some exercises to your routine! </div>);
  }
  renderComments() {
      return this.state.routine.comments.map((comment) => {
        return (<div>
          {comment.username} |
          {this.parseDate(comment.createdAt)} |
          {comment.comment} 
        </div>)
      });
  }
  parseDate(date) {
    year = date.getFullYear();
    month = date.getMonth() + 1;
    dt = date.getDate();

    if (dt < 10) {
      dt = '0' + dt;
    }
    if (month < 10) {
      month = '0' + month;
    }

    return (year + '-' + month + '-' + dt);
  }
  render() {
    return (
      <div className="container">
        <header>
          <AccountsUIWrapper />
          {this.props.currentUser ?
            <button onClick={this.toggleShowForm.bind(this)}>Add Routine</button> : ''
          }
        </header>

        <div id="myModal" className="modal">
          {this.state.routine ?
            <div className="modal-content">
              <span className="close" onClick={this.closeModal.bind(this)}>&times;</span>
              <p>{this.state.routine.name}</p>
              <p>{this.state.routine.username}</p>
              <p>{this.state.routine.purpose}</p>
              <button onClick={this.addReaction('rat')}>{this.state.routine.reactions.rat}</button>
              <button onClick={this.addReaction('tiger')}>{this.state.routine.reactions.tiger}</button>
              <button onClick={this.addReaction('poop')}>{this.state.routine.reactions.poop}</button>
              <button onClick={this.addReaction('toy')}>{this.state.routine.reactions.toy}</button>
              {this.renderComments()}
              { this.props.currentUser ?
            <form className="new-comment" onSubmit={this.handleSubmit.bind(this)}  >
              <input
                type="text"
                ref="comment"
                placeholder="Type to add a new comment"
              />
            </form> : ''}
            </div>

            : ''}
        </div>

        {this.state.showRoutineForm && this.props.currentUser ? <div>
          {this.state.formError}
          <form onSubmit={this.addRoutine.bind(this)}>
            <label for="name">Name</label><input
              required
              name="name"
              type="text"
              ref="name"
              placeholder="The name of your routine"
            />
            <label for="purpose">Purpose</label><input
              required
              name="purpose"
              type="text"
              ref="purpose"
              placeholder="The purpose of your routine"
            />
            <label for="exercise">Exercise</label><input
              required
              name="exercise"
              type="text"
              ref="exercise"
              placeholder="Name of the exercise"
            />
            <label for="series">Series</label>
            <input
              name="series"
              type="number"
              min="1"
              ref="series"
            />
            <label for="repetitions">Repetitions</label>
            <input
              name="repetitions"
              type="number"
              min="1"
              ref="repetitions"
            />
            <label for="restTime">Rest Time (s)</label>
            <input
              name="restTime"
              type="number"
              min="1"
              ref="restTime"
            />
            <button
              type="button"
              onClick={this.addExercise.bind(this)}>
              Add Exercise
          </button>
            {this.renderNewRoutine()}
            {this.state.exercises.length ? <button >Add Routine</button> : ''}
          </form>
        </div> : ''}
        <ul>
          {this.renderTasks()}
        </ul>
        <ul>
          {this.renderRoutines()}
        </ul>
      </div>
    );
  }
}

App.propTypes = {
  tasks: PropTypes.array.isRequired,
  incompleteCount: PropTypes.number.isRequired,
  currentUser: PropTypes.object,
};

export default createContainer(() => {
  Meteor.subscribe('tasks');
  Meteor.subscribe('routines');
  return {
    routines: Routines.find({}, { sort: { createdAt: -1 } }).fetch(),
    tasks: Tasks.find({}, { sort: { createdAt: -1 } }).fetch(),
    incompleteCount: Tasks.find({ checked: { $ne: true } }).count(),
    currentUser: Meteor.user(),
  };
}, App);
