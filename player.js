import {getRandomLetter} from "./utils.js";
import EventEmitter from "events";

class Player {
    letter;
    id;
    connection;

    constructor({letter, connection}) {
        this.letter = letter;
        this.id = Date.now();
        this.connection = connection;
    }

    listen(callback) {
        this.connection.onData((data) => {
            callback(data);
        });
    }

    sendToClient(type, text) {
        this.connection.sendData({id: this.id, type, text});
    }
}

export default Player;