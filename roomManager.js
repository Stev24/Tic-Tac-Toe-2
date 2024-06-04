import gameBoard from "./gameBoard.js";
import Room from "./room.js";

class RoomManager {
    rooms = [];
    currentRoom = null;

    constructor() {
    }
    createRoom() {
        this.currentRoom = new Room(new gameBoard());
    }
    addPlayer(player) {
        if (!this.currentRoom) {
            this.createRoom();
            this.currentRoom.addPlayer(player);
            console.log("Room created and player added!");
            return;
        }

        if(this.currentRoom) {
            this.currentRoom.addPlayer(player);
            this.rooms.push(this.currentRoom);
            this.currentRoom = null;
            console.log("Second player added!");
        }
    }
}

export default RoomManager;