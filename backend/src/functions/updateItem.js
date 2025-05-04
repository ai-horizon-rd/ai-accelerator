const { app } = require("@azure/functions");
const { CosmosClient } = require("@azure/cosmos");
const { DefaultAzureCredential } = require("@azure/identity");

const endpoint = process.env["AZURE_COSMOS_RESOURCEENDPOINT"];
const databaseName = "AcelleratorDB";

app.http("updateItem", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    try {
      const item = JSON.parse(request.params.item);
      const containerName = request.params.container;
      const itemId = request.params.itemId;

      const credential = new DefaultAzureCredential();
      const client = new CosmosClient({
        endpoint,
        aadCredentials: credential,
      });
      const database = client.database(databaseName);
      const container = database.container(containerName);

      const { resource } = await container.item(itemId, itemId).read();

      const header = request.headers.get("x-ms-client-principal");
      const encoded = Buffer.from(header, "base64");
      const decoded = encoded.toString("ascii");
      const user = JSON.parse(decoded);

      if (!user.userId || resource.owner !== user.userId)
        return { status: 401 };

      const newResource = { ...resource, ...item, owner: user.userId };

      await container.item(itemId, itemId).replace(newResource);
      return { status: 200 };
    } catch (e) {
      context.log(e);
      return { status: 500, body: "Error!" };
    }
  },
});
