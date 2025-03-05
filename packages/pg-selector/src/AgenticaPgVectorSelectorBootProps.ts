import { IConnection } from "@wrtnlabs/connector-hive-api";

export interface IAgenticaPgVectorSelectorBootProps {
  connectorHiveConnection: IConnection;

  /**
   * @internal
   * @TODO apply optio
   */
  _options?: {
    cache?: {
      version:
        | number
        | {
            [key: string]: number;
          };
    };
  };
}
