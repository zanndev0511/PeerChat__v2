import { Logger } from './api';
import { Storage } from './storage';
export declare class Miro {
    clientId: string;
    clientSecret: string;
    redirectUrl: string;
    storage: Storage;
    logger?: (l: any) => void;
    httpTimeout?: number;
    basePath: string;
    /**
     * Initializes the Miro API with the given client id and client secret
     * All options are optional and will fallback to environment variables
     * clientId: MIRO_CLIENT_ID
     * clientSecret: MIRO_CLIENT_SECRET
     * redirectUrl: MIRO_REDIRECT_URL
     * logger: MIRO_DEBUG
     */
    constructor(options?: MiroOptions);
    /**
     * Returns an instance of the highlevel Miro API for the given user id
     */
    as(userId: ExternalUserId): MiroApi;
    /**
     * Checks if the given user id already has token stored
     */
    isAuthorized(userId: ExternalUserId): Promise<boolean>;
    /**
     * Returns a URL that user should be redirected to in order to authorize the application, accepts an optional state argument and a teamId that will be used as a default
     */
    getAuthUrl(state?: string, teamId?: string): string;
    /**
     * Parse request to extract authorization code and get access token
     */
    handleAuthorizationCodeRequest(userId: ExternalUserId, req: Request): Promise<void>;
    /**
     * Exchanges the authorization code for an access token by calling the token endpoint
     * It will store the token information in storage for later reuse
     */
    exchangeCodeForAccessToken(userId: ExternalUserId, urlOrCode: string): Promise<string>;
    /**
     * Exchanges the authorization code for an access token by calling the token endpoint
     * It will store the token information in storage for later reuse
     */
    revokeToken(userId: ExternalUserId): Promise<void>;
    getToken(userId: ExternalUserId, params: {
        [key: string]: string;
    }): Promise<string>;
    private refreshAccessToken;
    getAccessToken(userId: ExternalUserId): Promise<string>;
}
export declare type ExternalUserId = string | number;
interface Request {
    url?: string | undefined;
    headers: {
        host?: string | undefined;
    };
}
export interface MiroOptions {
    /** App Client id. Defaults to MIRO_CLIENT_ID environment variable */
    clientId?: string;
    /** App Client secret. Defaults to MIRO_CLIENT_SECRET environment variable */
    clientSecret?: string;
    /** App redirect URL, should match the one configured in the Miro App settings page. Defaults to MIRO_REDIRECT_URL environment variable */
    redirectUrl?: string;
    /** Implementation of storage to use for access and refresh tokens */
    storage?: Storage;
    /** Function to use as a logger. if MIRO_DEBUG environment variable is set then console.log will be used here */
    logger?: (l: any) => void;
    /** Client will abort HTTP requests that last longer than this number of miliseconds. Default is 5000ms. */
    httpTimeout?: number;
    /** Base path **/
    basePath?: string;
}
import { Api as HighlevelApi } from './highlevel/index';
export declare class MiroApi extends HighlevelApi {
    constructor(accessToken: string | (() => Promise<string>), basePath?: string, logger?: Logger, httpTimeout?: number);
}
export { MiroApi as MiroLowlevelApi } from './api';
export { Organization, OrganizationMember, Team, BoardDataClassification, DataClassification, TeamMember, TeamSettings, Board, BoardMember, Item, AppCardItem, CardItem, DocumentItem, EmbedItem, FrameItem, ImageItem, ShapeItem, StickyNoteItem, TextItem, Connector, Tag, } from './highlevel/index';
export default Miro;
