import { AppCardItem } from '../model/appCardItem';
import { ConnectTo } from './Item';
export declare abstract class BaseAppCardItem extends AppCardItem implements ConnectTo {
    type: 'app_card';
    /** @group Methods */
    connectTo: (endItem: string | number | import("../api").ItemConnectionCreationData, connectorCreationData?: import("../api").ConnectorCreationData | undefined) => Promise<import(".").Connector>;
}
