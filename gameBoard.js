class GameBoard {
    #board;
    #players;

    constructor() {
        this.#board = new Map();
        this.#players = new Map();
    }

    displayBoard() {
        let text = "\n";
        for (let i = 0; i < 3; i++) {
            text += `-------------\n`;
            text += `| ${this.#board.get(1 + 3 * i) || " "} | ${this.#board.get(2 + 3 * i) || " "} | ${this.#board.get(3 + 3 * i) || " "} |\n`;
        }
        text += `-------------\n`;
        return text;
    }

    checkGameState() {
        const strategy = [[1, 2, 3], [4, 5, 6], [7, 8, 9], [1, 4, 7], [2, 5, 8], [3, 6, 9], [1, 5, 9], [7, 5, 3]];

        for (let i = 0; i < 8; i++) {
            const x = this.#board.get(strategy[i][0]);
            const y = this.#board.get(strategy[i][1]);
            const z = this.#board.get(strategy[i][2]);

            if (x === y && y === z) {
                // return winner letter
                return x;
            }
        }
        return false;
    }

    saveMove(fieldNumber, letter) {
        this.#board.set(fieldNumber, letter);
    }
}

export default GameBoard;