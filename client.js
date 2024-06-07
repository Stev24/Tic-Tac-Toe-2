import * as readline from 'node:readline/promises';
import {stdin as input, stdout as output} from 'node:process';
import net from "net";

class ReadInterface {
    #readline;

    constructor() {
        this.#readline = readline.createInterface({input, output});
    }

    askQuestion(question) {
        return this.#readline.question(question);
    }

    close() {
        this.#readline.close();
    }
}

const port = 3000;
let playerId = null;
let roomId = null;
let reader = null;


const dataHandler = {
    "hand-shake": ({client}) => {
        client.write(JSON.stringify({type: "hand-shake", payload: {roomId}}));
    },
    "game-start": ({data}) => {
        console.log(data.payload.board);
        console.log(data.payload.message);
    },
    "game-continue": ({data}) => {
        console.log(data.payload.message);
        console.log(data.payload.board);
    },
    "player-disconnected": ({data}) => {
        console.log(data.payload.message);
    },
    "player-turn": async ({data, client, reader}) => {
        const answer = await reader.askQuestion(data.payload.message);
        client.write(JSON.stringify({type: "player-turn", payload: {answer}}));
    },
    "board-state": ({data}) => {
        console.log(data.payload.board);
    },
    "game-over": ({data}) => {
        console.log(data.payload.message);
    },
    "player-info": ({data}) => {
        roomId = data.payload.roomId;
        playerId = data.payload.id;
        return {roomId, playerId};
    }
}


async function main() {

    reader = new ReadInterface();
    const client = net.createConnection({port}, () => {
        console.log('Connected to server');
    });

    client.setEncoding('utf8');

    client.on('data', (data) => {
        data.split('/end').forEach(async (line) => {
            const dataToParse = line ? line : "{}"
            const data = JSON.parse(dataToParse);

            if (data.type) {
                dataHandler[data.type]({client, data, reader});
            }
        });
    });

    // to simulate failing connection on the client side
    setTimeout(() => {
        client.end();
    }, 10000);

    client.on('end', () => {
        console.log('Disconnected from server');
        reader.close();
        main();
    });

    client.on('error', (err) => {
        console.error(`Error: ${err.message}`);
    });
}

main();


