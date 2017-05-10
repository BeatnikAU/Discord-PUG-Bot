const PickupGame = require(`./PickupGame.js`);
const CONFIG = require(`../config.json`);
const Discord = require('discord.js');
const Utils = require(`./Utils.js`);

const client = new Discord.Client();
const commands = [];

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

        if ((/^!(start|host)( [1-4]|)$/i).test(content)) {
            if (!PickupGame.getForUser(authorID)) {
                const teamSize = Utils.getNumbers(content) ? Utils.getNumbers(content)[0] : 3;
                let pug = new PickupGame(authorID, message.channel, teamSize);
            }
        }

        console.log(`${(/^!join <@([0-9]*)>$/i).test(content)}: ${content}`);
        if ((/^!join <@([0-9]*)>$/i).test(content)) {
            let id = Utils.getNumbers(content)[0];
            let pug = PickupGame.getForUser(id);
            console.log(`${id} + ${pug ? "a" : "b"}`);
            if (pug) {
                if (pug.addPlayer(authorID)) {
                    pug.start(client.guilds.get(CONFIG.guild));
                }
            }
        }

        if (content === `!leave`) {
            let pug = PickupGame.getForUser(authorID);
            if (pug) {
                pug.removePlayer(authorID);
            }
        }

        if (content === `!end`) {
            let pug = PickupGame.getForUser(authorID);
            if (pug && authorID === pug.hostID) {
                pug.end();
            }
        }
    }
});

client.on(`ready`, () => console.log(`${client.user.username}: I'm ready!`));
client.login(CONFIG.token);
