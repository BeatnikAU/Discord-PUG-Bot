class Command {

    constructor(name, regex) {
        this.regex = regex;
        this.name = name;
    }

    authorize(message) {
        throw new Error(`${this.constructor.name} must implement the authorize() method!`);
    }

    execute(message) {
        throw new Error(`${this.constructor.name} must implement the execute() method!`);
    }
}

module.exports = Command;
