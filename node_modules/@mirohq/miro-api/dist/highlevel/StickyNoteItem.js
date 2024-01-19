"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseStickyNoteItem = void 0;
const stickyNoteItem_1 = require("../model/stickyNoteItem");
const Item_1 = require("./Item");
class BaseStickyNoteItem extends stickyNoteItem_1.StickyNoteItem {
    constructor() {
        super(...arguments);
        this.type = 'sticky_note';
        /** @group Methods */
        this.connectTo = Item_1.ConnectableItem.prototype.connectTo;
    }
}
exports.BaseStickyNoteItem = BaseStickyNoteItem;
