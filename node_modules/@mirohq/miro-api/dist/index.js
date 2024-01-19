"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tag = exports.Connector = exports.TextItem = exports.StickyNoteItem = exports.ShapeItem = exports.ImageItem = exports.FrameItem = exports.EmbedItem = exports.DocumentItem = exports.CardItem = exports.AppCardItem = exports.Item = exports.BoardMember = exports.Board = exports.TeamSettings = exports.TeamMember = exports.DataClassification = exports.BoardDataClassification = exports.Team = exports.OrganizationMember = exports.Organization = exports.MiroLowlevelApi = exports.MiroApi = exports.Miro = void 0;
const node_fetch_1 = require("node-fetch");
const api_1 = require("./api");
const storage_1 = require("./storage");
const defaultBasePath = 'https://api.miro.com';
class Miro {
    /**
     * Initializes the Miro API with the given client id and client secret
     * All options are optional and will fallback to environment variables
     * clientId: MIRO_CLIENT_ID
     * clientSecret: MIRO_CLIENT_SECRET
     * redirectUrl: MIRO_REDIRECT_URL
     * logger: MIRO_DEBUG
     */
    constructor(options) {
        const opts = options || {};
        this.clientId = opts.clientId || process.env.MIRO_CLIENT_ID || '';
        this.clientSecret = opts.clientSecret || process.env.MIRO_CLIENT_SECRET || '';
        this.redirectUrl = opts.redirectUrl || process.env.MIRO_REDIRECT_URL || '';
        this.storage = opts.storage || new storage_1.InMemoryStorage();
        this.logger = opts.logger || (process.env.MIRO_DEBUG ? console.log : undefined);
        this.httpTimeout = opts.httpTimeout;
        this.basePath = opts.basePath || defaultBasePath;
        if (!this.clientId) {
            throw new Error('miro-api: MIRO_CLIENT_ID or passing options.clientId is required');
        }
        if (!this.clientSecret) {
            throw new Error('miro-api: MIRO_CLIENT_SECRET or passing options.clientSecret is required');
        }
        if (!this.redirectUrl) {
            throw new Error('miro-api: MIRO_REDIRECT_URL or passing options.redirectUrl is required');
        }
        if (this.storage instanceof storage_1.InMemoryStorage) {
            console.warn('miro-api: Default storage is not recommended, consider using a custom storage implementation');
        }
    }
    /**
     * Returns an instance of the highlevel Miro API for the given user id
     */
    as(userId) {
        return new MiroApi(async () => await this.getAccessToken(userId), this.basePath, this.logger, this.httpTimeout);
    }
    /**
     * Checks if the given user id already has token stored
     */
    async isAuthorized(userId) {
        try {
            return !!(await this.getAccessToken(userId));
        }
        catch (err) {
            return false;
        }
    }
    /**
     * Returns a URL that user should be redirected to in order to authorize the application, accepts an optional state argument and a teamId that will be used as a default
     */
    getAuthUrl(state, teamId) {
        const authorizeUrl = new URL('/oauth/authorize', this.basePath.replace('api.', ''));
        authorizeUrl.search = new URLSearchParams({
            response_type: 'code',
            client_id: this.clientId,
            redirect_uri: this.redirectUrl,
            team_id: teamId || '',
            state: state || '',
        }).toString();
        return authorizeUrl.toString();
    }
    /**
     * Parse request to extract authorization code and get access token
     */
    async handleAuthorizationCodeRequest(userId, req) {
        const url = `http://${req.headers.host}${req.url}`;
        await this.exchangeCodeForAccessToken(userId, url);
    }
    /**
     * Exchanges the authorization code for an access token by calling the token endpoint
     * It will store the token information in storage for later reuse
     */
    async exchangeCodeForAccessToken(userId, urlOrCode) {
        let code = urlOrCode;
        if (urlOrCode.indexOf('?') >= 0) {
            const params = new URLSearchParams(urlOrCode.match(/\?.*/)?.[0]);
            const codeInParams = params.get('code');
            if (codeInParams) {
                code = codeInParams;
            }
        }
        if (!code) {
            throw new Error('No code provided');
        }
        return await this.getToken(userId, {
            code: code,
            client_id: this.clientId,
            client_secret: this.clientSecret,
            redirect_uri: this.redirectUrl,
            grant_type: 'authorization_code',
        });
    }
    /**
     * Exchanges the authorization code for an access token by calling the token endpoint
     * It will store the token information in storage for later reuse
     */
    async revokeToken(userId) {
        await this.as(userId).revokeToken();
        await this.storage.set(userId, undefined);
    }
    async getToken(userId, params) {
        const tokenUrl = new URL('/v1/oauth/token', defaultBasePath);
        tokenUrl.search = new URLSearchParams(params).toString();
        const response = await (0, node_fetch_1.default)(tokenUrl.toString(), { method: 'post' });
        if (!response.ok) {
            throw new api_1.HttpError(response, {}, response.status);
        }
        const body = (await response.json());
        this.storage.set(userId, {
            accessToken: body.access_token,
            refreshToken: body.refresh_token,
            tokenExpiresAt: body.expires_in ? new Date(Date.now() + (body.expires_in - 120) * 1000).toISOString() : undefined,
            userId: body.user_id,
        });
        return body.access_token;
    }
    async refreshAccessToken(userId, refresh_token) {
        return await this.getToken(userId, {
            client_id: this.clientId,
            client_secret: this.clientSecret,
            refresh_token: refresh_token,
            grant_type: 'refresh_token',
        });
    }
    async getAccessToken(userId) {
        const state = await this.storage.get(userId);
        if (!state || !state.accessToken) {
            throw new Error('No access token stored, run exchangeCodeForAccessToken() first');
        }
        if (state.refreshToken && state.tokenExpiresAt && new Date(state.tokenExpiresAt) < new Date()) {
            return this.refreshAccessToken(userId, state.refreshToken);
        }
        return state.accessToken;
    }
}
exports.Miro = Miro;
const index_1 = require("./highlevel/index");
class MiroApi extends index_1.Api {
    constructor(accessToken, basePath = defaultBasePath, logger, httpTimeout) {
        super(new api_1.MiroApi(accessToken, basePath, logger, httpTimeout), {});
    }
}
exports.MiroApi = MiroApi;
var api_2 = require("./api");
Object.defineProperty(exports, "MiroLowlevelApi", { enumerable: true, get: function () { return api_2.MiroApi; } });
var index_2 = require("./highlevel/index");
Object.defineProperty(exports, "Organization", { enumerable: true, get: function () { return index_2.Organization; } });
Object.defineProperty(exports, "OrganizationMember", { enumerable: true, get: function () { return index_2.OrganizationMember; } });
Object.defineProperty(exports, "Team", { enumerable: true, get: function () { return index_2.Team; } });
Object.defineProperty(exports, "BoardDataClassification", { enumerable: true, get: function () { return index_2.BoardDataClassification; } });
Object.defineProperty(exports, "DataClassification", { enumerable: true, get: function () { return index_2.DataClassification; } });
Object.defineProperty(exports, "TeamMember", { enumerable: true, get: function () { return index_2.TeamMember; } });
Object.defineProperty(exports, "TeamSettings", { enumerable: true, get: function () { return index_2.TeamSettings; } });
Object.defineProperty(exports, "Board", { enumerable: true, get: function () { return index_2.Board; } });
Object.defineProperty(exports, "BoardMember", { enumerable: true, get: function () { return index_2.BoardMember; } });
Object.defineProperty(exports, "Item", { enumerable: true, get: function () { return index_2.Item; } });
Object.defineProperty(exports, "AppCardItem", { enumerable: true, get: function () { return index_2.AppCardItem; } });
Object.defineProperty(exports, "CardItem", { enumerable: true, get: function () { return index_2.CardItem; } });
Object.defineProperty(exports, "DocumentItem", { enumerable: true, get: function () { return index_2.DocumentItem; } });
Object.defineProperty(exports, "EmbedItem", { enumerable: true, get: function () { return index_2.EmbedItem; } });
Object.defineProperty(exports, "FrameItem", { enumerable: true, get: function () { return index_2.FrameItem; } });
Object.defineProperty(exports, "ImageItem", { enumerable: true, get: function () { return index_2.ImageItem; } });
Object.defineProperty(exports, "ShapeItem", { enumerable: true, get: function () { return index_2.ShapeItem; } });
Object.defineProperty(exports, "StickyNoteItem", { enumerable: true, get: function () { return index_2.StickyNoteItem; } });
Object.defineProperty(exports, "TextItem", { enumerable: true, get: function () { return index_2.TextItem; } });
Object.defineProperty(exports, "Connector", { enumerable: true, get: function () { return index_2.Connector; } });
Object.defineProperty(exports, "Tag", { enumerable: true, get: function () { return index_2.Tag; } });
exports.default = Miro;
