import { AgenticaContext } from "@agentica/core/src/context/AgenticaContext";
import { AgenticaOperation } from "@agentica/core/src/context/AgenticaOperation";
import type { ILlmSchema } from "@samchon/openapi";
import { functional, HttpError, IConnection } from "@wrtnlabs/connector-hive-api";
import type { IApplicationConnectorRetrieval } from "@wrtnlabs/connector-hive-api/lib/structures/connector/IApplicationConnectorRetrieval";
import { getRetry, groupByArray } from "./utils";

export function useEmbeddedContext<SchemaModel extends ILlmSchema.Model>() {
  const set = new Map<string, IApplicationConnectorRetrieval.IFilter>();
  return [
    (ctx: AgenticaContext<SchemaModel>) =>
      set.has(JSON.stringify(ctx.operations.array)),
    (
      ctx: AgenticaContext<SchemaModel>,
      filter: IApplicationConnectorRetrieval.IFilter,
    ) => {
      set.set(JSON.stringify(ctx.operations.array), filter);
    },
    (ctx: AgenticaContext<SchemaModel>) =>
      set.get(JSON.stringify(ctx.operations.array)),
  ] as const;
}



const retry = getRetry(3);

const embedOperation = (connection: IConnection<object | undefined>) => async <SchemaModel extends ILlmSchema.Model>(
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

export const embedContext = (connection: IConnection<object | undefined>) => async <SchemaModel extends ILlmSchema.Model>(ctx: AgenticaContext<SchemaModel>, setEmbeddedContext: (ctx: AgenticaContext<SchemaModel>, filter: IApplicationConnectorRetrieval.IFilter) => void) => {
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

  setEmbeddedContext(ctx, {
    applications: filter,
  });
};
