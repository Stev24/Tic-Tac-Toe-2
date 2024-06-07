import gameBoard from "./gameBoard.js";
import Room from "./room.js";

class RoomManager {
    rooms = [];
    currentRoom = null;
    playersPool = new Map([]);

    constructor() {
    }

    createRoom() {
        this.currentRoom = new Room(new gameBoard());
        this.rooms.push(this.currentRoom);
    }

    addPlayerToPool(player) {
        this.playersPool.set(player.id, player);
    }

    addPlayerToNewRoom(player) {
        this.createRoom();
        this.currentRoom.addPlayer(player);
        console.log("New room created and player added!");
    }

    addPlayerToCurrentRoom(player) {
        this.currentRoom.addPlayer(player);

        this.rooms.push(this.currentRoom);
        this.currentRoom = null;
        console.log("Player added to current room!");
    }

    manageCurrentRoom(player) {
        if (!this.currentRoom) {
            this.addPlayerToNewRoom(player);
            return;
        }

        if (this.currentRoom) {
            this.addPlayerToCurrentRoom(player);
        }
    }

    addPlayerToRoom(player) {
        player.sendToClient("hand-shake", {info: "Welcome player"});

        player.listen((data) => {
            if (data.type === "hand-shake") {
                const roomId = data.payload.roomId;
                if (roomId) {
                    const room = this.getRoomById(roomId);
                    room.addPlayer(player);
                } else {
                    this.manageCurrentRoom(player);
                }
                return;
            }
        })
    }

    getRoomById(id) {
        return this.rooms.find((room) => room.id === id);
    }
}

export default RoomManager;