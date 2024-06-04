import { ServerTCP, ServerWebSocket } from "./server.js";
import Player from "./player.js";
import RoomManager from "./roomManager.js";

import WebSocketConnection from "./WebSocketConnection.js";

const roomManager = new RoomManager();

const server = new ServerTCP((connection) => {
    const player = new Player({ connection });
    player.sendToClient("info", "Welcome player :" + player.id + "\n");

    roomManager.addPlayer(player);
});

server.listen();


// websocket
const wss = new ServerWebSocket((connection) => {
    const player = new Player({connection});
    player.sendToClient("info", "Welcome player :" + player.id + "\n");

    roomManager.addPlayer(player);
});