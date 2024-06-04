import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import net from "net";


class ReadInterface {
    #readline;
    constructor() {
        this.#readline = readline.createInterface({ input, output });
    }

    async askQuestion(question) {
        return await this.#readline.question(question);
    }

}

//store id in a file if client side crashes.


async function game() {

    const x = new ReadInterface();
    const port = 3000;
    let id = null;

    // Create a connection to the server
    const client = net.createConnection({ port }, () => {
        console.log('Connected to server');
    });

    // Set encoding for data received
    client.setEncoding('utf8');

    // Handle incoming data
    client.on('data',  (data) => {
        // End the connection after receiving the response

        data.split('/end').forEach(async (line) => {

            const dataToParse = line ? line : "{}"
            const response = JSON.parse(dataToParse);

            if (response && response?.id) {
                id = response.id;
            }

            if (response && response.type === "question") {
                const answer  = await x.askQuestion(response.text);
                client.write(JSON.stringify({id, type:"info", answer}));
            }

            if (response && response.type === "info") {
                console.log(response.text);
            }

        });

        //client.end();
    });

    // Handle client disconnection
    client.on('end', () => {
        console.log('Disconnected from server');

    });

    // Handle errors
    client.on('error', (err) => {
        console.error(`Error: ${err.message}`);
    });
}

game();


