
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

    stopListening(callback) {
        this.connection.onClose(() => {
            callback();
        });
    }

    sendToClient(type, text) {
        this.connection.sendData({id: this.id, type, text});
    }
}

export default Player;