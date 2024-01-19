import { ShapeItem } from '../model/shapeItem';
import { ConnectTo } from './Item';
export declare abstract class BaseShapeItem extends ShapeItem implements ConnectTo {
    type: 'shape';
    /** @group Methods */
    connectTo: (endItem: string | number | import("../api").ItemConnectionCreationData, connectorCreationData?: import("../api").ConnectorCreationData | undefined) => Promise<import(".").Connector>;
}
