const { app } = require("@azure/functions");
const dotenv = require("dotenv");
const { SearchClient, AzureKeyCredential } = require("@azure/search-documents");

dotenv.config();

const searchApiEndpoint = process.env["AZURE_AISEARCH_ENDPOINT"];
const searchApiKey = process.env["AZURE_AISEARCH_KEY"];
const searchIndex = process.env["AZURE_AISEARCH_INDEX"];

// This function can be used to search the Azure AI Search index using the Azure Search client
// In this project, it has no connection to the frontend yet

app.http("aiSearch", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    try {
      const requestMessage = request.params.message;

      const searchClient = new SearchClient(
        searchApiEndpoint,
        searchIndex,
        new AzureKeyCredential(searchApiKey)
      );
      const searchResults = await searchClient.search(requestMessage, {
        // top: 5, //Limit the number of results returned
        // select: ["chunk", "title"], //Select specific fields to return
      });
      const searchResultArray = [];
      for await (const result of searchResults.results) {
        searchResultArray.push(result);
      }

      return { body: JSON.stringify(searchResultArray) };
    } catch (e) {
      context.log(e);
      return { status: 500, body: "Error!" };
    }
  },
});
