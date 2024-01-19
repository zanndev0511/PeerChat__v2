import type { ConnectorCreationData } from '../model/connectorCreationData';
import type { ItemConnectionCreationData } from '../model/itemConnectionCreationData';
import { GenericItem } from '../model/genericItem';
import { MiroApi } from '../api';
import { Connector, AppCardItem, CardItem, DocumentItem, EmbedItem, FrameItem, ImageItem, ShapeItem, StickyNoteItem, TextItem, Item } from '.';
export declare type WidgetItem = Item | AppCardItem | CardItem | DocumentItem | EmbedItem | FrameItem | ImageItem | ShapeItem | StickyNoteItem | TextItem;
export interface ConnectTo {
    /**
     * Create a new connector between the current item and some other item
     * @param {string | number | Object} endItem Item that the new connector will connect to
     * @param {Object=} connectorCreationData
     * @return {Promise}
     */
    connectTo(endItem: string | number | ItemConnectionCreationData, connectorCreationData?: ConnectorCreationData): Promise<Connector>;
}
/** @hidden */
export declare abstract class ConnectableItem implements ConnectTo {
    abstract _api: MiroApi;
    abstract boardId: string;
    abstract id: string;
    connectTo(endItem: string | number | ItemConnectionCreationData, connectorCreationData?: ConnectorCreationData): Promise<Connector>;
}
export declare abstract class BaseItem extends GenericItem implements ConnectTo {
    static fromGenericItem(api: MiroApi, boardId: string, item: GenericItem): WidgetItem;
    /** @group Methods */
    connectTo: (endItem: string | number | ItemConnectionCreationData, connectorCreationData?: ConnectorCreationData | undefined) => Promise<Connector>;
}
