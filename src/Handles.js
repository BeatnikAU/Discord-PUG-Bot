module.exports = class Handles {

    constructor(pug, channel) {
        this.pug = pug;
        this.channel = channel;
    }

    get client() {
        return this.channel.client;
    }

    get leavePUGString() {
        return `Please '!leave' your current PUG before joining a new one.`;
    }

    get startPUGString() {
        return `To start a new PUG, type '!start (team size).'`;
    }

    get joinPUGString() {
        const host = this.client.users.get(this.pug.hostID);
        return ` To join, type '!join ${host}'`;
    }

    // INITIATING
    initiate() {
        const teamSize = this.pug.teamSize;
        const host = this.client.users.get(this.pug.hostID);
        this.channel.sendMessage(`${host} is hosting a ${teamSize}v${teamSize} PUG. ${this.joinPUGString}`);
    }

    // JOINING
    signedUp(userID) {
        const user = this.client.users.get(userID);
        const host = this.client.users.get(this.pug.hostID);
        const requiredPlayers = this.pug.matchSize - this.pug.playerIDs.length;
        this.channel.sendMessage(`${user} has signed up for ${host}'s PUG! Need ${requiredPlayers} more players to begin!`);
    }

    matchFull(userID) {
        const user = this.client.users.get(userID);
        this.channel.sendMessage(`Sorry ${user}, it appears that PUG is full. ${this.startPUGString}`);
    }

    alreadySignedUp(userID) {
        const user = this.client.users.get(userID);
        this.channel.sendMessage(`${user} is already signed up for a PUG. ${this.leavePUGString}`);
    }

    alreadyActive(userID) {
        const user = this.client.users.get(userID);
        this.channel.sendMessage(`Sorry ${user}, that PUG is already active. ${this.startPUGString}`);
    }

    playerLeft(userID) {
        const user = this.client.users.get(userID);
        const host = this.client.users.get(this.pug.hostID);
        const requiredPlayers = this.pug.matchSize - this.pug.playerIDs.length;
        this.channel.sendMessage(`${user} has successfully left ${host}'s PUG! Need ${requiredPlayers} more players to begin!`);
    }

    unableToLeave(userID) {
        const user = this.client.users.get(userID);
        this.channel.sendMessage(`Sorry ${user}, you can't leave a PUG that has already started.`);
    }

    // ENDING
    cancelled() {
        const host = this.client.users.get(this.pug.hostID);
        this.channel.sendMessage(`${host}'s PUG didn't have enough players to start. ${this.startPUGString}`);
    }

    cancelledByHost() {
        const host = this.client.users.get(this.pug.hostID);
        this.channel.sendMessage(`${host} has cancelled their PUG. ${this.startPUGString}`);
    }

    ended() {
        const host = this.client.users.get(this.pug.hostID);
        this.channel.sendMessage(`${host}'s PUG has concluded. To start a new PUG, type '!start (team size)'`);
    }

    // STARTING
    started() {
        const host = this.client.users.get(this.pug.hostID);
        const orangeTeam = this.pug.orangeTeam;
        const playerIDs = this.pug.playerIDs;
        const blueTeam = this.pug.blueTeam;
        const server = this.pug.server;

        Promise.all([server.blue, server.orange]).then(voiceChannels => {
            for (let i = 0; i < playerIDs.length; i++) {
                const method = playerIDs[i] === host.id ? `host` : `join`;
                this.client.users.get(playerIDs[i]).send({
                    embed: {
                        title: `Discord PUG Details`,
                        description: `Please **${method}** a private with the following details`,
                        fields: [{
                            name: `Team to Join`,
                            value: blueTeam.includes(playerIDs[i]) ? `Blue` : `Orange`
                        }, {
                            name: `Discord Voice Channel`,
                            value: blueTeam.includes(playerIDs[i]) ? voiceChannels[0].name : voiceChannels[1].name
                        }, {
                            name: `Server Username`,
                            value: server.username
                        }, {
                            name: `Server Password`,
                            value: server.password
                        }]
                    }
                });
            }
        });


        this.channel.sendEmbed({
            title: `Discord PUG Teams`,
            description: `${host}'s PUG is ready!`,
            fields: [{
                name: `Blue`,
                value: `${blueTeam.map(id => `<@${id}>`).join(`\n`)}`,
                inline: true
            }, {
                name: `Orange`,
                value: `${orangeTeam.map(id => `<@${id}>`).join(`\n`)}`,
                inline: true
            }]
        });
    }
};
