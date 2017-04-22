# Discord-PUG-Bot
A Discord bot for organising Pickup Games. Aimed at Rocket League and written  for use on discord.gg/rlo

Players will be able to initiate a PUG, signup for a PUG, then once enough players join, the bot will randomly and evenly assign players to teams

## Commands
`!start`
  Starts a PUG, allowing players to join.

`!join`
  Allows players to join if a PUG has been started.

`!teamsize n`
  Allows the team size to be set to size ***n***. Team size must be 1-4 players.

`!jointime n`
  Allows the time for players to join the PUG to be adjusted to ***n*** minutes. Time can be from 1-9 minutes.

## Installation
This is developed using node.js and the discord.js library. To run the bot you'll need to create a bot from the Discord developers page and add the bot to your server. Then;
- Install [node.js](https://nodejs.org/en/)
- Install the [Discord.js Library](https://discord.js.org/#/)
- Rename config-blank.js to config.js and add your bot token to the config.token variable
- Run `node commands.js` from terminal / command prompt

## Task List
- [ ] Implement randomised name and password generator for server creation
- [ ] Implement DMs to each player in a match with match details
- [ ] Implement player black list
- [ ] Cleanup code to remove references to PUG divisions
- [ ] Implement captains game mode
- [ ] Allow for simultanious PUGs to be running

## RLO Specific Features
- [ ] Create database to store player player details, match details, and results from matches
- [ ] Implement automated score reporting
- [ ] Gain access to the Rocket League API
- [ ] Implement functionality for players to associate their steamID or PSN ID with their Discord 

## Known Bugs
- When teams are assigned, team2[0] will be undefined and the first player added as team2[1]
