import { http, HttpResponse } from "msw";

export const connectorsListHandler =
http.get("https://raw.githubusercontent.com/wrtnlabs/connectors/refs/heads/main/connectors-list.json", () => {
  const response = {
    connectors: [
      '@wrtnio/connector-google-map',
    ],
    version: '1.0.0',
  }
  return HttpResponse.json(response);
});
