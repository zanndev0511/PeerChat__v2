"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseCardItem = void 0;
const cardItem_1 = require("../model/cardItem");
const Item_1 = require("./Item");
class BaseCardItem extends cardItem_1.CardItem {
    constructor() {
        super(...arguments);
        this.type = 'card';
        /** @group Methods */
        this.connectTo = Item_1.ConnectableItem.prototype.connectTo;
    }
}
exports.BaseCardItem = BaseCardItem;
