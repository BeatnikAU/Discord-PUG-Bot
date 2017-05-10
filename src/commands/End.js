const PickupGame = require(`../PickupGame.js`);
const Command = require(`../Command.js`);

class End extends Command {

    constructor() {
        super(`end`, /^!end$/i);
    }

    authorize(message) {
        return Promise.resolve(true);
    }

    execute(message) {
        const authorID = message.author.id;
        let pug = PickupGame.getForUser(authorID);
        if (pug && authorID === pug.hostID) {
            pug.end();
        }
    }
}

module.exports = End;
