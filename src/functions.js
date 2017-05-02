var functions = {};

const divA = require('./divA.js');
const messages = require('./messages.js');
const commands = require('./commands.js');
var setupTime;
var roundTime = 2400000;
var matchSize;
var teamSize;
var matchNo = 1;
var password;
var serverName;
var timer;

// checks the supplied array for the supplied element
// returns boolean
functions.inArray = function(arrayToCheck, comparer) {
    for (var i = 0; i < arrayToCheck.length; i++) {
        if (arrayToCheck[i] === comparer) return true;
    }
    return false;
};

functions.setMatchSize = function(size) {
    console.log("DEBUG: size is not a number: " + isNaN(size));
    functions.teamSize = size;
    functions.matchSize = (2 * size);
};

functions.setSetupTime = function(time) {
    console.log("DEBUG: time is not a number: " + isNaN(time));
    functions.setupTime = time * 60000;
};

// increments the server name
functions.createSvrName = function() {
    var str = "RLOPUG000";
    var num = "" + matchNo++;
    functions.serverName = str.substring(0, str.length - num.length) + num;
};

// generates a 4 digit password for server
functions.createPasswd = function() {
    var n1 = Math.random() * 9 + 1;
    var n2 = Math.random() * 90 + 1;
    var n3 = Math.random() * 900 + 1;
    var n4 = Math.random() * 9000 + 1;
    var pCode = Math.floor(Math.round(n1 + n2 + n3 + n4));
    var str = "" + pCode;
    functions.password = str.substring(0, 4 - str.length) + str;
};

functions.sortTeams = function(tSize) {
    for (var i = 1; i < divA.joined.length; i++) {
        var l1 = divA.team1.length;
        var l2 = divA.team2.length;

        if (l2 == tSize) {
            divA.team1[l1] = divA.joined[i];
        } else if (l1 == tSize) {
            divA.team2[l2] = divA.joined[i];
        } else if (Math.random() < 0.5) {
            divA.team1[l1] = divA.joined[i];
        } else {
            divA.team2[l2] = divA.joined[i];
        }
    }
};

functions.checkTeams = function() {
    if (divA.team1.length > functions.teamSize || divA.team2.length > functions.teamSize) {
        divA.team1 = [];
        divA.team2 = [divA.joined[0]];
        functions.sortTeams();
    }
};

// these are the functions to check the PUG state
// the checkRun function also sends the message when a PUG starts
functions.checkRun = function(div, author, channel) {
    if (div === 'A') {
        if (divA.hasStarted === true) {
            console.log(author + " tried to start a PUG but there was already one running");
            return messages.running(div);
        } else {
            divA.hasStarted = true;
            divA.startedBy = author;
            divA.channel = channel;
            divA.joined[divA.joined.length] = author;
            divA.team2[0] = author;
            console.log('A div ' + div + ' PUG has been started by ' + author);
            timer = setTimeout(function(div) {
                commands.setupTimeout(div);
            }, functions.setupTime);
            return messages.initiate('A', author);
            //setTimeout(functions.messageEndPug(div), setupTime);
        }
    }
};

functions.checkJoin = function(div, author) {
    if (divA.hasStarted === true && functions.inArray(divA.joined, author) === false && divA.ready === false && divA.joined.length < (functions.matchSize - 1)) {
        divA.joined[divA.joined.length] = author;
        //divA.checkReady();
        console.log(author + " has joined the PUG");
        return messages.joined(div, author);
    } else if (divA.hasStarted === true && functions.inArray(divA.joined, author) === false && divA.joined.length === (functions.matchSize - 1)) {
        divA.joined[divA.joined.length] = author;
        //divA.checkReady();
        divA.ready = true;
        console.log(author + " has joined the PUG");
        clearTimeout(timer);
        commands.startMatch(div, author);
    } else if (divA.hasStarted === true && functions.inArray(divA.joined, author) === true && divA.ready === false) {
        return messages.alreadyIn(author);
    } else if (divA.hasStarted === true && divA.ready === true) {
        return messages.alreadyRunning(div, author);
    } else {
        return messages.noPug(div, author);
    }
};

functions.end = function() {
    divA.hasStarted = false;
    divA.joined = [];
    divA.team1 = [];
    divA.team2 = [];
    divA.startedBy;
    divA.channel;
    divA.ready = false;
};

// testing functions
functions.checkVariables = function() {
    console.log(" Started by: " + divA.startedBy + "\n Has started: " + divA.hasStarted + "\n Players: " + divA.joined + "\n Team B: " + divA.team1 + "\n Team O: " + divA.team2 + "\n Ready: " + divA.ready + "\n Amount joined: " + divA.joined.length + "\n Channel ID: " + divA.channel + "\n");
};

module.exports = functions;
