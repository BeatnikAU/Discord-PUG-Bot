/*
  This file defines the commands that can be used in Discord to use the bot

  Author: Jarred "Beatnik" Hauschild
*/

// import the discord.js module
const Discord = require('discord.js');

// create an instance of a Discord Client, and call it bot
const bot = new Discord.Client();

// import config.js for credentials
var config = require('./config.js');

// import other files
var functions = require('./functions.js');
var divA = require('./divA.js');
var messages = require('./messages.js');

// the token of your bot - https://discordapp.com/developers/applications/me
const token = config.token;

// the ready event is vital, it means that your bot will only start reacting to information
// from Discord _after_ ready is emitted.
bot.on('ready', () => {
  console.log('I am ready!');
});

// create an event listener for messages
bot.on('message', message => {

// set the team size from 1-4 players
  if (/!teamsize [1-4]/i.test(message.content) == true) {
    if (message.content.length == 11) {
      functions.teamSize = message.content.charAt(10);
      console.log("team size changed to " + functions.teamSize);
      functions.matchSize = 2 * functions.teamSize;
      message.channel.sendMessage("team size now " + functions.teamSize);
    }
  }

// set the time to setup in minutes
  if (/!jointime [1-9]/i.test(message.content) == true) {
    if (message.content.length == 11) {
      functions.setupTime = 60000 * message.content.charAt(10);
      console.log("time to join is now " + (functions.setupTime / 60000) + " mins");
      message.channel.sendMessage("time to join is now " + (functions.setupTime / 60000) + " mins");
    }
  }

  // start PUG command
  if (message.content === '!start') {
    message.channel.sendMessage(functions.checkRun('A', message.author, message.channel.id));
  }

  // join PUG command
  if (message.content === '!join') {
    message.channel.sendMessage(functions.checkJoin('A', message.author));
  }

  // test command to see current variables
  if (message.content === 'testing') {
    functions.checkVariables();
  }

});


// these are for all functions and variables that are accessable from other files
var commands = {

  setupTimeout : function(div) {
    if (divA.hasStarted === true && divA.ready === false) {
      divA.clearVars();
      console.log("PUG cancelled, not enough players")
      bot.channels.get(divA.channel, 'channel').sendMessage("Not enough have signed up for the div A PUG. To start a new PUG, type !start-A into the channel");
    };
  },

  startMatch : function(div, author) {
    for (var i = 1; i < divA.joined.length; i++) {
      var l1 = divA.team1.length;
      var l2 = divA.team2.length;
      if (divA.team2.length == (functions.matchSize / 2)) {
        divA.team1[l1] = divA.joined[i];
      }
      else if (divA.team1.length == (functions.matchSize / 2)) {
        divA.team2[l2] = divA.joined[i];
      }
      else if (Math.random() < 0.5) {
        divA.team1[l1] = divA.joined[i];
      }
      else {
        divA.team2[l2] = divA.joined[i];
      }
    };

    bot.channels.get(divA.channel, 'channel').sendMessage(messages.joined(div, author));
    bot.channels.get(divA.channel, 'channel').sendMessage('PUG is ready! The teams are');
    bot.channels.get(divA.channel, 'channel').sendMessage('Blue: ' + divA.team1);
    bot.channels.get(divA.channel, 'channel').sendMessage('Orange: ' + divA.team2);
    setTimeout(function() {functions.end('A'); }, functions.roundTime);

    // clears variables ready for the next PUG
    divA.clearVars();
  }

};

// this method of exporting is to work around circular dependencies
for(var key in commands) {
  module.exports[key] = commands[key];
}

// log our bot in
bot.login(token);
