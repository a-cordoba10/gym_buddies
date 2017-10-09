import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Routines = new Mongo.Collection('routines');

if (Meteor.isServer) {
  Meteor.publish('routines', function routinePublication() {
    return Routines.find({ });
  });
}

Meteor.methods({
  'routines.insert'(name, purpose, exercises) {
    check(purpose, String);

    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    Routines.insert({
      name,
      userID: this.userId,
      username: Meteor.users.findOne(this.userId).username,
      createdAt: new Date(),
      purpose, 
      comments: [],
      reactions: {
        toy: 0, //Severo muñeco
        tiger: 0, //Fuerza tigre
        rat: 0, //Buena la rata
        poop: 0, //Mucho popo
      }, 
      exercises,
    });
  },
  'routines.remove'(routineId) {
    check(routineId, String);

    const routine = Routine.findOne(routineId);
    if (routine.userID !== this.userId) {
      throw new Meteor.Error('User can not delete this routine');
    }
    Routines.remove(routineId);
  },
  'routines.addComment'(routineId, comment) {
    check(routineId, String);
    check(comment, String);

    const routine = Routines.findOne(routineId);

    if (! Meteor.userId()) {
        throw new Meteor.Error('User not log in');
    }
    const newComment = {
      username: Meteor.users.findOne(this.userId).username,
      createdAt: new Date(),
      comment,
    }
    Routines.update(routineId, { $addToSet: { comments: newComment }});
  },
  'routines.addReaction'(routineId, reaction) {
    check(routineId, String);
    check(reaction, String);

    const routine = Routines.findOne(routineId);

    if (! Meteor.userId()) {
        throw new Meteor.Error('User not log in');
    }

    Routines.update(routineId, { $addToSet: { reactions: reaction }});
  },
  'routines.getRoutine'(routineId) {
    check(routineId, String);
    return Routines.findOne(routineId);
  },
});
