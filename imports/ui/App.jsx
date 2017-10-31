import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { Exercisers } from '../api/exercisers.js';
import { Routines } from '../api/routine.js';
import { Diets } from '../api/diets.js';

import AccountsUIWrapper from './AccountsUIWrapper.jsx';


// App component - represents the whole app
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hideCompleted: false,
      showRoutineForm: false,
      showDietForm: false,
      exercises: [],
      days:[],
      formError: '',
      selectedOption: 'ganarMasaMuscular',
      interestingIn: '',
      selectedUser: {},
      search: '',
    };

    this.searchChange = this.searchChange.bind(this);
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
  searchChange(event) {
    const target = event.target;
    const value = target.value;
    this.state.search = target.value;
    this.setState(prevState => ({
        search: this.state.search
    }));
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
  toggleShowForm2() {
    this.setState({
      showDietForm: !this.state.showDietForm,
    });
  }
  addDiet() { 
    console.log("llega");
    const purpose = ReactDOM.findDOMNode(this.refs.purpose2).value.trim();
    const name = ReactDOM.findDOMNode(this.refs.name2).value.trim();
    console.log("purpose:" + purpose);
    console.log("name:" + name);
    let calories = 0;
    for(i=0; i<this.state.days.length; i++) {
      calories += parseInt(this.state.days[i].calories);
    }
    Meteor.call('diets.insert', name, purpose, calories, this.state.days);
  }
  
  addRoutine() {

    const purpose = ReactDOM.findDOMNode(this.refs.purpose).value.trim();
    const name = ReactDOM.findDOMNode(this.refs.name).value.trim();
    let duration = 0;
    for(i=0; i<this.state.exercises.length; i++) {
      duration += parseInt(this.state.exercises[i].duration) + (parseInt(this.state.exercises[i].restTime)*(parseInt(this.state.exercises[i].repetitions)-1));
    }
    Meteor.call('routines.insert', name, purpose, duration, this.state.exercises);
  }

  addDay() {

    const breakfast = ReactDOM.findDOMNode(this.refs.breakfast).value.trim();
    const brunch = ReactDOM.findDOMNode(this.refs.brunch).value.trim();
    const elevenses = ReactDOM.findDOMNode(this.refs.elevenses).value.trim();
    const lunch = ReactDOM.findDOMNode(this.refs.lunch).value.trim();
    const supper = ReactDOM.findDOMNode(this.refs.supper).value.trim();
    const dinner = ReactDOM.findDOMNode(this.refs.dinner).value.trim();
    const calories = ReactDOM.findDOMNode(this.refs.calories).value.trim();
    const day = ReactDOM.findDOMNode(this.refs.day).value.trim();
     
    if ( breakfast !== '' && brunch !== '' && elevenses !== '' && lunch !== '' &&
    supper !== '' && dinner !== '' && calories !== ''  && day !== '' ) {
      const newDay = {
        breakfast,
        brunch,
        elevenses,
        lunch,
        supper,
        dinner,
        calories,
        day,
      };
      const updateDays = this.state.days;
      updateDays.push(newDay);
      this.setState({
        days: updateDays,
        formError: '',
      });
    } else {
      if (breakfast === '' ) {
        this.setState({
          formError: 'Describe your breakfast!',
        });
      }
      else if (brunch === '') {
        this.setState({
          formError: 'Describe your brunch!',
        });
      }
      else if (elevenses === '') {
        this.setState({
          formError: 'Describe your elevenses!',
        });
      }
      else if (lunch === '') {
        this.setState({
          formError: 'Describe your lunch!',
        });
      }
      else if (dinner === '') {
        this.setState({
          formError: 'Describe your dinner!',
        });
      }
      else if (calories === '') {
        this.setState({
          formError: 'Describe your calories!',
        });
      }
      else if (day === '') {
        this.setState({
          formError: 'Name your day!',
        });
      }
    }

  }

  deleteDay(key) {
    const updateDays = this.state.days;
    updateDays.splice(key, 1);
    this.setState({
      days: updateDays,
      formError: '',
    });
  }

  addComment() {
    const comment = ReactDOM.findDOMNode(this.refs.comment).value.trim();
    Meteor.call('routines.addComment', this.state.routine._id, comment);
  }
  getRandomImg() {
    const rand = Math.floor(Math.random() * 5);
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

    const modal = document.getElementById('myModal');

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
    const modal = document.getElementById('myModal');
    modal.style.display = "none";
  }
  addExercise() {
    const name = ReactDOM.findDOMNode(this.refs.exercise).value.trim();
    const series = ReactDOM.findDOMNode(this.refs.series).value.trim();
    const repetitions = ReactDOM.findDOMNode(this.refs.repetitions).value.trim();
    const restTime = ReactDOM.findDOMNode(this.refs.restTime).value.trim();
    const duration = ReactDOM.findDOMNode(this.refs.duration).value.trim();
    if (name !== '' && (series !== '' && series > 0) && (repetitions !== '' && repetitions >0) && (restTime !== ''&& restTime >0)) {
      const newExercise = {
        name,
        duration,
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
      if (name === '' ) {
        this.setState({
          formError: 'Name your exercise!',
        });
      }
      else if (duration === '') {
        this.setState({
          formError: 'Your exercise needs duration time!',
        });
      }
      else if (duration < 1) {
        this.setState({
          formError: 'Duration of exercises must be 1 or more!',
        });
      }
      else if (series === '') {
        this.setState({
          formError: 'Your exercise needs a number of series!',
        });
      }
      else if (series < 1) {
        this.setState({
          formError: 'Number of series must be 1 or more!',
        });
      }
      else if (repetitions === '') {
        this.setState({
          formError: 'Your exercise needs a number of repetitions!',
        });
      }
      else if (repetitions < 1) {
        this.setState({
          formError: 'Number of repetitions must be 1 or more!',
        });
      }
      else if (restTime === '') {
        this.setState({
          formError: 'Your exercise needs a rest time!',
        });
      }
      else if (restTime < 1) {
        this.setState({
          formError: 'Rest time must be 1 or more!',
        });
      }
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

    const modal = document.getElementById('myModalUser');

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
    for (i = 0; i < actual.following.length; i++) {
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

    for ( i = 0; i < actual.following.length; i++) {
      if (actual.following[i].userId == idUsuario)
        return true;
    }
    return false;


  }

  closeModalUser() {
    const modal = document.getElementById('myModalUser');
    modal.style.display = "none";
  }
  
  renderRoutinesUser(idUser) {
    if (Meteor.user()) {

      return this.props.routines.filter(function (elem) {
        return elem.userID == idUser;
      }).map((exer) => {
        //Esta renderización podra renderizar botones externos
        return (<button key={exer._id} aria-label="See this routine" className="routineButton" onClick={() => this.showRoutine2(exer)}>{exer.name}</button>);
      });

    }
  }
  renderFollowers() {
   
    if (this.props.user) {
      const li = this.props.user.following;
      return this.props.exercisers.filter(function (elem) {
        for (i = 0; i < li.length; i++) {
          if (li[i].userId == elem._id) {
            return elem;
          }
        }
      }).map((exer) => {
        //Esta renderización podra renderizar botones externos
        return (<div key={exer._id} >   <button aria-label="See this person that you're following" onClick={() => this.showUser(exer.userId)}>{exer.username}</button>  </div>);
      });

    }
  }


  renderRoutines() {
    const currentSearch = this.state.search.toUpperCase();
    if(currentSearch === '') {
      return this.props.routines.map((routine) => {
        
              return (<div className="routine" key={routine._id}>
                <img src={this.getRandomImg()} className="routineIcon" alt="Routine Icon"/> <br />
                <h3>{routine.name}</h3> <br /> <b>Duration:</b>{routine.duration}s <br /><button aria-label="See this user" className="openUser" onClick={() => this.showUser(routine.userID)}><h4>{routine.username}</h4></button>
                <button aria-label="See this routine" className="openRoutine" onClick={() => this.showRoutine(routine)}>SEE ROUTINE</button>
              </div>);
            });
    }
    else {
      return this.props.routines.filter(function(routineFilter){return routineFilter.name.toUpperCase().includes(currentSearch);}).map((routine) => {
        
              return (<div className="routine" key={routine._id}>
                <img src={this.getRandomImg()} className="routineIcon" alt="Routine Icon"/> <br />
                <h3>{routine.name}</h3> <br /> <b>Duration:</b>{routine.duration}s <br /><button aria-label="See this user" className="openUser" onClick={() => this.showUser(routine.userID)}><h4>{routine.username}</h4></button>
                <button aria-label="See this routine" className="openRoutine" onClick={() => this.showRoutine(routine)}>SEE ROUTINE</button>
              </div>);
            });
    }
  }
  renderDiets() {
    return this.props.diets.map((diet) => {

      return (<div className="routine" key={diet._id}>
       <br />
        <h3>{diet.name}</h3> <br /> <b>Calories(s):</b>{diet.calories} <button className="openUser" onClick={() => this.showUser(diet.userID)}><h4>{diet.username}</h4></button>
        <button className="openRoutine" onClick={() => this.showRoutine(diet)}>SEE ROUTINE</button>
      </div>);
    });
  }

  renderNewRoutine() {
    if (this.state.exercises.length > 0) {
      return this.state.exercises.map((exercise, key) => {
        return (<div className="exercise">
          <b>Name:</b> {exercise.name}  &nbsp;
          <b>Duration:</b> {exercise.duration} s  &nbsp;
          <b>Series:</b>{exercise.series} &nbsp;
          <b>Repetitions:</b> {exercise.repetitions}  &nbsp;
          <b>Rest Time:</b> {exercise.restTime} s
          <button aria-label="Delete exercise from routine" type="button" onClick={() => this.deleteExercise(key)}>DELETE</button>
        </div>)
      });
    }
    return (<div> <br /> Add some exercises to your routine! </div>);
  }

  renderNewDiet() {

    if (this.state.days.length > 0) {
      return this.state.days.map((tem, key) => {
        return (<div className="exercise">
          <b>Day:</b> {tem.day}  &nbsp;
          <b>Calories(cal):</b> {tem.calories}  &nbsp;
          <button type="button" onClick={() => this.deleteDay(key)}>DELETE</button>
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
  renderCurrentExercises() {
    return this.state.routine.exercises.map((exercise, key) => {
      return (<div className="exercise">
        <b>Name:</b> {exercise.name}  &nbsp;
        <b>Duration:</b> {exercise.duration}s  &nbsp;
        <b>Series:</b>{exercise.series} &nbsp;
        <b>Repetitions:</b> {exercise.repetitions}  &nbsp;
        <b>Rest Time:</b> {exercise.restTime} s
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
        //El search bar se podría extraer en un componente aparte
        <div id="searchBar"><form className="search" onSubmit={this.handleSubmit.bind(this)}  >
                  <label for="search"> Search: < input name="search" placeholder="Search by routine name"
                    aria-label="Search by routine name" type = "text" value = { this.state.search} onChange = {this.searchChange} /> </label>
                </form> </div>
        <header>
        
          <AccountsUIWrapper />
          <h1>GYM<br />BUDDIES <img src="./weightlifting.svg" className="weights" alt="Wight Lifting Image" /></h1>
        <h2>Share your routines and get comments,<br /> reactions and followers from other exercise lovers</h2>
        </header>
        {!this.props.user && this.props.currentUser ?
            <div className="cmpReg"><h2>Complete your registry!</h2> <form name="register" onSubmit={this.handleSubmit2.bind(this)} >

              <label for="name">Name: </label><input name="name" type="text" ref="papapapap" aria-label="Your name" required />
              <br />
              <label for="age">Age:<input name="age" type="number" ref="age" min="0" aria-label="Your age" required /></label>
              <br />
              <label for="weight">Weight (Kgs):<input name="weight" type="number" min="0" ref="weight" aria-label="Your weight" required /></label>
              <br />
              <label for="height">Height (cms): <input name="height" type="number" min="0" ref="heightxxx" aria-label="Your height" required /> </label>
              <br />
              <label for="email">E-mail: <input name="email" type="email" ref="ccccccc" aria-label="Your e-mail" required /></label>
              <br />
              <div onChange={this.setInteresting.bind(this)}>
                <input type="radio" value="Gain Mass" name="a" required aria-label="Your purpose: Gain mass" /> Gain Mass
                  <input type="radio" value="Loss weight" name="a" aria-label="Your purpose: Loss weight"  /> Loss weight
                  <input type="radio" value="Hobby" name="a" aria-label="Your purpose: Hobby"  /> Hobby
             </div>
              <button className="textBlack" type="submit" aria-label="Save profile" >SAVE</button>
            </form></div> : ''
          }
        {this.props.currentUser && this.props.user ?
            <button className="addRoutine" aria-label="Add a new routine"  onClick={this.toggleShowForm.bind(this)}>ADD ROUTINE</button> : ''
          }
          {this.props.currentUser && this.props.user ?
            <button className="addDiet" onClick={this.toggleShowForm2.bind(this)}>ADD DIET</button> : ''
          }
        <div id="myModal" className="modal">
          {this.state.routine ?
            <div className="modal-content">
              <div className="modal-header">
              <span className="close" onClick={this.closeModal.bind(this)}>&times;</span>
              <h2>Routine Name:</h2> <h1>{this.state.routine.name}</h1> <br />
              <h2>by:</h2> <h1>{this.state.routine.username}</h1> <br />
              <h2>Total Duration: </h2> <h1>{this.state.routine.duration} s</h1> <br />
              <h2>Purpose:</h2> <h1>{this.state.routine.purpose}</h1> <br />
              { this.props.currentUser && this.props.user ? <span> <button aria-label="Add weight lifting reaction to this routine"  onClick={()=>this.addReaction('rat')}><img src="./dumbbell.svg" className="icontReact" alt="Add reaction: 'Strong routine!'" />{this.state.routine.reactions.rat}</button>
              <button aria-label="Add tiger reaction to this routine"  onClick={()=>this.addReaction('tiger')}><img src="./tiger.svg" className="icontReact" alt="Add reaction: 'Good one tiger!'" />{this.state.routine.reactions.tiger}</button>
              <button aria-label="Add broken heart reaction to this routine"  onClick={()=>this.addReaction('poop')}><img src="./broken-heart.svg" className="icontReact" alt="Add reaction: 'This routine breaks my heart!'"/>{this.state.routine.reactions.poop}</button>
              <button aria-label="Add poop reaction to this routine"  onClick={()=>this.addReaction('toy')}><img src="./baby-poop.svg" className="icontReact" alt="Add reaction: 'This routine is poop!'" />{this.state.routine.reactions.toy}</button></span> : 
              <span> <button aria-label="Add weight lifting reaction to this routine"  onClick={()=>this.addReaction('rat')} disabled><img src="./dumbbell.svg" className="icontReact" alt="Add reaction: 'Strong routine!'" />{this.state.routine.reactions.rat}</button>
              <button aria-label="Add tiger reaction to this routine"  onClick={()=>this.addReaction('tiger')} disabled><img src="./tiger.svg" className="icontReact" alt="Add reaction: 'Good one tiger!'" />{this.state.routine.reactions.tiger}</button>
              <button aria-label="Add broken heart reaction to this routine"  onClick={()=>this.addReaction('poop')} disabled><img src="./broken-heart.svg" className="icontReact" alt="Add reaction: 'This routine breaks my heart!'" />{this.state.routine.reactions.poop}</button>
              <button aria-label="Add poop reaction to this routine"  onClick={()=>this.addReaction('toy')} disabled><img src="./baby-poop.svg" className="icontReact" alt="Add reaction: 'This routine is poop!'"  />{this.state.routine.reactions.toy}</button></span>  }
              

              {this.renderCurrentExercises()}
              </div>
              {this.props.currentUser && this.props.user ?
                <form className="new-comment" onSubmit={this.handleSubmit.bind(this)}  >
                 <label for="comment" className="hidden">Comment:</label> <input
                    type="text"
                    ref="comment"
                    name="comment"
                    placeholder="Type to add a new comment"
                    aria-label="New comment input"
                  /><button aria-label="Send new comment">SEND</button>
                </form> : ''}
                {this.renderComments()}
            </div>
            : ''}
        </div>
        <div id="myModalUser" className="modal">
          {this.state.selectedUser ?
            <div className="modal-content">
               <div className="modal-header black">
              <span className="close" onClick={this.closeModalUser.bind(this)}>&times;</span>
              <h2>Name: </h2><h1>{this.state.selectedUser.name}</h1> <br />
              <h2>Age:</h2><h1> {this.state.selectedUser.age} years</h1><br />
              <h2>E-mail:</h2><h1>{this.state.selectedUser.email}</h1><br />
              <h2>Weight:</h2><h1> {this.state.selectedUser.weight} Kgs</h1><br />
              <h2>Height:</h2><h1> {this.state.selectedUser.height} cms</h1><br />
              <h2>Interesting In:</h2><h1> {this.state.selectedUser.interestingIn}</h1><br />
              {this.props.user && this.props.currentUser && !this.imFollowing(this.state.selectedUser._id) ?
                <button aria-label="Follow this user"  onClick={() => this.follow(this.state.selectedUser)}>Follow</button>
                : ''
              }             {this.props.user && this.props.currentUser && this.imFollowing(this.state.selectedUser._id) ?
                <button aria-label="Unfollow this user"  onClick={() => this.unfollow(this.state.selectedUser)}>Unfollow</button>
                : ''
              }
              </div>
                <h1>Routines</h1>
                {this.renderRoutinesUser(this.state.selectedUser.userId)}
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
              aria-label="Name of your routine"
              placeholder="The name of your routine"
            /> <br />
            <label for="purpose">Purpose</label><input
              required
              name="purpose"
              type="text"
              ref="purpose"
              aria-label="Purpose of your routine"
              placeholder="The purpose of your routine"
            /> <br />
            <div className="exercises">
              <h4>Routine Exercises</h4>
            <label for="exercise">Name</label><input
              required
              name="exercise"
              type="text"
              ref="exercise"
              aria-label="Name of your exercise"
              placeholder="Name of the exercise"
            /> <br/>
            <label for="duration">Duration (sec)</label>
            <input
              name="duration"
              type="number"
              min="1"
              ref="duration"
              aria-label="Duration of your exercise"
              placeholder="Duration of each exercise"
            /> <br />
            <label for="series">Series</label>
            <input
              name="series"
              type="number"
              min="1"
              ref="series"
              aria-label="Number of series of your exercise"
              placeholder="Number of series"
            /> <br />
            <label for="repetitions">Repetitions</label>
            <input
              name="repetitions"
              type="number"
              min="1"
              ref="repetitions"
              aria-label="Number of repetitions of your exercise"
              placeholder="Number of repetitions"
            /> <br />
            <label for="restTime">Rest Time (s)</label>
            <input
              aria-label="Rest time of your exercise"
              name="restTime"
              type="number"
              min="1"
              ref="restTime"
              placeholder="Rest time between series"
            /> <br />
            <button
              aria-label="Add an exercise to your routine"
              type="button"
              onClick={this.addExercise.bind(this)}>
              ADD EXERCISE
          </button>
            {this.renderNewRoutine()}
            </div>
            {this.state.exercises.length ? <button aria-label="Add a new routine" >ADD ROUTINE</button> : ''}
          </form>
        </div> : ''}

        {this.state.showDietForm && this.props.currentUser ? <div className="newRoutine">
          <h3>Create a new diet</h3>
          <span className="error">{this.state.formError}</span>
          <form onSubmit={this.addDiet.bind(this)}>
            <label for="name2">Name</label><input
              required
              name="name"
              type="text"
              ref="name"
              placeholder="The name of your diet"
            /> <br />
            <label for="purpose2">Purpose</label><input
              required
              name="purpose"
              type="text"
              ref="purpose"
              placeholder="The purpose of your diet"
            /> <br />
            <div className="exercises">
              <h4>Day</h4>
              <label for="day">Day</label><input
              required
              name="day"
              type="text"
              ref="day"
              placeholder="Diet day "
            /> <br/> 
            <label for="breakfast">Breakfast</label><input
              required
              name="breakfast"
              type="text"
              ref="breakfast"
              placeholder="Breakfast description"
            /> <br/> 
            <label for="brunch">Brunch</label><input
              required
              name="brunch"
              type="text"
              ref="brunch"
              placeholder="Brunch description"
            /> <br/><label for="elevenses">Elevenses</label><input
              required
              name="elevenses"
              type="text"
              ref="elevenses"
              placeholder="Elevenses description"
            /> <br/> 
            <label for="lunch">Lunch</label><input
              required
              name="lunch"
              type="text"
              ref="lunch"
              placeholder="Lunch description"
            /> <br/><label for="supper">Supper</label><input
              required
              name="supper"
              type="text"
              ref="supper"
              placeholder="Supper description"
            /> <br/> 
            <label for="dinner">Dinner</label><input
              required
              name="dinner"
              type="text"
              ref="dinner"
              placeholder="Dinner description"
            /> <br/> 
            <label for="calories">Calories (c)</label>
            <input
              name="calories"
              type="number"
              min="300"
              ref="calories"
              placeholder="Diet calories"
            /> <br />
            <button
              type="button"
              onClick={this.addDay.bind(this)}>
              ADD DAY
          </button>
            {this.renderNewDiet()}
            </div>
            {this.state.days.length ? <button>ADD DIET</button> : ''}
          </form>
        </div> : ''}

        { this.props.currentUser && this.props.user ? <span> <br /> My follows: <ul>  
          {this.renderFollowers()}
        </ul></span> :''}
        <div className="routines">
          {this.renderRoutines()}
        
      </div>
    
      <div className="routines">
          {this.renderDiets()}
        
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
          Meteor.subscribe('diets');
  if (Meteor.user()) {
    return {
      user: Exercisers.findOne({userId: Meteor.user()._id }),
      routines: Routines.find({}, {sort: {createdAt: -1 } }).fetch(),
      diets: Diets.find({}, {sort: {createdAt: -1 } }).fetch(),
      currentUser: Meteor.user(),
      exercisers: Exercisers.find({}).fetch(),
    }
  } else {
    return {

      routines: Routines.find({}, {sort: {createdAt: -1 } }).fetch(),
      diets: Diets.find({}, {sort: {createdAt: -1 } }).fetch(),
      currentUser: Meteor.user(),

    }
  }

}, App);
