const PickupGame = require(`../PickupGame.js`);
const Command = require(`../Command.js`);
const CONFIG = require(`../../config.json`);

class Join extends Command {

    constructor() {
        super(`join`, /^!join <@[0-9]{18}>$/i);
    }

    authorize(message) {
        return Promise.resolve(true);
    }

    execute(message) {
        let id = (message.content.match(/[0-9]{18}/g) || [])[0];
        let pug = PickupGame.getForUser(id);
        if (pug) {
            if (pug.addPlayer(message.author.id)) {
                pug.start(message.client.guilds.get(CONFIG.guild));
            }
        }
    }
}

module.exports = Join;
