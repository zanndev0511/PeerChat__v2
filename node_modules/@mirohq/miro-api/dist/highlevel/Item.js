"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseItem = exports.ConnectableItem = void 0;
const genericItem_1 = require("../model/genericItem");
const _1 = require(".");
/** @hidden */
class ConnectableItem {
    async connectTo(endItem, connectorCreationData) {
        const connector = (await this._api.createConnector(this.boardId, {
            startItem: {
                ...(connectorCreationData?.startItem || {}),
                id: this.id.toString(),
            },
            ...connectorCreationData,
            endItem: typeof endItem === 'object'
                ? endItem
                : {
                    id: endItem.toString(),
                },
        })).body;
        return new _1.Connector(this._api, this.boardId, connector.id, connector);
    }
}
exports.ConnectableItem = ConnectableItem;
class BaseItem extends genericItem_1.GenericItem {
    constructor() {
        super(...arguments);
        /** @group Methods */
        this.connectTo = ConnectableItem.prototype.connectTo;
    }
    static fromGenericItem(api, boardId, item) {
        let classToUse = _1.Item;
        switch (item.type) {
            case 'app_card':
                classToUse = _1.AppCardItem;
                break;
            case 'card':
                classToUse = _1.CardItem;
                break;
            case 'document':
                classToUse = _1.DocumentItem;
                break;
            case 'embed':
                classToUse = _1.EmbedItem;
                break;
            case 'frame':
                classToUse = _1.FrameItem;
                break;
            case 'image':
                classToUse = _1.ImageItem;
                break;
            case 'shape':
                classToUse = _1.ShapeItem;
                break;
            case 'sticky_note':
                classToUse = _1.StickyNoteItem;
                break;
            case 'text':
                classToUse = _1.TextItem;
                break;
        }
        return new classToUse(api, boardId, item.id, item);
    }
}
exports.BaseItem = BaseItem;
