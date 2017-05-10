const PickupGame = require(`../PickupGame.js`);
const CONFIG = require(`../../config.json`);
const Command = require(`../Command.js`);

class TeamSize extends Command {

    constructor() {
        super(`teamsize`, /^!(teamSize) ([0-4])$/i);
    }

    authorize(message) {
        return Promise.resolve(CONFIG.admins.includes(message.author.id));
    }

    execute(message) {
        PickupGame.teamSize = (message.content.match(/[0-9]+/g) || []).map(Number)[0];
        message.channel.sendMessage(`The new PUG team size is ${PickupGame.teamSize || `host defined`}`);
    }
}

module.exports = TeamSize;
