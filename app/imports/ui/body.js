import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import './body.html';
import './task.js';

import { Tasks } from '../api/tasks.js';

Template.body.onCreated(function bodyOnCreated () {
  const self = this;
  this.state = new ReactiveDict();
  Meteor.subscribe('tasks');
});

Template.body.helpers({
  tasks () {
    const instance = Template.instance();
    if (instance.state.get('hideCompleted')) {
      // If hide completed is checked, filter tasks
      return Tasks.find({checked: {$ne: true}}, {sort: {createdAt: -1}});
    }
    // Otherwise, return all of the tasks
    return Tasks.find({}, {sort: {createdAt: -1}});
  },

  incompleteCount () {
    return Tasks.find({checked: {$ne: true}}).count();
  },
});

Template.body.events({
  'submit .new-task' (event) {
    // Prevent default browser form submit
    event.preventDefault();

    // Get value from form element
    const target = event.target;
    const text = target.text.value;

    Meteor.call('tasks.insert', text);

    // Insert a task into the collection
    Tasks.insert({
      text,
      createdAt: new Date(), // current time
      owner: Meteor.userId(),
      username: Meteor.user().username,
    });

    // Clear form
    target.text.value = '';
  },

  'change .hide-completed input' (event, instance) {
    instance.state.set('hideCompleted', event.target.checked);
  },

});