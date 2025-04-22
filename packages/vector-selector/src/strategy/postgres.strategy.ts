import type { AgenticaContext, AgenticaOperation } from "@agentica/core";
import type { ILlmSchema } from "@samchon/openapi";
import type { IConnection } from "@wrtnlabs/connector-hive-api";
import type { IApplicationConnectorRetrieval } from "@wrtnlabs/connector-hive-api/lib/structures/connector/IApplicationConnectorRetrieval";

import { functional, HttpError } from "@wrtnlabs/connector-hive-api";

import type { IAgenticaVectorSelectorStrategy } from "..";

import { getRetry, groupByArray } from "../utils";

const retry = getRetry(3);

const filterMap = new Map<string, IApplicationConnectorRetrieval.IFilter>();
function searchTool<SchemaModel extends ILlmSchema.Model>(connection: IConnection<object | undefined>): IAgenticaVectorSelectorStrategy<SchemaModel>["searchTool"] {
  return async (ctx: AgenticaContext<SchemaModel>, query: string) => {
    const filter = filterMap.get(JSON.stringify(ctx.operations.array));
    return retry(async () =>
      functional.connector_retrievals.createRetrievalRequest(connection, {
        query,
        limit: 10,
        filter,
      }),
    );
  };
}

function embedOperation(connection: IConnection<object | undefined>) {
  return async <SchemaModel extends ILlmSchema.Model>(
    controllerName: string,
    opList: AgenticaOperation<SchemaModel>[],
  ) => {
    const application = await retry(async () =>
      functional.applications.create(connection, {
        name: controllerName,
        description: undefined,
      }),
    ).catch(async (e) => {
      if (!(e instanceof HttpError)) {
        throw e;
      }
      if (e.status !== 409) {
        throw e;
      }

      return retry(async () =>
        functional.applications.by_names.getByName(
          connection,
          controllerName,
        ),
      );
    });

    const version = await retry(async () =>
      functional.applications.by_ids.versions.create(
        connection,
        application.id,
        {},
      ),
    );

    // concurrency request count
    await groupByArray(opList, 10).reduce(async (accPromise, cur) => {
      await accPromise;
      await Promise.all(
        cur.map(async v =>
          retry(async () =>
            functional.application_versions.by_ids.connectors.create(
              connection,
              version.id,
              { name: v.name, description: v.function.description ?? "" },
            ),
          ),
        ),
      );
      return Promise.resolve();
    }, Promise.resolve());

    return { version, applicationId: application.id };
  };
}

function embedContext<SchemaModel extends ILlmSchema.Model>(connection: IConnection<object | undefined>): IAgenticaVectorSelectorStrategy<SchemaModel>["embedContext"] {
  return async (props: { ctx: AgenticaContext<SchemaModel>; setEmbedded: () => void }) => {
    const { ctx, setEmbedded } = props;
    const filter = await Promise.all(
      Array.from(ctx.operations.group.entries()).map(
        async ([key, value]: [
          string,
          Map<string, AgenticaOperation<SchemaModel>>,
        ]) => {
          const result = await embedOperation(connection)(
            key,
            Array.from(value.values()),
          );

          return {
            id: result.applicationId,
            version: result.version.version,
            type: "byId",
          } satisfies IApplicationConnectorRetrieval.IFilterApplicationById;
        },
      ),
    );
    filterMap.set(JSON.stringify(ctx.operations.array), {
      applications: filter,
    });
    setEmbedded();
  };
}

export function configurePostgresStrategy<SchemaModel extends ILlmSchema.Model>(connection: IConnection<object | undefined>): IAgenticaVectorSelectorStrategy<SchemaModel> {
  return {
    searchTool: searchTool(connection),
    embedContext: embedContext(connection),
  };
}
