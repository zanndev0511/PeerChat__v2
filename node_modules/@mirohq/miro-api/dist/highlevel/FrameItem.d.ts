import { FrameItem } from '../model/frameItem';
import { MiroApi } from '../api';
import { WidgetItem } from './Item';
/** @hidden */
export declare abstract class BaseFrameItem extends FrameItem {
    abstract _api: MiroApi;
    abstract id: string;
    abstract boardId: string;
    /**
     * Retrieves a list of items within a specific frame. A frame is a parent item and all items within a frame are child items.<br/><h3>Required scope</h3> <a target=_blank href=https://developers.miro.com/reference/scopes>boards:read</a> <br/><h3>Rate limiting</h3> <a target=_blank href=https://developers.miro.com/reference/ratelimiting>Level 2</a><br/>
     * Returns an iterator which will automatically paginate and fetch all available items
     * @summary Get items within frame
     */
    getAllItems(query?: Omit<Parameters<MiroApi['getItemsWithinFrame']>[2], 'cursor'>): AsyncGenerator<WidgetItem, void>;
}
