"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseTag = void 0;
const helpers_1 = require("./helpers");
const index_1 = require("./index");
const tag_1 = require("../model/tag");
/** @hidden */
class BaseTag extends tag_1.Tag {
    /**
     * Retrieves all the items that have the specified tag.<br/><h3>Required scope</h3> <a target=_blank href=https://developers.miro.com/reference/scopes>boards:read</a> <br/><h3>Rate limiting</h3> <a target=_blank href=https://developers.miro.com/reference/ratelimiting>Level 1</a><br/>
     * Returns an iterator which will automatically paginate and fetch all tagged items
     * @summary Get items by tag
     */
    async *getAllTaggedItems() {
        let currentOffset = 0;
        while (true) {
            const response = (await this._api.getItemsByTag(this.boardId, this.id.toString(), {
                offset: currentOffset.toString(),
            })).body;
            for (const item of response.data || []) {
                yield new index_1.Item(this._api, this.boardId, item.id, item);
            }
            if (!(0, helpers_1.hasMoreData)(response))
                return;
            currentOffset += response.data?.length || 0;
        }
    }
}
exports.BaseTag = BaseTag;
