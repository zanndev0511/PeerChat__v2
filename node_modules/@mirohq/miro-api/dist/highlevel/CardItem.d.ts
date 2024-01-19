import { CardItem } from '../model/cardItem';
import { ConnectTo } from './Item';
export declare abstract class BaseCardItem extends CardItem implements ConnectTo {
    type: 'card';
    /** @group Methods */
    connectTo: (endItem: string | number | import("../api").ItemConnectionCreationData, connectorCreationData?: import("../api").ConnectorCreationData | undefined) => Promise<import(".").Connector>;
}
