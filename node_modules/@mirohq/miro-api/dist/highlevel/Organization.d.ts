import { Organization } from '../model/organization';
import { OrganizationMember, Team } from './index';
import { MiroApi } from '../api';
/** @hidden */
export declare abstract class BaseOrganization extends Organization {
    abstract _api: MiroApi;
    /**
     * Retrieves organization members based on the organization ID and the cursor, or based on the user emails provided in the request.<br/><h3>Required scope</h3> <a target=_blank href=https://developers.miro.com/reference/scopes>organizations:read</a> <br/><h3>Rate limiting</h3> <a target=_blank href=https://developers.miro.com/reference/ratelimiting>Level 3</a> <br/><h3>Enterprise only</h3> <p>This API is available only for <a target=_blank href=\"/reference/api-reference#enterprise-plan\">Enterprise plan</a> users.</p>
     *
     * Returns an iterator which will automatically paginate and fetch all available resources
     * @summary Get organization members
     * @param query query to be used for organization members retrieval
     */
    getAllOrganizationMembers(query: Omit<Parameters<MiroApi['enterpriseGetOrganizationMembers']>[1], 'offset'>): AsyncGenerator<OrganizationMember, void>;
    /**
     * Retrieves list of all teams in an existing organization.<br/><h3>Required scope</h3> <a target=_blank href=https://developers.miro.com/reference/scopes>organizations:teams:read</a> <br/><h3>Rate limiting</h3> <a target=_blank href=https://developers.miro.com/reference/ratelimiting>Level 1</a> <br/><h3>Enterprise only</h3> <p>This API is available only for <a target=_blank href=\"/reference/api-reference#enterprise-plan\">Enterprise plan</a> users.</p>
     *
     * Returns an iterator which will automatically paginate and fetch all available resources
     * @summary List teams
     * @param query.limit Limit of teams in result list
     * @param query.filterQuery Filtering query
     */
    getAllTeams(query: Parameters<MiroApi['enterpriseGetTeams']>[1]): AsyncGenerator<Team, void>;
}
