class Player {
    letter;
    id;
    roomId;
    connection;

    constructor({connection}) {
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

    sendToClient(type, payload) {
        this.connection.sendData({type, payload});
    }
}

export default Player;