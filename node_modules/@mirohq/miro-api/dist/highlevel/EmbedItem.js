"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseEmbedItem = void 0;
const embedItem_1 = require("../model/embedItem");
const Item_1 = require("./Item");
class BaseEmbedItem extends embedItem_1.EmbedItem {
    constructor() {
        super(...arguments);
        this.type = 'embed';
        /** @group Methods */
        this.connectTo = Item_1.ConnectableItem.prototype.connectTo;
    }
}
exports.BaseEmbedItem = BaseEmbedItem;
