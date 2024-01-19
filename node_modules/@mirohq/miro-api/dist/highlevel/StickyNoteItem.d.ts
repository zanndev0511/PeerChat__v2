import { StickyNoteItem } from '../model/stickyNoteItem';
import { ConnectTo } from './Item';
export declare abstract class BaseStickyNoteItem extends StickyNoteItem implements ConnectTo {
    type: 'sticky_note';
    /** @group Methods */
    connectTo: (endItem: string | number | import("../api").ItemConnectionCreationData, connectorCreationData?: import("../api").ConnectorCreationData | undefined) => Promise<import(".").Connector>;
}
