"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseDocumentItem = void 0;
const documentItem_1 = require("../model/documentItem");
const Board_1 = require("./Board");
const Item_1 = require("./Item");
const FormData = require("form-data");
class BaseDocumentItem extends documentItem_1.DocumentItem {
    constructor() {
        super(...arguments);
        this.type = 'document';
        /** @group Methods */
        this.connectTo = Item_1.ConnectableItem.prototype.connectTo;
    }
    /**
     * Updates a document item on a board<br/><h3>Required scope</h3> <a target=_blank href=https://developers.miro.com/reference/scopes>boards:write</a> <br/><h3>Rate limiting</h3> <a target=_blank href=https://developers.miro.com/reference/ratelimiting>Level 2</a><br/>
     *
     * This method can be used to update the document item with a new URL or from a document file.
     *
     * @summary Update document item
     * @param request If request.data.url is set then the URL will be used to create a document otherwise contents of a request.data.data will be uploaded and used to create a document
     */
    async update(request) {
        if ((0, Board_1.isNotUrl)(request)) {
            const body = new FormData();
            body.append('resource', request.data.data, 'filename.pdf');
            body.append('data', JSON.stringify({
                title: request.data.title,
                geometry: request.geometry,
                position: request.position,
            }));
            await this._api.call('PATCH', `/v2/boards/${this.boardId}/documents/${this.id}`, body);
            return;
        }
        await this._api.updateDocumentItemUsingUrl(this.boardId.toString(), this.id.toString(), request);
    }
}
exports.BaseDocumentItem = BaseDocumentItem;
