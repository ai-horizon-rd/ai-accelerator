const { app } = require("@azure/functions");
const { v4: uuidv4 } = require("uuid");
const { CosmosClient } = require("@azure/cosmos");
const { DefaultAzureCredential } = require("@azure/identity");

const endpoint = process.env["AZURE_COSMOS_RESOURCEENDPOINT"];
const databaseName = "AcelleratorDB";

app.http("createItem", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    try {
      const item = JSON.parse(request.params.item);
      const containerName = request.params.container;

      const header = request.headers.get("x-ms-client-principal");
      const encoded = Buffer.from(header, "base64");
      const decoded = encoded.toString("ascii");
      const user = JSON.parse(decoded);
      if (!user.userId) return { status: 401 };
      item.owner = user.userId;

      item.id = uuidv4();
      item.createdAt = Date.now();

      const credential = new DefaultAzureCredential();
      const client = new CosmosClient({
        endpoint,
        aadCredentials: credential,
      });
      const database = client.database(databaseName);
      const container = database.container(containerName);

      await container.items.create(item);
      return { status: 200 };
    } catch (e) {
      context.log(e);
      return { status: 500, body: "Error!" };
    }
  },
});
