import { mockServer } from "./mocks/server";

const ALLOW_REGEX_LIST = [
  /https:\/\/api\.github\.com\/repos/,
];

beforeAll(() => mockServer.listen({
  onUnhandledRequest(req, print) {
    /* Allow requests */
    if (ALLOW_REGEX_LIST.some(regex => regex.test(req.url))) {
      return;
    }

    /* Deny requests */
    print.error();
  },
}));
afterEach(() => mockServer.resetHandlers());
afterAll(() => mockServer.close());
