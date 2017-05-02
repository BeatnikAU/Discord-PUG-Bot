var divA = {};

var functions = require('./functions.js');

divA.hasStarted = false;
divA.startedBy;
divA.channel;
divA.joined = [];
divA.team1 = [];
divA.team2 = [];
divA.ready = false;

divA.checkReady = function() {
  if (divA.joined.length === functions.matchSize) {
    divA.ready = true;
    divA.startGame();
  }
  else {
    return divA.ready;
  }
};

module.exports = divA;
