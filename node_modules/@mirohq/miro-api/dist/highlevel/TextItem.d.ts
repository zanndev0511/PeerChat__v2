import { TextItem } from '../model/textItem';
import { ConnectTo } from './Item';
export declare abstract class BaseTextItem extends TextItem implements ConnectTo {
    type: 'text';
    /** @group Methods */
    connectTo: (endItem: string | number | import("../api").ItemConnectionCreationData, connectorCreationData?: import("../api").ConnectorCreationData | undefined) => Promise<import(".").Connector>;
}
