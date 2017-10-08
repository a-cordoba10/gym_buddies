import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Routines = new Mongo.Collection('routines');

if (Meteor.isServer) {
  Meteor.publish('routines', function tasksPublication() {
    return Routines.find({ });
  });
}

Meteor.methods({
  'routines.insert'(purpose, exercises) {
    check(purpose, String);

    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    Routines.insert({
      userID: this.userId,
      username: Meteor.users.findOne(this.userId).username,
      createdAt: new Date(),
      purpose, 
      comments: [],
      reactions: [], 
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

    Tasks.update(routineId, { $addToSet: { comments: comment }});
  },
  'tasks.addReaction'(routineId, reaction) {
    check(routineId, String);
    check(reaction, String);

    const routine = Routines.findOne(routineId);

    if (! Meteor.userId()) {
        throw new Meteor.Error('User not log in');
    }

    Tasks.update(routineId, { $addToSet: { reactions: reaction }});
  },
});
