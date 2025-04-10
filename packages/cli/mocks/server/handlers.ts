import { http, HttpResponse } from "msw";

export const connectorsListHandler
= http.get("https://raw.githubusercontent.com/wrtnlabs/connectors/refs/heads/fix/connector_list/connectors-list.json", () => {
  const response = {
    connectors: [
      {
        name: "@wrtnlabs/connector-google-map",
        envList: ["GOOGLE_API_KEY", "SERP_API_KEY"],
      },
    ],
    version: "1.0.0",
  };
  return HttpResponse.json(response);
});
