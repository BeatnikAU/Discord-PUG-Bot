/*
  This file defines the commands that can be used in Discord to use the bot

  Author: Jarred "Beatnik" Hauschild
*/

// import the discord.js module
const Discord = require('discord.js');

// create an instance of a Discord Client, and call it bot
const bot = new Discord.Client();

// import config.json for credentials
var CONFIG = require('./config.json');

// import other files
var functions = require('./functions.js');
var divA = require('./divA.js');
var messages = require('./messages.js');

// the token of your bot - https://discordapp.com/developers/applications/me
const token = CONFIG.token;

// the ready event is vital, it means that your bot will only start reacting to information
// from Discord _after_ ready is emitted.
bot.on('ready', () => {
  console.log('I am ready! \n');
  functions.setupTime = 180000;
  functions.matchSize = 6;
  functions.teamSize = 3;
  //bot.user.setUsername("PUG Bot");
});

// create an event listener for messages
bot.on('message', message => {

// set the team size from 1-4 players
  if (/!teamsize [1-4]/i.test(message.content) == true) {
    if (message.content.length == 11) {
      let tSize = parseInt(message.content.charAt(10));
      functions.setMatchSize(tSize);
      console.log("team size changed to " + functions.teamSize + "\nmatch size changed to " + functions.matchSize);
      message.channel.sendMessage("team size now " + functions.teamSize);
    }
  }

// set the time to setup in minutes
  if (/!jointime [1-9]/i.test(message.content) == true) {
    if (message.content.length == 11) {
      let time = Number(message.content.charAt(10));
      functions.setSetupTime(time);
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
  /*
  if (message.content === 'testing') {
    functions.checkVariables();
  }
  */
});


// these are for all functions and variables that are accessable from other files
var commands = {

  setupTimeout : function(div) {
    if (divA.hasStarted === true && divA.ready === false) {
      functions.end();
      console.log("PUG cancelled, not enough players")
      bot.channels.get(divA.channel, 'channel').sendMessage(messages.cancelled());
    };
  },

  startMatch : function(div, author) {

    bot.channels.get(divA.channel, 'channel').sendMessage(messages.joined(div, author));

    functions.sortTeams(functions.teamSize);
    functions.checkTeams();
    functions.createSvrName();
    functions.createPasswd();
    functions.checkTeams();
    //commands.createRole();
    commands.createChannel();

    console.log(functions.serverName + '\n' + functions.password);

    bot.channels.get(divA.channel, 'channel').sendMessage('PUG is ready! The teams are; \nBlue: ' + divA.team1 + '\nOrange: ' + divA.team2 + '\nPlease check your DMs for server details');
    //setTimeout(function() {functions.end('A'); }, functions.roundTime);

    // clears variables ready for the next PUG
    console.log("The Teams are: \n Blue: " + divA.team1 + "\n Orange: " + divA.team2 + "\n teamsize " + divA.team2.length);

    var first = divA.startedBy.toString().slice(2, -1)
    bot.users.get(first).sendMessage(messages.teamDM("Orange", "create", functions.serverName, functions.password));

    for (i = 0; i < divA.team1.length; i++) {
      var player = divA.team1[i].toString().slice(2, -1);
      bot.users.get(player).sendMessage(messages.teamDM("Blue", "join", functions.serverName, functions.password));
    };

    for (i = 1; i < divA.team2.length; i++) {
      var player = divA.team2[i].toString().slice(2, -1);
      bot.users.get(player).sendMessage(messages.teamDM("Orange", "join", functions.serverName, functions.password));
    };

    functions.end();
  },

// creates the role for the PUG players
  /*createRole : function() {
    console.log("DEBUG: guild id is " + CONFIG.guild)
    if (bot.guilds.get(CONFIG.guild).available) {
      bot.guilds.get(CONFIG.guild).createRole({name: functions.serverName + "-Orange"});
      bot.guilds.get(CONFIG.guild).createRole({name: functions.serverName + "-Blue"});
    };
  },
*/
// creates voice channels for the PUG players to use
  createChannel : function() {

    if (bot.guilds.get(CONFIG.guild).available) {
      let server = bot.guilds.get(CONFIG.guild);
      server.createChannel(functions.serverName + "-Orange", 'voice')
      server.createChannel(functions.serverName + "-Blue", 'voice');

      setTimeout(function() {
        let orange = server.channels.find('name', functions.serverName + "-Orange").id;
        let blue = server.channels.find('name', functions.serverName + "-Blue").id;
        server.channels.get(orange).setUserLimit(functions.teamSize);
        server.channels.get(blue).setUserLimit(functions.teamSize);

        setTimeout(function(){
          bot.channels.get(orange).delete();
          bot.channels.get(blue).delete();
        }, 30000);
      }, 2000);
    };
  }

};

// this method of exporting is to work around circular dependencies
for (var key in commands) {
  module.exports[key] = commands[key];
}

// catch unhandled promise rejection warnings
process.on("unhandledRejection", err => {
  console.error("Uncaught Promise Error: \n" + err.stack);
});

// log our bot in
bot.login(token);
