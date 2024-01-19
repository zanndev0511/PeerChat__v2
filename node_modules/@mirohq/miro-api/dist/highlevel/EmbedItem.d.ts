import { EmbedItem } from '../model/embedItem';
import { ConnectTo } from './Item';
export declare abstract class BaseEmbedItem extends EmbedItem implements ConnectTo {
    type: 'embed';
    /** @group Methods */
    connectTo: (endItem: string | number | import("../api").ItemConnectionCreationData, connectorCreationData?: import("../api").ConnectorCreationData | undefined) => Promise<import(".").Connector>;
}
