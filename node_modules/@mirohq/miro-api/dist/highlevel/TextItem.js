"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseTextItem = void 0;
const textItem_1 = require("../model/textItem");
const Item_1 = require("./Item");
class BaseTextItem extends textItem_1.TextItem {
    constructor() {
        super(...arguments);
        this.type = 'text';
        /** @group Methods */
        this.connectTo = Item_1.ConnectableItem.prototype.connectTo;
    }
}
exports.BaseTextItem = BaseTextItem;
