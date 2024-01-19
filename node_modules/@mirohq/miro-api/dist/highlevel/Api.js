"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseApi = void 0;
const index_1 = require("./index");
const helpers_1 = require("./helpers");
/** @hidden */
class BaseApi {
    /** {@inheritDoc api/apis!MiroApi.revokeToken} */
    async revokeToken() {
        await this._api.revokeToken(typeof this._api.accessToken === 'function' ? await this._api.accessToken() : this._api.accessToken);
    }
    /**
     * Retrieves all boards that match the search criteria provided in the request. If you are an Enterprise customer and a Company Admin, you can retrieve all boards, including all private boards (boards that haven\'t been specifically shared with you) by enabling Content Admin permissions. To enable Content Admin permissions, see https://help.miro.com/hc/en-us/articles/360012777280-Content-Admin-permissions-for-Company-Admins. Note that you only get results instantaneously when you filter by `team_id`. If you use any other filter,  you need to give a few seconds for the indexing of newly created boards before retrieving boards.<br/><h3>Required scope</h3> <a target=_blank href=https://developers.miro.com/reference/scopes>boards:read</a> <br/><h3>Rate limiting</h3> <a target=_blank href=https://developers.miro.com/reference/ratelimiting>Level 1</a><br/>
     *
     * Returns an iterator which will automatically paginate and fetch all available boards
     * @summary Get boards
     */
    async *getAllBoards(query) {
        let currentOffset = 0;
        while (true) {
            const response = (await this._api.getBoards({
                ...query,
                offset: currentOffset.toString(),
            })).body;
            for (const board of response.data || []) {
                yield new index_1.Board(this._api, board.id, board);
            }
            if (!(0, helpers_1.hasMoreData)(response))
                return;
            currentOffset += response.data?.length || 0;
        }
    }
}
exports.BaseApi = BaseApi;
