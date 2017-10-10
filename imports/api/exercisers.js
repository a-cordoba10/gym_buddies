/* srojas19: indentancion extraña en imports */
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Exercisers = new Mongo.Collection('exercisers');

if (Meteor.isServer) {
    Meteor.publish('exercisers', function tasksPublication() {
        return Exercisers.find({});
    });
}

Meteor.methods({
    'exercisers.insert' (exerciser) {
        check(exerciser, Object);

        // srojas19: sería bueno hacer uso de Meteor.user() para verificar que el usuario esta autenticado
        if (! Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }
        Exercisers.insert({
            // srojas19: Usar Meteor.user().username y Meteor.userId(), pues es mas seguro
            username: Meteor.user().username,
            userId: Meteor.userId(),
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
        // srojas19: console.log innecesario
        // srojas19: sería bueno hacer uso de Meteor.user() para verificar que el usuario esta autenticado
        if (! Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }
        // srojas19: mal implementado (?)
        return Exercisers.findOne({
            userId: 'sdfsfdf'
        });

    },
});
