"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryStorage = void 0;
class InMemoryStorage {
    constructor() {
        this.storage = {};
    }
    async get(userId) {
        return this.storage[userId];
    }
    async set(userId, state) {
        this.storage[userId] = state;
    }
}
exports.InMemoryStorage = InMemoryStorage;
