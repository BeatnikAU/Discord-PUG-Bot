let matchNumber = 0;

module.exports = class Utils {

    static shuffleArray(array) {
        var cloned = array.slice();
        var shuffled = [];
        while (cloned.length > 0) {
            let index = Math.floor(Math.random() * cloned.length);
            shuffled.push(cloned.pop());
        }
        return shuffled;
    }

    static generateUsername() {
        return `RLOPUG${(1000 + matchNumber++).toString().substring(1)}`;
    }

    static generatePassword() {
        return (Math.floor(Math.random() * 10000) + 10000).toString();
    }

    static getNumbers(string) {
        return (/([0-9][0-9]*)/g).exec(string); // Regex: https://regex101.com/r/HOaADy/
    }

    static createVoiceChannel(guild, name, userLimit) {
        return guild.createChannel(name, 'voice').then(channel => {
            return channel.setUserLimit(parseInt(userLimit));
        });
    }
};
