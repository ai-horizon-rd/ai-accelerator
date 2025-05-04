const { app } = require("@azure/functions");
const { CosmosClient } = require("@azure/cosmos");
const { DefaultAzureCredential } = require("@azure/identity");

const endpoint = process.env["AZURE_COSMOS_RESOURCEENDPOINT"];
const databaseName = "AcelleratorDB";

app.http("readItems", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    try {
      const containerName = request.params.container;

      const header = request.headers.get("x-ms-client-principal");
      const encoded = Buffer.from(header, "base64");
      const decoded = encoded.toString("ascii");

      const user = JSON.parse(decoded);
      if (!user.userId) return { status: 401 };

      const credential = new DefaultAzureCredential();
      const client = new CosmosClient({
        endpoint,
        aadCredentials: credential,
      });
      const database = client.database(databaseName);
      const container = database.container(containerName);

      const querySpec = {
        query: `SELECT * FROM ${containerName} c WHERE c.owner = @userId ORDER BY c.createdAt DESC`,
        parameters: [{ name: "@userId", value: user.userId }],
      };

      const { resources } = await container.items.query(querySpec).fetchAll();

      return { status: 200, body: JSON.stringify(resources) };
    } catch (e) {
      context.log(e);
      return { status: 500, body: "Error!" };
    }
  },
});
