var functions = {};

const divA = require('./divA.js');
const messages = require('./messages.js');
const commands = require('./commands.js');
var setupTime = (120 * 1000);
var roundTime = (60 * 1000);
var matchSize = 2;
var teamSize;


// checks the supplied array for the supplied element
// returns boolean
functions.inArray = function(arrayToCheck, comparer) {
    for(var i=0; i < arrayToCheck.length; i++) {
        if(arrayToCheck[i] === comparer) return true;
    }
    return false;
}

functions.messageEndPug = function(div) {
  if (div === 'A') {
    divA.hasStarted = false;
    divA.ready = false;
    //message.channel.sendMessage(messages.available(div));
  }
}

// these are the functions to check the PUG state
// the checkRun function also sends the message when a PUG starts
functions.checkRun = function(div, author, channel) {
  if (div === 'A') {
    if (divA.hasStarted === true){
      console.log(author + " tried to start a PUG but there was already one running");
      return messages.running(div);
    }
    else {
      divA.hasStarted = true;
      divA.startedBy = author;
      divA.channel = channel;
      divA.joined[divA.joined.length] = author;
      divA.team2[divA.joined.length] = author;
      console.log('A div '+ div + ' PUG has been started by ' + author);
      setTimeout(function(div) {commands.setupTimeout(div);}, setupTime);
      return messages.initiate('A', author);
      //setTimeout(functions.messageEndPug(div), setupTime);
    }
  }
}

functions.checkJoin = function(div, author) {
  if (div === 'A') {
    if (divA.hasStarted === true && functions.inArray(divA.joined, author) === false && divA.ready === false && divA.joined.length < (matchSize - 1)) {
      divA.joined[divA.joined.length] = author;
      //divA.checkReady();
      console.log(author + " has joined the PUG")
      return messages.joined(div, author);
    }
    else if (divA.hasStarted === true && functions.inArray(divA.joined, author) === false && divA.joined.length === (matchSize - 1)) {
      divA.joined[divA.joined.length] = author;
      //divA.checkReady();
      divA.ready = true;
      console.log(author + " has joined the PUG")
      commands.startMatch(div, author);
    }
    else if (divA.hasStarted === true && functions.inArray(divA.joined, author) === true && divA.ready === false) {
      return messages.alreadyIn(author);
    }
    else if (divA.hasStarted === true && divA.ready === true){
      return messages.alreadyRunning(div, author)
    }
    else {
      return messages.noPug(div, author)
    }
  }
}

functions.end = function(div) {
  if (div === 'A') {
    divA.ready = false;
    divA.hasStarted = false;
    divA.joined = [];
    return messages.endPug(div);
  }
}

// testing functions
functions.checkVariables = function() {
  console.log(divA.startedBy + "-" + divA.hasStarted + "-" + divA.joined + "-" + divA.team1 + "-" + divA.team2 + "-" + divA.ready + "-" + divA.joined.length);
}

module.exports = functions;
