import {ServerTCP, ServerWebSocket} from "./server.js";
import Player from "./player.js";
import RoomManager from "./roomManager.js";
import room from "./room.js";

const roomManager = new RoomManager();

const server = new ServerTCP((connection) => {
    const player = new Player({connection});
    roomManager.addPlayerToRoom(player);
});

server.listen();

// websocket
const wss = new ServerWebSocket((connection) => {
    const player = new Player({connection});
    roomManager.addPlayerToRoom(player);
});