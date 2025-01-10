import { Client } from '@microsoft/microsoft-graph-client';
import { DeviceCodeCredential } from '@azure/identity';
import { TokenCredentialAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials';



// @azure/identity
const credential = new DeviceCodeCredential({
    tenantId: 'YOUR_TENANT_ID',
    clientId: 'YOUR_CLIENT_ID',
    userPromptCallback: (info) => {
      console.log(info.message);
    },
  });
  
  // @microsoft/microsoft-graph-client/authProviders/azureTokenCredentials
  const authProvider = new TokenCredentialAuthenticationProvider(credential, {
    scopes: ['User.Read'],
  });
  
  const graphClient = Client.initWithMiddleware({ authProvider: authProvider });