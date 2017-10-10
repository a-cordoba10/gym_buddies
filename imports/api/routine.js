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

    // srojas19: sería bueno hacer uso de Meteor.user() para verificar que el usuario esta autenticado
    if (! Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    Routines.insert({
      name,
      // srojas19: usar Meteor.userId()
      userID: Meteor.userId(),
      // srojas19: usar Meteor.user()
      username: Meteor.user().username,
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

    // srojas19: sería bueno hacer uso de Meteor.user() para verificar que el usuario esta autenticado
    if (! Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
    // srojas19: cambio por Meteor.userId()
    const routine = Routine.findOne(routineId);
    if (routine.userID !== Meteor.userId()) {
      throw new Meteor.Error('User can not delete this routine');
    }
    Routines.remove(routineId);
  },
  'routines.addComment'(routineId, comment) {
    check(routineId, String);
    check(comment, String);

    const routine = Routines.findOne(routineId);

    if (! Meteor.userId()) {
        throw new Meteor.Error('User not logged in');
    }
    const newComment = {
      // srojas19: cambio por Meteor.user()
      username: Meteor.user().username,
      createdAt: new Date(),
      comment
    }
    Routines.update(routineId, { $addToSet: { comments: newComment }});
  },
  'routines.addReaction'(routineId, reaction) {
    check(routineId, String);
    check(reaction, String);

    const routine = Routines.findOne(routineId);

    if (! Meteor.userId()) {
        throw new Meteor.Error('User not logged in');
    }
    if(reaction === 'toy') {
      Routines.update(routineId, { $set: {
        'reactions.toy': routine.reactions.toy+1,
        } 
      });
    }
    if(reaction === 'tiger') {
      Routines.update(routineId, { $set: {
        'reactions.tiger': routine.reactions.tiger+1,
        } 
      });
    }
    if(reaction === 'rat') {
      Routines.update(routineId, { $set: {
        'reactions.rat': routine.reactions.rat+1,
        } 
      });
    }
    if(reaction === 'poop') {
      Routines.update(routineId, { $set: {
        'reactions.poop': routine.reactions.poop+1,
        } 
      });
    }
  },
});
