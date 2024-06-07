import {getRandomLetter, takeOtherLetter} from "./utils.js";
import player from "./player.js";

class Room {
    id;
    #board;
    #players = new Map([]);
    gameStarted = false;
    gameEnded = false;
    currentPlayerLetter = null;

    constructor(board) {
        this.#board = board;
        this.id = Date.now();
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
            if (data.type === "player-turn") {
                const fieldNumber = +data.payload.answer;
                if (fieldNumber > 0 && fieldNumber <= 9) {
                    this.makeMove(player, fieldNumber);
                }
            }
        });

        player.stopListening(() => {
            const opponent = this.getOpponent(player);
            this.deletePlayer(player);
            if (opponent) {
                opponent.sendToClient("player-disconnected", {message: "Opponent left the game!"});
            }
        })

        player.roomId = this.id;
        player.sendToClient("player-info", {roomId: this.id, id: player.id});

        if (this.#players.size === 0) {
            player.letter = getRandomLetter();
            this.#players.set(player.id, player);
            return;
        }

        if (this.#players.size === 1) {
            const opponentLetter = this.#players.values().next().value.letter;
            player.letter = takeOtherLetter(opponentLetter);
            this.#players.set(player.id, player);

            if (!this.gameEnded) {
                if (!this.gameStarted) {
                    this.startGame();
                } else {
                    this.continueGame();
                }
            }
        }
    }

    makeMove(player, field) {
        this.#board.saveMove(field, player.letter);

        const winnerLetter = this.#board.checkGameState();

        const opponent = this.getOpponent(player);
        this.currentPlayerLetter = opponent.letter;

        if (!winnerLetter) {
            player.sendToClient("board-state", {board: this.#board.displayBoard()});
            opponent.sendToClient("board-state", {board: this.#board.displayBoard()});

            opponent.sendToClient("player-turn", {message: "Your turn " + opponent.letter + " ! "});
        } else {
            player.sendToClient("board-state", {board: this.#board.displayBoard()});
            player.sendToClient("game-over", {message: "Game Over! This winner is " + winnerLetter});

            opponent.sendToClient("board-state", {board: this.#board.displayBoard()});
            opponent.sendToClient("game-over", {message: "Game Over! This winner is " + winnerLetter});

            this.endGame();
        }
    }

    getOpponent(player) {
        return Array.from(this.#players.values()).find(p => p.id !== player.id);
    }

    getPlayerByLetter(letter) {
        return Array.from(this.#players.values()).find(p => p.letter === letter);
    }

    startGame() {
        this.gameStarted = true;

        const board = this.#board.displayBoard();
        this.#players.forEach((player) => {
            player.sendToClient("game-start", {message: "Game Starts!", board})
        })

        const currentPlayer = this.#players.values().next().value;
        this.currentPlayerLetter = currentPlayer.letter;
        currentPlayer.sendToClient("player-turn", {message: "Your turn " + currentPlayer.letter + " ! "});
    }

    continueGame() {
        const board = this.#board.displayBoard();
        this.#players.forEach((player) => {
            player.sendToClient("game-continue", {message: "Game Continues!", board});
        });

        const currentPlayer = this.getPlayerByLetter(this.currentPlayerLetter);
        currentPlayer.sendToClient("player-turn", {message: "Your turn " + currentPlayer.letter + " ! "});
    }

    endGame() {
        this.gameEnded = true;
    }
}

export default Room;