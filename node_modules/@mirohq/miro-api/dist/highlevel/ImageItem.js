"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseImageItem = void 0;
const imageItem_1 = require("../model/imageItem");
const Board_1 = require("./Board");
const Item_1 = require("./Item");
const FormData = require("form-data");
class BaseImageItem extends imageItem_1.ImageItem {
    constructor() {
        super(...arguments);
        this.type = 'image';
        /** @group Methods */
        this.connectTo = Item_1.ConnectableItem.prototype.connectTo;
    }
    /**
     * Updates an image item on a board.<br/><h3>Required scope</h3> <a target=_blank href=https://developers.miro.com/reference/scopes>boards:write</a> <br/><h3>Rate limiting</h3> <a target=_blank href=https://developers.miro.com/reference/ratelimiting>Level 2</a><br/>
     *
     * This method can be used to update the image item with a new URL or from an image file.
     *
     * @summary Update image item
     * @param request If request.data.url is set then the URL will be used to create an image otherwise contents of a request.data.data will be uploaded and used to create an image
     */
    async update(request) {
        if ((0, Board_1.isNotUrl)(request)) {
            const body = new FormData();
            body.append('resource', request.data.data, 'filename.png');
            body.append('data', JSON.stringify({
                title: request.data.title,
                geometry: request.geometry,
                position: request.position,
            }));
            await this._api.call('PATCH', `/v2/boards/${this.boardId}/images/${this.id}`, body);
            return;
        }
        await this._api.updateImageItemUsingUrl(this.boardId.toString(), this.id.toString(), request);
    }
}
exports.BaseImageItem = BaseImageItem;
