const Utils = require(`./Utils.js`);
const Handles = require(`./Handles.js`);

const INSTANCES = new Set();

class PickupGame {

    static get PUGCount() {
        return INSTANCES.size;
    }

    /**
     * This method will return the PUG that a target user is currently signed up
     * to and may or may not be the host of. This is accomplished by checking
     * all currently available PUGs for the one with this users ID as a player.
     *
     * @static
     * @param  {Snowflake} [userID] The ID of the user whose PUG to retrieve.
     * @return {?PickupGame} The PUG the user is signed up to or undefined.
     */
    static getForUser(userID) {
        for (let pug of INSTANCES) {
            if (pug.playerIDs.includes(userID)) {
                return pug;
            }
        }
        return undefined;
    }

    /**
     * A PickupGame of this state is currently in setup.
     *
     * @static
     * @type {Number}
     * @readonly
     */
    static get SETUP() {
        return 0;
    }

    /**
     * A PickupGame of this state is currently active.
     *
     * @static
     * @type {Number}
     * @readonly
     */
    static get ACTIVE() {
        return 1;
    }

    /**
     * A PickupGame of this state has concluded.
     *
     * @static
     * @type {Number}
     * @readonly
     */
    static get ENDED() {
        return 2;
    }

    constructor(userID, channel, teamSize) {
        this.handles = new Handles(this, channel);
        this.teamSize = parseInt(teamSize);
        this.state = PickupGame.SETUP;
        this.playerIDs = [userID];
        this.hostID = userID;
        this.server = {
            username: undefined,
            password: undefined,
            orange: undefined,
            blue: undefined
        };
        INSTANCES.add(this);
        this.handles.initiate();
        this.timeoutID = setTimeout(() => {
            if (this.playerIDs.length !== this.matchSize) {
                this.end();
            }
        }, 1000 * 60 * 5);
    }

    get matchSize() {
        return this.teamSize * 2;
    }

    get blueTeam() {
        return this.state === PickupGame.SETUP ? undefined : this.playerIDs.slice(0, this.teamSize);
    }

    get orangeTeam() {
        return this.state === PickupGame.SETUP ? undefined : this.playerIDs.slice(this.teamSize);
    }

    /**
     * This method will attempt to add a player to the PUG. A boolean value will
     * be returned describing the success of signing up. A user will only be
     * signed up if all the following are true:
     *     - The user is not already signed up to a PUG
     *     - The PUG state is SETUP
     *     - The PUG is not full
     *
     * @param {Snowflake} [userID] The ID of the user to sign up to the PUG.
     * @return {Boolean} True if the player was signed up, false otherwise.
     */
    addPlayer(userID) {
        if (this.state === PickupGame.SETUP) {
            if (!PickupGame.getForUser(userID)) {
                if (this.playerIDs.length !== this.matchSize) {
                    this.playerIDs.push(userID);
                    this.handles.signedUp(userID);
                    return true;
                }
                this.handles.matchFull(userID);
                return false;
            }
            this.handles.alreadySignedUp(userID);
            return false;
        }
        this.handles.alreadyActive(userID);
        return false;
    }

    removePlayer(userID) {
        if (this.state === PickupGame.SETUP) {
            if (this.playerIDs.includes(userID)) {
                if (userID !== this.hostID) {
                    this.playerIDs.splice(this.playerIDs.indexOf(userID), 1);
                    this.handles.playerLeft(userID);
                    return true;
                }
                this.end();
                this.handles.cancelledByHost();
                return true;
            }
            return false;
        }
        this.handles.unableToLeave(userID);
        return false;
    }

    start(guild) {
        if (this.state === PickupGame.SETUP) {
            if (this.playerIDs.length === this.matchSize) {
                clearTimeout(this.timeoutID);
                this.timeoutID = undefined;
                this.state = PickupGame.ACTIVE;
                this.playerIDs = Utils.shuffleArray(this.playerIDs);
                this.server.username = Utils.generateUsername();
                this.server.password = Utils.generatePassword();
                this.server.blue = Utils.createVoiceChannel(guild, `${this.server.username}-Blue`, this.teamSize);
                this.server.orange = Utils.createVoiceChannel(guild, `${this.server.username}-Orange`, this.teamSize);
                this.handles.started();
                return true;
            }
        }
        return false;
    }

    end() {
        if (this.state !== PickupGame.ENDED) {
            if (this.state === PickupGame.SETUP) {
                clearTimeout(this.timeoutID);
                this.timeoutID = undefined;
                this.handles.cancelled();
            } else {
                this.server.orange.then(channel => channel.delete());
                this.server.blue.then(channel => channel.delete());
                this.handles.ended();
            }
            this.state = PickupGame.ENDED;
            INSTANCES.delete(this);
            return true;
        }
        return false;
    }
}

PickupGame.teamSize = 0; // Host defined or three by default
PickupGame.maxPUGs = 0; // Infinite by default
module.exports = PickupGame;
