import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { Exercisers } from '../api/exercisers.js';
import { Routines } from '../api/routine.js';


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
      selectedUser: {},

    };
  }

  handleSubmit(event) {
    event.preventDefault();
    const comment = ReactDOM.findDOMNode(this.refs.comment).value.trim();
    Meteor.call('routines.addComment', this.state.routine._id, comment);
    const r = Routines.findOne(this.state.routine._id);
    this.setState({
      routine: r,
    });
    ReactDOM.findDOMNode(this.refs.comment).value = '';
  }
  addReaction(reaction) {
    Meteor.call('routines.addReaction', this.state.routine._id, reaction);
    const r = Routines.findOne(this.state.routine._id);
    this.setState({
      routine: r,
    });
  }
  handleSubmit2(event) {

    event.preventDefault();
    const temp = {
      name: ReactDOM.findDOMNode(this.refs.papapapap).value.trim(),
      age: ReactDOM.findDOMNode(this.refs.age).value.trim(),
      weight: ReactDOM.findDOMNode(this.refs.weight).value.trim(),
      height: ReactDOM.findDOMNode(this.refs.heightxxx).value.trim(),
      email: ReactDOM.findDOMNode(this.refs.ccccccc).value.trim(),
      routines: [],
      interestingIn: this.state.interestingIn,
      userId: this.props.currentUser._id,
      following: [],

    }

    console.log(JSON.stringify(temp));
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
  getRandomImg() {
    var rand = Math.floor(Math.random() * 5);
    if (rand === 1) {
      return './exercise.svg';
    } else if (rand === 2) {
      return './gym.svg';
    } else if (rand === 3) {
      return './mat.svg';
    }
    return './arm.svg';
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

  showRoutine2(r) {
    this.closeModalUser()
    this.showRoutine(r)
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

  showUser(r) {
    console.log(r);
    const x = Exercisers.findOne({ userId: r });
    this.setState({
      selectedUser: x,
    });

    var modal = document.getElementById('myModalUser');

    modal.style.display = "block";

    window.onclick = function (event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    }
  }

  follow(obj) {
    const actual = Exercisers.findOne({ userId: Meteor.user()._id });
    actual.following.push({ userId: obj._id, name: obj.name });
    Exercisers.update({ _id: actual._id }, actual);
  }

  unfollow(obj) {


    const actual = Exercisers.findOne({ userId: Meteor.user()._id });
    for (var i = 0; i < actual.following.length; i++) {
      if (actual.following[i].userId == obj._id) {
        console.log('entra');
        actual.following.splice(i, 1);
        break;
      }
    }
    Exercisers.update({ _id: actual._id }, actual);
  }

  imFollowing(idUsuario) {
    const actual = Exercisers.findOne({ userId: Meteor.user()._id });

    for (var i = 0; i < actual.following.length; i++) {
      if (actual.following[i].userId == idUsuario)
        return true;
    }
    return false;


  }

  closeModalUser() {
    var modal = document.getElementById('myModalUser');
    modal.style.display = "none";
  }
  renderRoutinesUser(idUser) {
    if (Meteor.user()) {

      return this.props.routines.filter(function (elem) {
        return elem.userID == idUser;
      }).map((exer) => {

        return (<div key={exer._id} >   <button onClick={() => this.showRoutine2(exer)}>{exer.name}</button>  </div>);
      });

    }
  }
  renderFollowers() {
    if (Meteor.user()) {
      const li = this.props.user.following;
      return this.props.exercisers.filter(function (elem) {
        for (var i = 0; i < li.length; i++) {
          if (li[i].userId == elem._id) {
            return elem;
          }
        }
      }).map((exer) => {

        return (<div key={exer._id} >   <button onClick={() => this.showUser(exer.userId)}>{exer.username}</button>  </div>);
      });

    }
  }


  renderRoutines() {
    return this.props.routines.map((routine) => {

      return (<div className="routine" key={routine._id}>
        <img src={this.getRandomImg()} className="routineIcon" /> <br />
        <h3>{routine.name}</h3> <b>by:</b> <h4>{routine.username}</h4>
        <button onClick={() => this.showRoutine(routine)}>SEE ROUTINE</button>
      </div>);
    });
  }
  renderNewRoutine() {
    if (this.state.exercises.length > 0) {
      return this.state.exercises.map((exercise, key) => {
        return (<div className="exercise">
          <b>Name:</b> {exercise.name}  &nbsp;
          <b>Series:</b>{exercise.series} &nbsp;
          <b>Repetitions:</b> {exercise.repetitions}  &nbsp;
          <b>Rest Time:</b> {exercise.restTime}
          <button type="button" onClick={() => this.deleteExercise(key)}>DELETE</button>
        </div>)
      });
    }
    return (<div> <br /> Add some exercises to your routine! </div>);
  }
  renderComments() {
    return this.state.routine.comments.map((comment) => {
      return (<div className="comment">
        {comment.username}
        <span> {this.parseDate(comment.createdAt)} </span>
        <br /><span>{comment.comment}</span>
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
        {!this.props.user && this.props.currentUser ?
            <form name="register" onSubmit={this.handleSubmit2.bind(this)} >

              <label for="name">Name: </label><input name="name" type="text" ref="papapapap" required />
              <br />
              <label for="age">Age:<input name="age" type="text" ref="age" required /></label>
              <br />
              <label for="weight">Weight:<input name="weight" type="number" min="0" ref="weight" required /></label>
              <br />
              <label for="height">Height: <input name="height" type="number" min="0" ref="heightxxx" required /> </label>
              <br />
              <label for="email">E-mail: <input name="email" type="email" ref="ccccccc" required /></label>
              <br />
              <div onChange={this.setInteresting.bind(this)}>
                <input type="radio" value="Gain Mass" name="a" required /> Gain Mass
                  <input type="radio" value="Loss weight" name="a" /> Loss weight
                  <input type="radio" value="Hobby" name="a" /> Hobby
             </div>
              <button type="submit" >Guardar</button>
            </form> : ''
          }
          <AccountsUIWrapper />
          <h1>GYM<br />BUDDIES <img src="./weightlifting.svg" className="weights" /></h1>
        <h2>Share your routines and get comments,<br /> reactions and followers from other exercise lovers</h2>
        </header>
        {this.props.currentUser ?
            <button className="addRoutine" onClick={this.toggleShowForm.bind(this)}>ADD ROUTINE</button> : ''
          }
        <div id="myModal" className="modal">
          {this.state.routine ?
            <div className="modal-content">
              <div className="modal-header">
              <span className="close" onClick={this.closeModal.bind(this)}>&times;</span>
              <h2>Routine Name:</h2> <h1>{this.state.routine.name}</h1> <br />
              <h2>by:</h2> <h1>{this.state.routine.username}</h1> <br />
              <h2>Purpose:</h2> <h1>{this.state.routine.purpose}</h1> <br />
              <button onClick={()=>this.addReaction('rat')}><img src="./dumbbell.svg" className="icontReact" />{this.state.routine.reactions.rat}</button>
              <button onClick={()=>this.addReaction('tiger')}><img src="./tiger.svg" className="icontReact" />{this.state.routine.reactions.tiger}</button>
              <button onClick={()=>this.addReaction('poop')}><img src="./broken-heart.svg" className="icontReact" />{this.state.routine.reactions.poop}</button>
              <button onClick={()=>this.addReaction('toy')}><img src="./baby-poop.svg" className="icontReact" />{this.state.routine.reactions.toy}</button>
              </div>
              {this.props.currentUser ?
                <form className="new-comment" onSubmit={this.handleSubmit.bind(this)}  >
                  <input
                    type="text"
                    ref="comment"
                    placeholder="Type to add a new comment"
                  /><button>SEND</button>
                </form> : ''}
                {this.renderComments()}
            </div>
            : ''}
        </div>
        <div id="myModalUser" className="modal">
          {this.state.selectedUser ?
            <div className="modal-content">
              <span className="close" onClick={this.closeModalUser.bind(this)}>&times;</span>
              <label >Name: {this.state.selectedUser.name}</label> <br />
              <label >Age: {this.state.selectedUser.age}</label><br />
              <label >E-mail:{this.state.selectedUser.email}</label><br />
              <label >Weight: {this.state.selectedUser.weight}</label><br />
              <label >Height: {this.state.selectedUser.height}</label><br />
              <label >Interesting In: {this.state.selectedUser.interestingIn}</label><br />
              {this.props.user && this.props.currentUser && !this.imFollowing(this.state.selectedUser._id) ?
                <button onClick={() => this.follow(this.state.selectedUser)}>Follow</button>
                : ''
              }
              {this.props.user && this.props.currentUser && this.imFollowing(this.state.selectedUser._id) ?
                <button onClick={() => this.unfollow(this.state.selectedUser)}>Unfollow</button>
                : ''
              }
              <ul>
                <h1>Routines</h1>
                {this.renderRoutinesUser(this.state.selectedUser.userId)}
              </ul>



            </div>

            : ''}
        </div>
        
        {this.state.showRoutineForm && this.props.currentUser ? <div className="newRoutine">
          <h3>Create a new routine</h3>
          <span className="error">{this.state.formError}</span>
          <form onSubmit={this.addRoutine.bind(this)}>
            <label for="name">Name</label><input
              required
              name="name"
              type="text"
              ref="name"
              placeholder="The name of your routine"
            /> <br />
            <label for="purpose">Purpose</label><input
              required
              name="purpose"
              type="text"
              ref="purpose"
              placeholder="The purpose of your routine"
            /> <br />
            <div className="exercises">
              <h4>Routine Exercises</h4>
            <label for="exercise">Name</label><input
              required
              name="exercise"
              type="text"
              ref="exercise"
              placeholder="Name of the exercise"
            /> <br/>
            <label for="series">Series</label>
            <input
              name="series"
              type="number"
              min="1"
              ref="series"
              placeholder="Number of series"
            /> <br />
            <label for="repetitions">Repetitions</label>
            <input
              name="repetitions"
              type="number"
              min="1"
              ref="repetitions"
              placeholder="Number of repetitions"
            /> <br />
            <label for="restTime">Rest Time (s)</label>
            <input
              name="restTime"
              type="number"
              min="1"
              ref="restTime"
              placeholder="Rest time between series"
            /> <br />
            <button
              type="button"
              onClick={this.addExercise.bind(this)}>
              ADD EXERCISE
          </button>
            {this.renderNewRoutine()}
            </div>
            {this.state.exercises.length ? <button >ADD ROUTINE</button> : ''}
          </form>
        </div> : ''}
        <ul>
          <h1>Following</h1>
          {this.renderFollowers()}
        </ul>
        <div className="routines">
          {this.renderRoutines()}
        
      </div>
      </div>
    ) ;
  
}
}

App.propTypes = {
          user: PropTypes.object,
  currentUser: PropTypes.object,
};

export default createContainer(() => {
          Meteor.subscribe('exercisers');
        Meteor.subscribe('routines');
  if (Meteor.user()) {
    return {
          user: Exercisers.findOne({userId: Meteor.user()._id }),
      routines: Routines.find({}, {sort: {createdAt: -1 } }).fetch(),
      currentUser: Meteor.user(),
      exercisers: Exercisers.find({}).fetch(),
    }
  }
    return {

          routines: Routines.find({}, {sort: {createdAt: -1 } }).fetch(),
      currentUser: Meteor.user(),

    }

}, App);
