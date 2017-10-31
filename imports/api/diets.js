import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Diets = new Mongo.Collection('diets');

if (Meteor.isServer) {
  Meteor.publish('diets', function dietPublication() {
    return Diets.find({});
  });
}

Meteor.methods({
  'diets.insert'(name, purpose, calories, days) {
    check(purpose, String);

    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    Diets.insert({
      name,
      userID: this.userId,
      username: Meteor.users.findOne(this.userId).username,
      createdAt: new Date(),
      purpose,
      calories,
      comments: [],
      userReactions: [],
      reactions: {
        toy: 0, //Severo muñeco
        tiger: 0, //Fuerza tigre
        rat: 0, //Buena la rata
        poop: 0, //Mucho popo
      },
      days,
    });
  },
  'diets.remove'(dietID) {
    check(dietID, String);

    const diet = Diets.findOne(dietID);
    if (diet.userID !== this.userId) {
      throw new Meteor.Error('User can not delete this diet');
    }
    Diets.remove(dietID);
  },
  'diets.addComment'(dietId, comment) {
    check(dietId, String);
    check(comment, String);

    const diet = Diets.findOne(dietId);

    if (!Meteor.userId()) {
      throw new Meteor.Error('User not log in');
    }
    const newComment = {
      username: Meteor.users.findOne(this.userId).username,
      createdAt: new Date(),
      comment,
    }
    Diets.update(dietId, { $addToSet: { comments: newComment } });
  },
  'diets.addReaction'(dietId, reaction) {
    check(dietId, String);
    check(reaction, String);

    if (!Meteor.userId()) {
      throw new Meteor.Error('User not log in');
    }
    const diet = Diets.findOne(dietId);
    for (i = 0; i < diet.userReactions.length; i++) {
      if (diet.userReactions[i].id == Meteor.userId()) {
        const userReaction = diet.userReactions[i].reaction;
        if(userReaction == reaction) {
          throw new Meteor.Error('Reaction repeated');
        }
        if (userReaction === 'toy') {
          Diets.update(dietId, {
            $set: {
              'reactions.toy': diet.reactions.toy - 1,
            }
          });
        }
        if (userReaction === 'tiger') {
          Diets.update(dietId, {
            $set: {
              'reactions.tiger': diet.reactions.tiger - 1,
            }
          });
        }
        if (userReaction === 'rat') {
          Diets.update(dietId, {
            $set: {
              'reactions.rat': diet.reactions.rat - 1,
            }
          });
        }
        if (userReaction === 'poop') {
          Diets.update(dietId, {
            $set: {
              'reactions.poop': diet.reactions.poop - 1,
            }
          });
        }
        Diets.update(dietId, { $pull: { userReactions: { 'id': diet.userReactions[i].id } } }); 
        break;
      }
    }
    const newReaction = {
      'id' : Meteor.userId(),
      reaction
    }
    Diets.update(dietId, { $addToSet: { userReactions: newReaction } }); 
    if (reaction === 'toy') {
      Diets.update(dietId, {
        $set: {
          'reactions.toy': diet.reactions.toy + 1,
        }
      });
    }
    if (reaction === 'tiger') {
      Diets.update(dietId, {
        $set: {
          'reactions.tiger': diet.reactions.tiger + 1,
        }
      });
    }
    if (reaction === 'rat') {
      Diets.update(dietId, {
        $set: {
          'reactions.rat': diet.reactions.rat + 1,
        }
      });
    }
    if (reaction === 'poop') {
      Diets.update(dietId, {
        $set: {
          'reactions.poop': diet.reactions.poop + 1,
        }
      });
    }
  },
});
