import {
    Meteor
} from 'meteor/meteor';
import {
    Mongo
} from 'meteor/mongo';
import {
    check
} from 'meteor/check';

export const Exercisers = new Mongo.Collection('exercisers');

if (Meteor.isServer) {
    Meteor.publish('exercisers', function tasksPublication() {
        return Exercisers.find({});
    });
}

Meteor.methods({
    'exercisers.insert' (exerciser) {
        check(exerciser, Object);

        if (!this.userId) {
            throw new Meteor.Error('not-authorized');
        }
        Exercisers.insert({
            username: Meteor.users.findOne(this.userId).username,
            userId: exerciser.userId,
            email: exerciser.email,
            name: exerciser.name,
            age: exerciser.age,
            weight: exerciser.weight,
            height: exerciser.height,
            interestingIn: exerciser.interestingIn,
            routines: [],
            following: []
        });
    },
    'exercisers.searchByUserName' (id) {

        console.log(id);
        if (!id) {
            //Luis Plazas: buen uso
            throw new Meteor.Error('not-authorized');
        }

        return Exercisers.findOne({
            userId: 'sdfsfdf'
        });

    },
});
