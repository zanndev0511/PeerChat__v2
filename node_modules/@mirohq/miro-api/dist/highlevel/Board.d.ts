/// <reference types="node" />
import { Board } from '../model/board';
import { BoardMember, Connector, DocumentItem, ImageItem, Tag } from './index';
import { MiroApi, ImageCreateRequest, DocumentCreateRequest, PositionChange, FixedRatioGeometry, Parent } from '../api';
import { WidgetItem } from './Item';
export interface WidgetCreateWithBufferRequest {
    data: {
        title?: string;
        data: Buffer | ReadableStream;
    };
    position?: PositionChange;
    geometry?: FixedRatioGeometry;
    parent?: Parent;
}
export declare function isNotUrl(r: Partial<WidgetCreateWithBufferRequest> | {
    data?: {};
}): r is WidgetCreateWithBufferRequest;
/** @hidden */
export declare abstract class BaseBoard extends Board {
    abstract _api: MiroApi;
    /**
     * Retrieves a list of items for a specific board. You can retrieve all items on the board, or a list of specific types of items by specifying URL query parameter values.<br/><h3>Required scope</h3> <a target=_blank href=https://developers.miro.com/reference/scopes>boards:read</a> <br/><h3>Rate limiting</h3> <a target=_blank href=https://developers.miro.com/reference/ratelimiting>Level 2</a><br/>
     * Returns an iterator which will automatically paginate and fetch all available items
     * @summary Get items on board
     */
    getAllItems(query?: Omit<Parameters<MiroApi['getItems']>[1], 'cursor'>): AsyncGenerator<WidgetItem, void>;
    /**
     * Get all members on the board.<br/><h3>Required scope</h3> <a target=_blank href=https://developers.miro.com/reference/scopes>boards:read</a> <br/><h3>Rate limiting</h3> <a target=_blank href=https://developers.miro.com/reference/ratelimiting>Level 1</a><br/>
  
     * Returns an iterator which will automatically paginate and fetch all available members
     * @summary Get all board members
     */
    getAllMembers(): AsyncGenerator<BoardMember, void>;
    /**
     * Retrieves all the tags from the specified board.<br/><h3>Required scope</h3> <a target=_blank href=https://developers.miro.com/reference/scopes>boards:read</a> <br/><h3>Rate limiting</h3> <a target=_blank href=https://developers.miro.com/reference/ratelimiting>Level 1</a><br/>
     *
     * Returns an iterator which will automatically paginate and fetch all available tags
     * @summary Get tags from board
     */
    getAllTags(): AsyncGenerator<Tag, void>;
    /**
     * Retrieves all connectors for a specific board.<br/><h3>Required scope</h3> <a target=_blank href=https://developers.miro.com/reference/scopes>boards:read</a> <br/><h3>Rate limiting</h3> <a target=_blank href=https://developers.miro.com/reference/ratelimiting>Level 2</a><br/>
     * Returns an iterator which will automatically paginate and fetch all available tags
     */
    getAllConnectors(): AsyncGenerator<Connector, void>;
    /**
     * Retrieves information for a specific item on a board.<br/><h3>Required scope</h3> <a target=_blank href=https://developers.miro.com/reference/scopes>boards:read</a> <br/><h3>Rate limiting</h3> <a target=_blank href=https://developers.miro.com/reference/ratelimiting>Level 1</a><br/>
     * @summary Get specific item on board
     * @param itemId [Unique identifier (ID) of the item](https://developers.miro.com/reference/rest-api-item-model) that you want to retrieve.
     */
    getItem(itemId: string): Promise<WidgetItem>;
    /**
     * Adds an image item to a board.<br/><h3>Required scope</h3> <a target=_blank href=https://developers.miro.com/reference/scopes>boards:write</a> <br/><h3>Rate limiting</h3> <a target=_blank href=https://developers.miro.com/reference/ratelimiting>Level 2</a><br/>
     *
     * This method can be used to create an image item with a new URL or from an image file.
     * @summary Create image item
     * @param request If request.data.url is set then the URL will be used to create an image otherwise contents of a request.data.data will be uploaded and used to create an image
     */
    createImageItem(request: WidgetCreateWithBufferRequest | ImageCreateRequest): Promise<ImageItem>;
    /**
     * Adds a document item to a board.<br/><h3>Required scope</h3> <a target=_blank href=https://developers.miro.com/reference/scopes>boards:write</a> <br/><h3>Rate limiting</h3> <a target=_blank href=https://developers.miro.com/reference/ratelimiting>Level 2</a><br/>
     *
     * This method can be used to create a document item with a new URL or from a document file.
     * @summary Create document item
     * @param request If request.data.url is set then the URL will be used to create a document otherwise contents of a request.data.data will be uploaded and used to create a document
     */
    createDocumentItem(request: DocumentCreateRequest | WidgetCreateWithBufferRequest): Promise<DocumentItem>;
    /** @hidden */
    fileUploadRequest(type: 'images' | 'documents', request: WidgetCreateWithBufferRequest): Promise<unknown>;
}
