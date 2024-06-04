export class Connection {
    constructor(socket) {
        this.socket = socket;
    }
    sendData() {
        throw new Error("define me");
    }

    /**
     *
     * @param {function(object):void} callback
     * @return {void}
     */
    onData(callback) {
        throw new Error("define me");
    }
    onClose(callback) {
        throw new Error("define me");
    }
    onError(callback) {
        throw new Error("define me");
    }
}