"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseTeam = void 0;
const team_1 = require("../model/team");
const index_1 = require("./index");
const helpers_1 = require("./helpers");
/** @hidden */
class BaseTeam extends team_1.Team {
    /**
     * Retrieves all boards that match the search criteria provided in the request. If you are an Enterprise customer and a Company Admin, you can retrieve all boards, including all private boards (boards that haven\'t been specifically shared with you) by enabling Content Admin permissions. To enable Content Admin permissions, see https://help.miro.com/hc/en-us/articles/360012777280-Content-Admin-permissions-for-Company-Admins. Note that you only get results instantaneously when you filter by `team_id`. If you use any other filter,  you need to give a few seconds for the indexing of newly created boards before retrieving boards.<br/><h3>Required scope</h3> <a target=_blank href=https://developers.miro.com/reference/scopes>boards:read</a> <br/><h3>Rate limiting</h3> <a target=_blank href=https://developers.miro.com/reference/ratelimiting>Level 1</a><br/>
     *
     * Returns an iterator which will automatically paginate and fetch all available boards
     */
    async *getAllBoards(query) {
        let currentOffset = 0;
        while (true) {
            const response = (await this._api.getBoards({
                ...query,
                teamId: this.id.toString(),
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
    /**
     * Get all team members of the current team
     * <br/><h3>Required scope</h3> <a target=_blank href=https://developers.miro.com/reference/scopes>organizations:teams:read</a> <br/><h3>Rate limiting</h3> <a target=_blank href=https://developers.miro.com/reference/ratelimiting>Level 2</a> <br/><h3>Enterprise only</h3> <p>This API is available only for <a target=_blank href=\"/reference/api-reference#enterprise-plan\">Enterprise plan</a> users.</p>
     * Returns an iterator which will automatically paginate and fetch all available team members
     */
    async *getAllTeamMembers(query) {
        let cursor = undefined;
        while (true) {
            const response = (await this._api.enterpriseGetTeamMembers(this.orgId.toString(), this.id.toString(), { ...query, cursor })).body;
            for (const member of response.data) {
                yield new index_1.TeamMember(this._api, this.orgId, this.id, member.id, member);
            }
            cursor = response.cursor;
            if (!response.data.length || !cursor)
                return;
        }
    }
}
exports.BaseTeam = BaseTeam;
