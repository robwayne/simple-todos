import { Meteor } from 'meteor/meteor';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Template } from 'meteor/templating';

import { Tasks } from '../api/tasks.js';


import './body.html';
import './task.js';

Template.body.helpers({
  tasks(){
    const instance = Template.instance();
    if(instance.state.get('hideCompleted')){
      //if hide completed button is checked then filter tasks
      return Tasks.find({checked: {$ne:true}}, {sort: {createdAt:-1}});
    }
    return Tasks.find({}, {sort: {createdAt:-1}});
  },
  incompleteCount(){
    return Tasks.find({checked: {$ne: true}}).count();
  }
});

Template.body.events({
  'submit .new-task'(event){
    event.preventDefault();

    const target = event.target;
    const text = target.text.value;

    Meteor.call('tasks.insert', text);
    target.text.value = '';
  },
  'change .hide-completed input'(event, instance){
    instance.state.set('hideCompleted', event.target.checked);
  }
});

Template.body.onCreated(function bodyOnCreated(){
  this.state = new ReactiveDict();
});
