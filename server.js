import net from "net";
import {WebSocketServer} from 'ws';
import {TCPConnection} from "./TCPConnection.js";
import WebSocketConnection from "./WebSocketConnection.js";

class ServerTCP {
    server = null;

    constructor(callback) {
        this.server = net.createServer((socket) => {
            console.log('Connection established');
            callback(new TCPConnection(socket));
        });
    }

    listen() {
        this.server.listen(3000, () => {
            console.log('Server is listening on port 3000');
        });
    }
}

class ServerWebSocket {
    constructor(callback) {
        const wss = new WebSocketServer({port: 8080});

        wss.on('connection', function connection(socket) {
            console.log('Connection established');
            callback(new WebSocketConnection(socket));
        });
    }
}

export {ServerWebSocket, ServerTCP};