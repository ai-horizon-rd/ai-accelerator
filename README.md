# Serverless AI Accelerator

This **Serverless AI Accelerator**, developed by **aihorizon R&D** in collaboration with **Microsoft's Tech for Social Impact Team**, is specifically designed with affordability and cost efficiency in mind, catering particularly to organizations within the non-profit and education sectors. It provides a secure and scalable solution for integrating AI services into static web applications. The accelerator utilizes Azure Functions for backend processes, Azure Static Web Apps for frontend hosting, and employs an ARM template to automate the provisioning of essential Azure resources.

## Architecture Diagram

![architecture-diagram](https://github.com/user-attachments/assets/8ccd6795-a368-49c5-bb72-7d78daf1d146)

## Project Structure

- **`backend/`**: Contains the backend implementation using Azure Functions.
- **`frontend/`**: Contains the frontend code for the Azure Static Web App.
- **`resource_template/`**: Contains the ARM template for deploying Azure resources.

## Prerequisites

Before deploying the project, ensure you have the following:

1. An active [Azure Subscription](https://azure.microsoft.com/free/).
2. [Azure CLI](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli) installed and authenticated.
3. [Node.js](https://nodejs.org/) installed for local development.
4. A `.env` file with the following environment variables:
   - `AZURE_OPENAI_ENDPOINT`
   - `AI_SEARCH_API_KEY`

## Deployment Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-repo/azure-ai-accelerator.git
cd azure-ai-accelerator
```

### 2. Deploy Azure Resources

Navigate to the `resource_template/` directory and deploy the ARM template:

```bash
cd resource_template
az deployment group create --resource-group <RESOURCE_GROUP_NAME> --template-file template.json
```

Replace `<RESOURCE_GROUP_NAME>` with the name of your Azure resource group.

If you prefer deploying the project using the Azure Portal, follow these steps:

1. Log in to the [Azure Portal](https://portal.azure.com/).
2. Navigate to **Resource Groups** and create a new resource group (or use an existing one).
3. Go to **Deploy a custom template** in the Azure Portal.
4. Upload the `template.json` file from the `resource_template/` directory.
5. Follow the prompts to configure the deployment, such as selecting the resource group and providing required parameters.
6. Click **Review + Create** and then **Create** to deploy the resources.

### 3. Deploy the Backend (Azure Functions)

Navigate to the `backend/` directory and deploy the Azure Functions:

```bash
cd ../backend
func azure functionapp publish <FUNCTION_APP_NAME>
```

Replace `<FUNCTION_APP_NAME>` with the name of your Azure Function App.

### 4. Deploy the Frontend (Azure Static Web App)

Navigate to the `frontend/` directory to build and deploy the static web app:

```bash
cd ../frontend
npm run build
az staticwebapp upload \
    --name <STATIC_WEB_APP_NAME> \
    --resource-group <RESOURCE_GROUP_NAME> \
    --source ./dist
```

Replace `<STATIC_WEB_APP_NAME>` and `<RESOURCE_GROUP_NAME>` with appropriate values.

### 5. Configure Azure AI Search

To enable Azure AI Search, set up the following components:

1. **Blob Storage**: Use the deployed blob storage as the data source and upload your documents.
2. **Index**: Define the schema for the searchable data.
3. **Skillset**: Enhance the data during indexing using AI-powered capabilities.
4. **Indexer**: Automate the data ingestion process into the index.
   To ensure the indexer functions correctly, update the `"dataSourceName"` field in the indexer configuration file to match the name of your Azure Blob Storage data source. For example:

   ```json
   "dataSourceName": "<azureblob-datasource>"
   ```

Sample JSON configuration files for these components are available in the `rag_templates` folder. Use the Azure Portal to create and configure these resources. Once configured (and after data is uploaded), run the indexer to populate the index with your data. Please be aware that these templates should be adapted depending on your content.

### 6. Configure Environment Variables

Set the required environment variables in the Azure portal for both the Function App and Static Web App:

- `AZURE_OPENAI_ENDPOINT`
- `AZURE_OPENAI_API_VERSION`
- `AI_SEARCH_API_KEY`
- `AI_SEARCH_ENDPOINT`
- `AI_SEARCH_INDEX`

### 7. Test the Application

Access the deployed Static Web App URL (provided by Azure) and test the AI Accelerator functionality.

### 8. Automate Deployment with DevOps

To streamline the deployment process, consider implementing DevOps automation using tools like **GitHub Actions** or **Azure DevOps Pipelines**. Below is an example of how you can automate the deployment:

#### Set Up a CI/CD Pipeline

- Use a pipeline to automate the build and deployment of the backend, frontend, and Azure resources.

#### Example GitHub Actions Workflow

Create a `.github/workflows/deploy.yml` file with the following content:

```yaml
name: Deploy AI Accelerator

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "16"

      - name: Install Azure CLI
        uses: azure/CLI@v1

      - name: Login to Azure
        uses: azure/login@v1
        with:
          creds: ${{ secrets.AZURE_CREDENTIALS }}

      - name: Deploy Azure Resources
        run: |
          cd resource_template
          az deployment group create --resource-group ${{ secrets.RESOURCE_GROUP_NAME }} --template-file template.json

      - name: Deploy Backend
        run: |
          cd ../backend
          func azure functionapp publish ${{ secrets.FUNCTION_APP_NAME }}

      - name: Deploy Frontend
        run: |
          cd ../frontend
          npm install
          npm run build
          az staticwebapp upload \
            --name ${{ secrets.STATIC_WEB_APP_NAME }} \
            --resource-group ${{ secrets.RESOURCE_GROUP_NAME }} \
            --source ./dist
```

#### Store Secrets

Add the following secrets to your repository:

- `AZURE_CREDENTIALS`: Azure service principal credentials in JSON format.
- `RESOURCE_GROUP_NAME`: Name of the Azure resource group.
- `FUNCTION_APP_NAME`: Name of the Azure Function App.
- `STATIC_WEB_APP_NAME`: Name of the Azure Static Web App.

## Features

- **Serverless Backend**: Powered by Azure Functions for scalable and cost-effective API hosting.
- **Static Frontend**: Deployed using Azure Static Web Apps for fast and secure delivery.
- **AI Integration**: Leverages Azure OpenAI and Azure Cognitive Search for intelligent responses.
- **Infrastructure as Code**: ARM template for consistent and repeatable deployments.

## Contributing

Feel free to fork this repository and submit pull requests for improvements or bug fixes.
