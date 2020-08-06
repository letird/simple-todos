import { Template } from 'meteor/templating';
import moment from "moment";
import { check } from "meteor/check";

Template.registerHelper("formatDate", function (data){
  check(data, Date);
  return moment(data).utc().format('DD/MM/YYYY');
});