import { ImageUpdateRequest, MiroApi } from '../api';
import { ImageItem } from '../model/imageItem';
import { WidgetCreateWithBufferRequest } from './Board';
import { ConnectTo } from './Item';
declare type WidgetUpdateWithBufferRequest = Partial<WidgetCreateWithBufferRequest>;
export declare abstract class BaseImageItem extends ImageItem implements ConnectTo {
    abstract _api: MiroApi;
    abstract boardId: string;
    type: 'image';
    /** @group Methods */
    connectTo: (endItem: string | number | import("../api").ItemConnectionCreationData, connectorCreationData?: import("../api").ConnectorCreationData | undefined) => Promise<import(".").Connector>;
    /**
     * Updates an image item on a board.<br/><h3>Required scope</h3> <a target=_blank href=https://developers.miro.com/reference/scopes>boards:write</a> <br/><h3>Rate limiting</h3> <a target=_blank href=https://developers.miro.com/reference/ratelimiting>Level 2</a><br/>
     *
     * This method can be used to update the image item with a new URL or from an image file.
     *
     * @summary Update image item
     * @param request If request.data.url is set then the URL will be used to create an image otherwise contents of a request.data.data will be uploaded and used to create an image
     */
    update(request: ImageUpdateRequest | WidgetUpdateWithBufferRequest): Promise<void>;
}
export {};
