const PickupGame = require(`../PickupGame.js`);
const CONFIG = require(`../../config.json`);
const Command = require(`../Command.js`);

class MaxPUGs extends Command {

    constructor() {
        super(`maxpugs`, /^!(maxpugs) ([0-9]+)$/i);
    }

    authorize(message) {
        return Promise.resolve(CONFIG.admins.includes(message.author.id));
    }

    execute(message) {
        PickupGame.maxPUGs = (message.content.match(/[0-9]+/g) || []).map(Number)[0];
        message.channel.sendMessage(`The new max PUG count is ${PickupGame.maxPUGs || `infinite`}`);
    }
}

module.exports = MaxPUGs;
