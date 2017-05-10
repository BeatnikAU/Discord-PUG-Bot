const PickupGame = require(`../PickupGame.js`);
const Command = require(`../Command.js`);

class Start extends Command {

    constructor() {
        super(`start`, /^!(start|host)( [1-4]|)$/i);
    }

    authorize(message) {
        return Promise.resolve(true);
    }

    /**
     * This is where all PUGs are created with or without a specified team size.
     * The static team size (or three when it is zero) will be used when not
     * specified. A new PUG will only be created if the following are true:
     *
     *     - The static team size is 0 or equivalent to the specified team size.
     *     - The maximum PUG count has not been reached.
     *     - The user is not already signed up to a PUG.
     *
     * @param  {Message} message The message containing info for a new PUG.
     */
    execute(message) {
        const authorID = message.author.id;
        if (PickupGame.PUGCount < PickupGame.maxPUGs || !PickupGame.maxPUGs) {
            if (!PickupGame.getForUser(authorID)) {
                const teamSize = (message.content.match(/[0-9]+/g) || []).map(Number)[0] || PickupGame.teamSize || 3;
                if ((PickupGame.teamSize || teamSize) === teamSize) {
                    return new PickupGame(authorID, message.channel, teamSize);
                }
                message.channel.sendMessage(`Sorry, the team size must be ${PickupGame.teamSize}.`);
                return null;
            }
            message.channel.sendMessage(`Sorry, you are already signed up for a PUG.`);
            return null;
        }
        message.channel.sendMessage(`Sorry, the maximum number of PUGs are already active.`);
        return null;
    }
}

module.exports = Start;
