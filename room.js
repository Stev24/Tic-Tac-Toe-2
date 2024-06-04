import {getRandomLetter, takeOtherLetter} from "./utils.js";

class Room {
    #board;
    #players = new Map;

    constructor(board) {
        this.#board = board;
    }

    deletePlayer(player) {
        this.#players.delete(player.id);
    }

    addPlayer(player) {
        if (this.#players.size >= 2) {
            console.log("Error");
            return;
        }

        player.listen((data) => {
            this.makeMove(player, +data.answer);
        })

        if(this.#players.size === 0) {
            player.letter = getRandomLetter();
            this.#players.set(player.id, player);
            return;
        }

        if(this.#players.size === 1) {
            const opponentLetter = this.#players.values().next().value.letter;
            player.letter = takeOtherLetter(opponentLetter);
            this.#players.set(player.id ,player);

            this.startGame();
        }
    }

    makeMove(player, field) {
        this.#board.saveMove(field, player.letter);

        const winnerLetter = this.#board.checkGameState();

        const opponent = this.getOpponent(player);
        console.log(opponent);

        if(!winnerLetter) {
            player.sendToClient("info", this.#board.displayBoard());

            opponent.sendToClient("info", this.#board.displayBoard());
            opponent.sendToClient("question", "Your turn " + opponent.letter + " ! ");
        } else {
            player.sendToClient("info", this.#board.displayBoard());
            player.sendToClient("info", "Game Ended!");
            player.sendToClient("info", "This winner is " + winnerLetter);

            opponent.sendToClient("info", this.#board.displayBoard());
            opponent.sendToClient("info", "Game Ended!");
            opponent.sendToClient("info", "This winner is " + winnerLetter);
        }
    }

    getOpponent(player) {
        return Array.from(this.#players.values()).find(p => p.id !== player.id);
    }

    startGame() {
        const board = this.#board.displayBoard();
        this.#players.forEach((player)=>{
            player.sendToClient("info", "Game Starts!\n");
            player.sendToClient("info", board);

            player.stopListening(()=>{
                const opponent = this.getOpponent(player);
                this.deletePlayer(player);
                opponent.sendToClient("info", "Opponent left the game!");
                opponent.sendToClient("info", this.#players.size + " players in the room");
            })
        })

        const player = this.#players.values().next().value;

        player.sendToClient("question", "Your turn " + player.letter + " ! ");
    }
}

export default Room;