import {Connection} from "./connection.js";

class WebSocketConnection extends Connection {

    sendData(data) {
        const output = JSON.stringify(data);
        this.socket.send(output + "/end");
    }

    /**
     *
     * @param {function(object):void} callback
     */
    onData(callback) {
        this.socket.on('message', (data) => {
            const input = JSON.parse(data);
            callback(input);
        });
    }

    onClose(callback) {
        this.socket.on('close', () => {
            console.log('Client disconnected');
            callback();
        });
    }

    onError(callback) {
        this.socket.on('error', (err) => {
            console.error(`Error: ${err.message}`);
            callback(err);
        });
    }
}

export default WebSocketConnection;