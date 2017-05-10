const PickupGame = require(`./PickupGame.js`);
const CONFIG = require(`../config.json`);
const Discord = require('discord.js');
const Utils = require(`./Utils.js`);

const client = new Discord.Client();
const commands = [
    new(require(`./commands/Start.js`))(),
    new(require(`./commands/Leave.js`))(),
    new(require(`./commands/Join.js`))(),
    new(require(`./commands/End.js`))()
];

client.on(`message`, message => {
    if (message.channel.type === `text` && message.guild.id === CONFIG.guild) {
        const authorID = message.author.id;
        const content = message.content;
        commands.forEach(command => {
            if (command.regex.test(content)) {
                command.authorize(message).then(authorized => {
                    if (authorized) command.execute(message);
                }).catch(console.error);
            }
        });
    }
});

client.on(`ready`, () => console.log(`${client.user.username}: I'm ready!`));
client.login(CONFIG.token);
