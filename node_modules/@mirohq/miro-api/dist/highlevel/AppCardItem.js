"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseAppCardItem = void 0;
const appCardItem_1 = require("../model/appCardItem");
const Item_1 = require("./Item");
class BaseAppCardItem extends appCardItem_1.AppCardItem {
    constructor() {
        super(...arguments);
        this.type = 'app_card';
        /** @group Methods */
        this.connectTo = Item_1.ConnectableItem.prototype.connectTo;
    }
}
exports.BaseAppCardItem = BaseAppCardItem;
