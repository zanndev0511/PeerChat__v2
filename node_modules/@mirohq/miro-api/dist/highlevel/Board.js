"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseBoard = exports.isNotUrl = void 0;
const board_1 = require("../model/board");
const index_1 = require("./index");
const FormData = require("form-data");
const helpers_1 = require("./helpers");
function isNotUrl(r) {
    return !(r.data && 'url' in r.data);
}
exports.isNotUrl = isNotUrl;
/** @hidden */
class BaseBoard extends board_1.Board {
    /**
     * Retrieves a list of items for a specific board. You can retrieve all items on the board, or a list of specific types of items by specifying URL query parameter values.<br/><h3>Required scope</h3> <a target=_blank href=https://developers.miro.com/reference/scopes>boards:read</a> <br/><h3>Rate limiting</h3> <a target=_blank href=https://developers.miro.com/reference/ratelimiting>Level 2</a><br/>
     * Returns an iterator which will automatically paginate and fetch all available items
     * @summary Get items on board
     */
    async *getAllItems(query) {
        let cursor = undefined;
        while (true) {
            const response = (await this._api.getItems(this.id, {
                ...query,
                cursor,
            })).body;
            for (const item of response.data || []) {
                yield index_1.Item.fromGenericItem(this._api, this.id, item);
            }
            cursor = response.cursor;
            const size = response.data?.length || 0;
            const total = response.total || 0;
            if (!total || !size)
                return;
            if (!cursor)
                return;
        }
    }
    /**
     * Get all members on the board.<br/><h3>Required scope</h3> <a target=_blank href=https://developers.miro.com/reference/scopes>boards:read</a> <br/><h3>Rate limiting</h3> <a target=_blank href=https://developers.miro.com/reference/ratelimiting>Level 1</a><br/>
  
     * Returns an iterator which will automatically paginate and fetch all available members
     * @summary Get all board members
     */
    async *getAllMembers() {
        let currentOffset = 0;
        while (true) {
            const response = (await this._api.getBoardMembers(this.id, {
                offset: currentOffset.toString(),
            })).body;
            for (const item of response.data || []) {
                yield new index_1.BoardMember(this._api, this.id, item.id, item);
            }
            if (!(0, helpers_1.hasMoreData)(response))
                return;
            currentOffset += response.data?.length || 0;
        }
    }
    /**
     * Retrieves all the tags from the specified board.<br/><h3>Required scope</h3> <a target=_blank href=https://developers.miro.com/reference/scopes>boards:read</a> <br/><h3>Rate limiting</h3> <a target=_blank href=https://developers.miro.com/reference/ratelimiting>Level 1</a><br/>
     *
     * Returns an iterator which will automatically paginate and fetch all available tags
     * @summary Get tags from board
     */
    async *getAllTags() {
        let currentOffset = 0;
        while (true) {
            const response = (await this._api.getTagsFromBoard(this.id, {
                offset: currentOffset.toString(),
            })).body;
            for (const item of response.data || []) {
                yield new index_1.Tag(this._api, this.id, item.id, item);
            }
            if (!(0, helpers_1.hasMoreData)(response))
                return;
            currentOffset += response.data?.length || 0;
        }
    }
    /**
     * Retrieves all connectors for a specific board.<br/><h3>Required scope</h3> <a target=_blank href=https://developers.miro.com/reference/scopes>boards:read</a> <br/><h3>Rate limiting</h3> <a target=_blank href=https://developers.miro.com/reference/ratelimiting>Level 2</a><br/>
     * Returns an iterator which will automatically paginate and fetch all available tags
     */
    async *getAllConnectors() {
        let cursor = undefined;
        while (true) {
            const response = (await this._api.getConnectors(this.id, {
                cursor,
            })).body;
            for (const connector of response.data || []) {
                yield new index_1.Connector(this._api, this.id, connector.id, connector);
            }
            cursor = response.cursor;
            const size = response.data?.length || 0;
            const total = response.total || 0;
            if (!total || !size)
                return;
            if (!cursor)
                return;
        }
    }
    /**
     * Retrieves information for a specific item on a board.<br/><h3>Required scope</h3> <a target=_blank href=https://developers.miro.com/reference/scopes>boards:read</a> <br/><h3>Rate limiting</h3> <a target=_blank href=https://developers.miro.com/reference/ratelimiting>Level 1</a><br/>
     * @summary Get specific item on board
     * @param itemId [Unique identifier (ID) of the item](https://developers.miro.com/reference/rest-api-item-model) that you want to retrieve.
     */
    async getItem(itemId) {
        const response = await this._api.getSpecificItem(this.id, itemId);
        const item = response.body;
        return index_1.Item.fromGenericItem(this._api, this.id, item);
    }
    /**
     * Adds an image item to a board.<br/><h3>Required scope</h3> <a target=_blank href=https://developers.miro.com/reference/scopes>boards:write</a> <br/><h3>Rate limiting</h3> <a target=_blank href=https://developers.miro.com/reference/ratelimiting>Level 2</a><br/>
     *
     * This method can be used to create an image item with a new URL or from an image file.
     * @summary Create image item
     * @param request If request.data.url is set then the URL will be used to create an image otherwise contents of a request.data.data will be uploaded and used to create an image
     */
    async createImageItem(request) {
        const result = isNotUrl(request)
            ? (await this.fileUploadRequest('images', request))
            : (await this._api.createImageItemUsingUrl(this.id.toString(), request)).body;
        return new index_1.ImageItem(this._api, this.id, result.id, result);
    }
    /**
     * Adds a document item to a board.<br/><h3>Required scope</h3> <a target=_blank href=https://developers.miro.com/reference/scopes>boards:write</a> <br/><h3>Rate limiting</h3> <a target=_blank href=https://developers.miro.com/reference/ratelimiting>Level 2</a><br/>
     *
     * This method can be used to create a document item with a new URL or from a document file.
     * @summary Create document item
     * @param request If request.data.url is set then the URL will be used to create a document otherwise contents of a request.data.data will be uploaded and used to create a document
     */
    async createDocumentItem(request) {
        const result = isNotUrl(request)
            ? (await this.fileUploadRequest('documents', request))
            : (await this._api.createDocumentItemUsingUrl(this.id.toString(), request)).body;
        return new index_1.DocumentItem(this._api, this.id, result.id, result);
    }
    /** @hidden */
    async fileUploadRequest(type, request) {
        const body = new FormData();
        body.append('resource', request.data.data, `filename.${type === 'images' ? 'png' : 'pdf'}`);
        body.append('data', JSON.stringify({
            title: request.data.title,
            geometry: request.geometry,
            position: request.position,
        }));
        return (await this._api.call('POST', `/v2/boards/${this.id}/${type}`, body)).body;
    }
}
exports.BaseBoard = BaseBoard;
