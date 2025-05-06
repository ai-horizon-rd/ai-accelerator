const { app } = require("@azure/functions");
const {
  DefaultAzureCredential,
  getBearerTokenProvider,
} = require("@azure/identity");
const { AzureOpenAI } = require("openai");
const dotenv = require("dotenv");

dotenv.config();

const endpoint = process.env["AZURE_OPENAI_ENDPOINT"];
const apiVersion = process.env["AZURE_OPENAI_API_VERSION"];

const searchEndpoint = process.env["AI_SEARCH_ENDPOINT"];
const searchApiKey = process.env["AI_SEARCH_API_KEY"];
const searchIndex = process.env["AI_SEARCH_INDEX"];

app.http("openai", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    try {
      const requestMessage = request.params.message;
      const requestConversation = JSON.parse(request.params.conversation);
      const requestConfig = JSON.parse(request.params.config);
      const deployment = request?.params?.model || "gpt-4o";

      const messageArray = requestConversation
        .map((x) => ({
          role: x.from === "gpt" ? "assistant" : "user",
          content: x.message,
        }))
        .reverse();
      messageArray.push({ role: "user", content: requestMessage });

      const completionObject = {
        messages: messageArray,
        max_tokens: 4096,
        temperature: parseFloat(requestConfig?.temperature) || 0.7,
        top_p: parseFloat(requestConfig?.top_p || 0.95),
        frequency_penalty: parseFloat(requestConfig?.frequency_penalty) || 0,
        presence_penalty: parseFloat(requestConfig?.presence_penalty) || 0,
        stop: null,
        data_sources: [
          {
            type: "azure_search",
            parameters: {
              endpoint: searchEndpoint,
              index_name: searchIndex,
              authentication: {
                type: "api_key",
                key: searchApiKey,
              },
              strictness: 1,
            },
          },
        ],
      };

      const credential = new DefaultAzureCredential();
      const scope = "https://cognitiveservices.azure.com/.default";
      const azureADTokenProvider = getBearerTokenProvider(credential, scope);

      const client = new AzureOpenAI({
        endpoint,
        azureADTokenProvider,
        deployment,
        apiVersion,
      });

      const response = await client.chat.completions.create(completionObject);

      return { body: JSON.stringify(response) };
    } catch (e) {
      context.log(e);
      return { status: 500, body: "Error!" };
    }
  },
});
