"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseFrameItem = void 0;
const frameItem_1 = require("../model/frameItem");
const index_1 = require("./index");
/** @hidden */
class BaseFrameItem extends frameItem_1.FrameItem {
    /**
     * Retrieves a list of items within a specific frame. A frame is a parent item and all items within a frame are child items.<br/><h3>Required scope</h3> <a target=_blank href=https://developers.miro.com/reference/scopes>boards:read</a> <br/><h3>Rate limiting</h3> <a target=_blank href=https://developers.miro.com/reference/ratelimiting>Level 2</a><br/>
     * Returns an iterator which will automatically paginate and fetch all available items
     * @summary Get items within frame
     */
    async *getAllItems(query) {
        let cursor = undefined;
        while (true) {
            const response = (await this._api.getItemsWithinFrame(this.boardId, this.id.toString(), {
                ...query,
                cursor,
            })).body;
            for (const item of response.data || []) {
                yield index_1.Item.fromGenericItem(this._api, this.boardId, item);
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
}
exports.BaseFrameItem = BaseFrameItem;
