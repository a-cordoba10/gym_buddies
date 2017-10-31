//srojas19: En general, se verifica que el usuario tenga permiso para agregar y modificar en los metodos pertinentes
// y se verifica que el usuario este autenticado cuando sea necesario.

import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Routines = new Mongo.Collection('routines');

if (Meteor.isServer) {
  Meteor.publish('routines', function routinePublication() {
    return Routines.find({});
  });
}

Meteor.methods({
  'routines.insert'(name, purpose, duration, exercises) {
    check(purpose, String);

    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    Routines.insert({
      name,
      userID: this.userId,
      username: Meteor.users.findOne(this.userId).username,
      createdAt: new Date(),
      purpose,
      duration,
      comments: [],
      userReactions: [],
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

    if (!Meteor.userId()) {
      throw new Meteor.Error('User not log in');
    }
    const newComment = {
      username: Meteor.users.findOne(this.userId).username,
      createdAt: new Date(),
      comment,
    }
    Routines.update(routineId, { $addToSet: { comments: newComment } });
  },
  'routines.addReaction'(routineId, reaction) {
    check(routineId, String);
    check(reaction, String);

    if (!Meteor.userId()) {
      throw new Meteor.Error('User not log in');
    }
    const routine = Routines.findOne(routineId);
    for (i = 0; i < routine.userReactions.length; i++) {
      if (routine.userReactions[i].id == Meteor.userId()) {
        const userReaction = routine.userReactions[i].reaction;
        if(userReaction == reaction) {
          throw new Meteor.Error('Reaction repeated');
        }
        if (userReaction === 'toy') {
          Routines.update(routineId, {
            $set: {
              'reactions.toy': routine.reactions.toy - 1,
            }
          });
        }
        if (userReaction === 'tiger') {
          Routines.update(routineId, {
            $set: {
              'reactions.tiger': routine.reactions.tiger - 1,
            }
          });
        }
        if (userReaction === 'rat') {
          Routines.update(routineId, {
            $set: {
              'reactions.rat': routine.reactions.rat - 1,
            }
          });
        }
        if (userReaction === 'poop') {
          Routines.update(routineId, {
            $set: {
              'reactions.poop': routine.reactions.poop - 1,
            }
          });
        }
        Routines.update(routineId, { $pull: { userReactions: { 'id': routine.userReactions[i].id } } }); 
        break;
      }
    }
    const newReaction = {
      'id' : Meteor.userId(),
      reaction
    }
    Routines.update(routineId, { $addToSet: { userReactions: newReaction } }); 
    if (reaction === 'toy') {
      Routines.update(routineId, {
        $set: {
          'reactions.toy': routine.reactions.toy + 1,
        }
      });
    }
    if (reaction === 'tiger') {
      Routines.update(routineId, {
        $set: {
          'reactions.tiger': routine.reactions.tiger + 1,
        }
      });
    }
    if (reaction === 'rat') {
      Routines.update(routineId, {
        $set: {
          'reactions.rat': routine.reactions.rat + 1,
        }
      });
    }
    if (reaction === 'poop') {
      Routines.update(routineId, {
        $set: {
          'reactions.poop': routine.reactions.poop + 1,
        }
      });
    }
  },
});
