import { MiroApi } from '../api';
import { Item } from './index';
import { Tag } from '../model/tag';
/** @hidden */
export declare abstract class BaseTag extends Tag {
    abstract _api: MiroApi;
    abstract boardId: string;
    abstract id: string;
    /**
     * Retrieves all the items that have the specified tag.<br/><h3>Required scope</h3> <a target=_blank href=https://developers.miro.com/reference/scopes>boards:read</a> <br/><h3>Rate limiting</h3> <a target=_blank href=https://developers.miro.com/reference/ratelimiting>Level 1</a><br/>
     * Returns an iterator which will automatically paginate and fetch all tagged items
     * @summary Get items by tag
     */
    getAllTaggedItems(): AsyncGenerator<Item, void>;
}
