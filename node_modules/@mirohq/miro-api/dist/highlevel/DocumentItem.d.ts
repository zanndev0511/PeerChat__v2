import { DocumentUpdateRequest, MiroApi } from '../api';
import { DocumentItem } from '../model/documentItem';
import { WidgetCreateWithBufferRequest } from './Board';
import { ConnectTo } from './Item';
declare type WidgetUpdateWithBufferRequest = Partial<WidgetCreateWithBufferRequest>;
export declare abstract class BaseDocumentItem extends DocumentItem implements ConnectTo {
    abstract _api: MiroApi;
    abstract boardId: string;
    type: 'document';
    /** @group Methods */
    connectTo: (endItem: string | number | import("../api").ItemConnectionCreationData, connectorCreationData?: import("../api").ConnectorCreationData | undefined) => Promise<import(".").Connector>;
    /**
     * Updates a document item on a board<br/><h3>Required scope</h3> <a target=_blank href=https://developers.miro.com/reference/scopes>boards:write</a> <br/><h3>Rate limiting</h3> <a target=_blank href=https://developers.miro.com/reference/ratelimiting>Level 2</a><br/>
     *
     * This method can be used to update the document item with a new URL or from a document file.
     *
     * @summary Update document item
     * @param request If request.data.url is set then the URL will be used to create a document otherwise contents of a request.data.data will be uploaded and used to create a document
     */
    update(request: DocumentUpdateRequest | WidgetUpdateWithBufferRequest): Promise<void>;
}
export {};
