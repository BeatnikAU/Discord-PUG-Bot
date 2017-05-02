# Discord-PUG-Bot

A Discord bot for organising Pickup Games. Aimed at Rocket League and written for use on discord.gg/rlo

Players will be able to initiate a PUG, signup for a PUG, then once enough players join, the bot will randomly and evenly assign players to teams

## Commands

`!start` Starts a PUG, allowing players to join.

`!join` Allows players to join if a PUG has been started.

`!teamsize n` Allows the team size to be set to size **_n_**. Team size must be 1-4 players.

`!jointime n` Allows the time for players to join the PUG to be adjusted to **_n_** minutes. Time can be from 1-9 minutes.

## Installation

This is developed using node.js and the discord.js library. To run the bot you'll need to create a bot from the [Discord developers](https://discordapp.com/developers/) page and add the bot to your server. Then;

- Install [node.js](https://nodejs.org/en/)
- Rename config-blank.json to config.json then add your bot token and guild id
- Run `npm install` from terminal / command prompt to install the dependencies
- Run `node commands.js` from terminal / command prompt to start the bot

## Task List

- [x] Implement randomised name and password generator for server creation
- [x] Implement DMs to each player in a match with match details
- [ ] Implement command permissions. Eg, only owner can change teamsize or jointime
- [ ] Implement player black list
- [ ] Cleanup code to remove references to PUG divisions
- [ ] Implement captains game mode
- [ ] Allow for simultanious PUGs to be running (partial)

## RLO Specific Features

- [ ] Create database to store player player details, match details, and results from matches
- [ ] Implement automated score reporting
- [ ] Gain access to the Rocket League API
- [ ] Implement functionality for players to associate their steamID or PSN ID with their Discord

## Known Bugs

- ~~When teams are assigned, team2[0] will be undefined and the first player added as team2[1]~~
- (workaround in place) teamSize, matchSize, setupTime all initialise as undefined rather than an int
- ~~if !start is used just before the timeout time for ending a PUG executes, the current PUG will be cancelled~~
