const PickupGame = require(`../PickupGame.js`);
const Command = require(`../Command.js`);

class Leave extends Command {

    constructor() {
        super(`leave`, /^!leave$/i);
    }

    authorize(message) {
        return Promise.resolve(true);
    }

    execute(message) {
        const authorID = message.author.id;
        let pug = PickupGame.getForUser(authorID);
        if (pug) {
            pug.removePlayer(authorID);
        }
    }
}

module.exports = Leave;
