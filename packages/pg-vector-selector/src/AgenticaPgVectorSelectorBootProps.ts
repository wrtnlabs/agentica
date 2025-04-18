import type { IConnection } from "@wrtnlabs/connector-hive-api";

export interface IAgenticaPgVectorSelectorBootProps {
  connectorHiveConnection: IConnection;

  /**
   * @internal
   * @TODO apply options
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
