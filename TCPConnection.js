import {Connection} from "./connection.js";


export class TCPConnection extends Connection {

    sendData(data) {
        const output = JSON.stringify(data);
        this.socket.write(output + "/end");
    }

    /**
     *
     * @param {function(object):void} callback
     */
    onData(callback) {
        this.socket.on('data', (data) => {
            const input = JSON.parse(data);
            callback(input);
        });
    }
    onClose(callback) {
        this.socket.on('end', () => {
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