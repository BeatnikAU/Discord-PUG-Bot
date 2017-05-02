module.exports = {

    running(div) {
        return `There is already a PUG running. Please wait for this to finish and try again`;
    },

    initiate(div, user) {
        return `A PUG has been started by ${user}. To join, type !join`;
    },

    cancelled() {
        return `Not enough have signed up for the PUG. To start a new PUG, type !start into the channel`;
    },

    joined(div, user) {
        return `${user} has joined the PUG!`;
    },

    alreadyIn(user) {
        return `${user} is already signed up!`;
    },

    alreadyRunning(div, user) {
        return `Sorry ${user}, a PUG is already playing. Please try again later`;
    },

    noPug(div, user) {
        return `Sorry ${user}, there is currently no PUG running. You can start a PUG with !start`;
    },

    endPug(div) {
        return `The PUG has ended. To start a new PUG, type !start`;
    },

    available(div) {
        return `The PUG bot is now available to starte PUG. To start one, type '!start' into chat`;
    },

    teamDM(colour, method, name, pass) {
        return `The PUG is ready! Please **${method}** a private match with the following details and join team **${colour}**: \n Name: ${name}\n Password: ${pass}`;
    }
};
