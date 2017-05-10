const PickupGame = require(`../PickupGame.js`);
const CONFIG = require(`../../config.json`);
const Command = require(`../Command.js`);

class JoinTime extends Command {

    constructor() {
        super(`jointime`, /^!jointime ([1-9]|10)$/i);
    }

    authorize(message) {
        return Promise.resolve(CONFIG.admins.includes(message.author.id));
    }

    execute(message) {
        PickupGame.joinTime = 1000 * 60 * ((message.content.match(/[0-9]+/g) || []).map(Number)[0] || 5);
        message.channel.sendMessage(`The new PUG join time is ${PickupGame.joinTime / 60 / 1000} minutes`);
    }
}

module.exports = JoinTime;
