// Singleton pattern to avoid cyclical dependency.
module.exports = class SingletonManager {
    constructor() {
        this._client = null;
    }

    get client() {
        if (this._client) {
            throw new TypeError("Client is null!");
        }
        return this._client;
    }

    set client(client) {
        if (this._client) {
            throw new TypeError("Client is null!");
        }
        this._client = client;
    }
}