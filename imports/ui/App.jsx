import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { Tasks } from '../api/tasks.js';
import{Exercisers} from'../api/exercisers.js';
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
      formError: '',
      selectedOption: 'ganarMasaMuscular',
      interestingIn: '',

    };
  }

  handleSubmit(event) {
    // event.preventDefault();
    const comment = ReactDOM.findDOMNode(this.refs.comment).value.trim();
    Meteor.call('routines.addComment', this.state.routine._id, comment);
    ReactDOM.findDOMNode(this.refs.comment).value = '';
    
  }
  addReaction () {
    
  }
  handleSubmit2(event){

    event.preventDefault();
    const temp = {
      name: ReactDOM.findDOMNode(this.refs.papapapap).value.trim(),
      age: ReactDOM.findDOMNode(this.refs.age).value.trim(),
      weight: ReactDOM.findDOMNode(this.refs.weight).value.trim(),
      heightT: ReactDOM.findDOMNode(this.refs.height).value.trim(),
      emailT: ReactDOM.findDOMNode(this.refs.email).value.trim(),
      routines: [],
      interestingIn: this.state.interestingIn,
      userId: this.props.currentUser._id,

    }
    Meteor.call('exercisers.insert', temp);
  }



  setInteresting(event) {
    console.log(event.target.value);
    this.setState(
      { interestingIn: event.target.value }
    );
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
              {this.props.currentUser ?
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
          {this.renderRoutines()}
        </ul>

        {!this.props.user && this.props.currentUser ?
          <form name="register" onSubmit={this.handleSubmit2.bind(this)} >

            <label for="name">Name: </label><input name="name" type="text" ref="papapapap" required />
            <br />
            <label for="age">Age:<input name="age" type="text" ref="age" required /></label>
            <br />
            <label for="weight">Weight:<input name="weight" type="number" min="0" ref="weight" required /></label>
            <br />
            <label for="height">Height: <input name="height" type="text" min="0" ref="height" required /> </label>
            <br />
            <label for="email">E-mail: <input name="email" type="email" ref="email" required /></label>
            <br />
            <div onChange={this.setInteresting.bind(this)}>
              <input type="radio" value="ganarMasaMuscular" name="a" required /> Ganar Masa Muscular
                  <input type="radio" value="perderPeso" name="a" /> Perder Peso
                  <input type="radio" value="pasatiempo" name="a" /> Pasa tiempo
             </div>
            <button type="submit" >Guardar</button>
          </form> : ''
        }

      </div>
    );
  }
}

App.propTypes = {
  user: PropTypes.object,
  incompleteCount: PropTypes.number.isRequired,
  currentUser: PropTypes.object,
};

export default createContainer(() => {
  Meteor.subscribe('exercisers');
  Meteor.subscribe('routines');
  if (Meteor.user()) {

    return {

      user: Exercisers.findOne({ userId: Meteor.user()._id }),
      routines: Routines.find({}, { sort: { createdAt: -1 } }).fetch(),
      incompleteCount: Tasks.find({ checked: { $ne: true } }).count(),
      currentUser: Meteor.user(),
    }
  }
  else {

    return {
      routines: Routines.find({}, { sort: { createdAt: -1 } }).fetch(),
      incompleteCount: Tasks.find({ checked: { $ne: true } }).count(),
      currentUser: Meteor.user(),
    }
  }
}, App);
