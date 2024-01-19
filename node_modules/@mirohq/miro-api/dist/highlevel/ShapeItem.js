"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseShapeItem = void 0;
const shapeItem_1 = require("../model/shapeItem");
const Item_1 = require("./Item");
class BaseShapeItem extends shapeItem_1.ShapeItem {
    constructor() {
        super(...arguments);
        this.type = 'shape';
        /** @group Methods */
        this.connectTo = Item_1.ConnectableItem.prototype.connectTo;
    }
}
exports.BaseShapeItem = BaseShapeItem;
