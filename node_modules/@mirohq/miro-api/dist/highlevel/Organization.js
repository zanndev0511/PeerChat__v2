"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseOrganization = void 0;
const organization_1 = require("../model/organization");
const index_1 = require("./index");
/** @hidden */
class BaseOrganization extends organization_1.Organization {
    /**
     * Retrieves organization members based on the organization ID and the cursor, or based on the user emails provided in the request.<br/><h3>Required scope</h3> <a target=_blank href=https://developers.miro.com/reference/scopes>organizations:read</a> <br/><h3>Rate limiting</h3> <a target=_blank href=https://developers.miro.com/reference/ratelimiting>Level 3</a> <br/><h3>Enterprise only</h3> <p>This API is available only for <a target=_blank href=\"/reference/api-reference#enterprise-plan\">Enterprise plan</a> users.</p>
     *
     * Returns an iterator which will automatically paginate and fetch all available resources
     * @summary Get organization members
     * @param query query to be used for organization members retrieval
     */
    async *getAllOrganizationMembers(query) {
        let cursor = undefined;
        while (true) {
            const response = (await this._api.enterpriseGetOrganizationMembers(this.id.toString(), { ...query, cursor })).body;
            for (const item of response.data || []) {
                yield new index_1.OrganizationMember(this._api, this.id, item.id, item);
            }
            cursor = response.cursor;
            if (!response.data?.length || !cursor)
                return;
        }
    }
    /**
     * Retrieves list of all teams in an existing organization.<br/><h3>Required scope</h3> <a target=_blank href=https://developers.miro.com/reference/scopes>organizations:teams:read</a> <br/><h3>Rate limiting</h3> <a target=_blank href=https://developers.miro.com/reference/ratelimiting>Level 1</a> <br/><h3>Enterprise only</h3> <p>This API is available only for <a target=_blank href=\"/reference/api-reference#enterprise-plan\">Enterprise plan</a> users.</p>
     *
     * Returns an iterator which will automatically paginate and fetch all available resources
     * @summary List teams
     * @param query.limit Limit of teams in result list
     * @param query.filterQuery Filtering query
     */
    async *getAllTeams(query) {
        const result = (await this._api.enterpriseGetTeams(this.id.toString(), query)).body;
        for (const team of result.data) {
            yield new index_1.Team(this._api, this.id, team.id, team);
        }
    }
}
exports.BaseOrganization = BaseOrganization;
