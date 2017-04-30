var messages = {};

var divA = require('./divA.js');
var functions = require('./functions.js');

messages.running = function(div) {
  return 'There is already a PUG running. Please wait for this to finish and try again';
};

messages.initiate = function(div, author) {
  return 'A PUG has been started by ' + author + '. To join, type !join';
};

messages.cancelled = function() {
  return "Not enough have signed up for the PUG. To start a new PUG, type !start into the channel";
};

messages.joined = function(div, author) {
  return author + ' has joined the PUG!';
};

messages.alreadyIn = function(author) {
  return author + ' is already signed up!';
};

messages.alreadyRunning = function(div, author) {
  return 'Sorry ' + author + ', a PUG is already playing. Please try again later'
};

messages.noPug = function(div, author) {
  return 'Sorry ' + author + ', there is currently no PUG running. You can start a PUG with !start';
};

messages.endPug = function(div) {
  return 'The PUG has ended. To start a new PUG, type !start';
};

messages.available = function(div) {
  return "The PUG bot is now available to starte PUG. To start one, type '!start into chat";
};

messages.teamDM = function(colour, method, name, pass) {
  return "The PUG is ready! Please **" + method + "** a private match with the following details and join team **" + colour + "**: \n Name: " + name + "\n Password: " + pass;
};

module.exports = messages
