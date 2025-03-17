import { setupServer } from "msw/node";
import { connectorsListHandler } from "./handlers";

const handlers = [connectorsListHandler];

const server = setupServer(...handlers);

process.once("SIGINT", () => server.close());
process.once("SIGTERM", () => server.close());

export const mockServer = server;
