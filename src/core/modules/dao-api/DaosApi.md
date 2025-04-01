# .DaosApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**addAdminToDAO**](DaosApi.md#addAdminToDAO) | **POST** /daos/{dao_id}/admins | Add an admin to a DAO
[**addMemberToDAO**](DaosApi.md#addMemberToDAO) | **POST** /daos/{dao_id}/members | Add a member to a DAO
[**addMemberToPOD**](DaosApi.md#addMemberToPOD) | **POST** /daos/{dao_id}/pods/{pod_id}/members | Add a member to a POD
[**createDAO**](DaosApi.md#createDAO) | **POST** /daos/ | Create a new DAO
[**createPOD**](DaosApi.md#createPOD) | **POST** /daos/{dao_id}/pods | Create a new POD
[**deleteDAO**](DaosApi.md#deleteDAO) | **DELETE** /daos/{dao_id} | Delete a DAO
[**deletePOD**](DaosApi.md#deletePOD) | **DELETE** /daos/{dao_id}/pods/{pod_id} | Delete a POD
[**getAllDAOs**](DaosApi.md#getAllDAOs) | **GET** /daos/ | List all DAOs
[**getAllMembersOfPOD**](DaosApi.md#getAllMembersOfPOD) | **GET** /daos/{dao_id}/pods/{pod_id}/members | Get all members of a POD
[**getAllPODsForDAO**](DaosApi.md#getAllPODsForDAO) | **GET** /daos/{dao_id}/pods | Get all PODs for a DAO
[**getChannelMessages**](DaosApi.md#getChannelMessages) | **GET** /daos/{dao_id}/pods/{pod_id}/discord-channels/{channel_id}/messages | Get messages from a specific Discord channel
[**getDAOById**](DaosApi.md#getDAOById) | **GET** /daos/{dao_id} | Get a DAO by ID
[**getPODById**](DaosApi.md#getPODById) | **GET** /daos/{dao_id}/pods/{pod_id} | Get a POD by ID
[**getPODDiscordChannels**](DaosApi.md#getPODDiscordChannels) | **GET** /daos/{dao_id}/pods/{pod_id}/discord-channels | Get all Discord channels for a POD
[**getPODFeed**](DaosApi.md#getPODFeed) | **GET** /daos/{dao_id}/pods/{pod_id}/feed | Get Discord feed for a POD
[**linkDiscordChannelToPOD**](DaosApi.md#linkDiscordChannelToPOD) | **POST** /daos/{dao_id}/pods/{pod_id}/discord-channels | Link a Discord channel to a POD
[**removeAdminFromDAO**](DaosApi.md#removeAdminFromDAO) | **DELETE** /daos/{dao_id}/admins | Remove an admin from a DAO
[**removeMemberFromDAO**](DaosApi.md#removeMemberFromDAO) | **DELETE** /daos/{dao_id}/members | Remove a member from a DAO
[**removeMemberFromPOD**](DaosApi.md#removeMemberFromPOD) | **DELETE** /daos/{dao_id}/pods/{pod_id}/members | Remove a member from a POD
[**unlinkDiscordChannelFromPOD**](DaosApi.md#unlinkDiscordChannelFromPOD) | **DELETE** /daos/{dao_id}/pods/{pod_id}/discord-channels/{channel_id} | Unlink a Discord channel from a POD
[**updateDAO**](DaosApi.md#updateDAO) | **PUT** /daos/{dao_id} | Update a DAO
[**updatePOD**](DaosApi.md#updatePOD) | **PUT** /daos/{dao_id}/pods/{pod_id} | Update a POD


# **addAdminToDAO**
> DAOMembershipResponse addAdminToDAO(dAOMembership)


### Example


```typescript
import { createConfiguration, DaosApi } from '';
import type { DaosApiAddAdminToDAORequest } from '';

const configuration = createConfiguration();
const apiInstance = new DaosApi(configuration);

const request: DaosApiAddAdminToDAORequest = {
  
  daoId: "dao_id_example",
  
  dAOMembership: {
    userId: "userId_example",
  },
};

const data = await apiInstance.addAdminToDAO(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **dAOMembership** | **DAOMembership**|  |
 **daoId** | [**string**] |  | defaults to undefined


### Return type

**DAOMembershipResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**422** | Unprocessable Entity |  -  |
**200** | User added to DAO successfully |  -  |
**400** | Bad Request |  -  |
**401** | Unauthorized |  -  |
**404** | User or DAO not found |  -  |
**0** | Default error response |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **addMemberToDAO**
> DAOMembershipResponse addMemberToDAO()


### Example


```typescript
import { createConfiguration, DaosApi } from '';
import type { DaosApiAddMemberToDAORequest } from '';

const configuration = createConfiguration();
const apiInstance = new DaosApi(configuration);

const request: DaosApiAddMemberToDAORequest = {
  
  daoId: "dao_id_example",
};

const data = await apiInstance.addMemberToDAO(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **daoId** | [**string**] |  | defaults to undefined


### Return type

**DAOMembershipResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | User added to DAO successfully |  -  |
**400** | Bad Request |  -  |
**404** | User or DAO not found |  -  |
**0** | Default error response |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **addMemberToPOD**
> PODMembershipResponse addMemberToPOD()


### Example


```typescript
import { createConfiguration, DaosApi } from '';
import type { DaosApiAddMemberToPODRequest } from '';

const configuration = createConfiguration();
const apiInstance = new DaosApi(configuration);

const request: DaosApiAddMemberToPODRequest = {
  
  daoId: "dao_id_example",
  
  podId: "pod_id_example",
};

const data = await apiInstance.addMemberToPOD(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **daoId** | [**string**] |  | defaults to undefined
 **podId** | [**string**] |  | defaults to undefined


### Return type

**PODMembershipResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | User added to POD successfully |  -  |
**400** | Bad Request - User already in POD |  -  |
**401** | Unauthorized - Invalid or missing token |  -  |
**404** | User, DAO or POD not found |  -  |
**0** | Default error response |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **createDAO**
> DAOSchemaResponse createDAO(inputCreateDAO)


### Example


```typescript
import { createConfiguration, DaosApi } from '';
import type { DaosApiCreateDAORequest } from '';

const configuration = createConfiguration();
const apiInstance = new DaosApi(configuration);

const request: DaosApiCreateDAORequest = {
  
  inputCreateDAO: {
    name: "name_example",
    description: "description_example",
    ownerId: "ownerId_example",
    discordServer: "discordServer_example",
    twitter: "twitter_example",
    telegram: "telegram_example",
    instagram: "instagram_example",
    tiktok: "tiktok_example",
    website: "website_example",
    treasury: "treasury_example",
    profile: { data: Buffer.from(fs.readFileSync('/path/to/file', 'utf-8')), name: '/path/to/file' },
    banner: { data: Buffer.from(fs.readFileSync('/path/to/file', 'utf-8')), name: '/path/to/file' },
  },
};

const data = await apiInstance.createDAO(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **inputCreateDAO** | **InputCreateDAO**|  |


### Return type

**DAOSchemaResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**422** | Unprocessable Entity |  -  |
**201** | DAO created successfully |  -  |
**400** | Bad Request - Invalid data |  -  |
**401** | Unauthorized - Invalid or missing token |  -  |
**404** | User not found |  -  |
**0** | Default error response |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **createPOD**
> PODSchemaResponse createPOD(inputCreatePOD)


### Example


```typescript
import { createConfiguration, DaosApi } from '';
import type { DaosApiCreatePODRequest } from '';

const configuration = createConfiguration();
const apiInstance = new DaosApi(configuration);

const request: DaosApiCreatePODRequest = {
  
  daoId: "dao_id_example",
  
  inputCreatePOD: {
    name: "name_example",
    description: "description_example",
    daoId: "daoId_example",
    discordChannelId: "discordChannelId_example",
  },
};

const data = await apiInstance.createPOD(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **inputCreatePOD** | **InputCreatePOD**|  |
 **daoId** | [**string**] |  | defaults to undefined


### Return type

**PODSchemaResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**422** | Unprocessable Entity |  -  |
**201** | POD created successfully |  -  |
**400** | Bad Request - Invalid data |  -  |
**401** | Unauthorized - Invalid or missing token |  -  |
**404** | User or DAO not found |  -  |
**0** | Default error response |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **deleteDAO**
> DAOSchemaResponse deleteDAO()


### Example


```typescript
import { createConfiguration, DaosApi } from '';
import type { DaosApiDeleteDAORequest } from '';

const configuration = createConfiguration();
const apiInstance = new DaosApi(configuration);

const request: DaosApiDeleteDAORequest = {
  
  daoId: "dao_id_example",
};

const data = await apiInstance.deleteDAO(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **daoId** | [**string**] |  | defaults to undefined


### Return type

**DAOSchemaResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | DAO deleted successfully |  -  |
**400** | Bad Request - Error deleting DAO |  -  |
**401** | Unauthorized - Invalid or missing token |  -  |
**404** | DAO not found |  -  |
**0** | Default error response |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **deletePOD**
> PODSchemaResponse deletePOD()


### Example


```typescript
import { createConfiguration, DaosApi } from '';
import type { DaosApiDeletePODRequest } from '';

const configuration = createConfiguration();
const apiInstance = new DaosApi(configuration);

const request: DaosApiDeletePODRequest = {
  
  daoId: "dao_id_example",
  
  podId: "pod_id_example",
};

const data = await apiInstance.deletePOD(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **daoId** | [**string**] |  | defaults to undefined
 **podId** | [**string**] |  | defaults to undefined


### Return type

**PODSchemaResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | POD deleted successfully |  -  |
**400** | Bad Request - Error deleting POD |  -  |
**401** | Unauthorized - Invalid or missing token |  -  |
**404** | User, DAO or POD not found |  -  |
**0** | Default error response |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **getAllDAOs**
> Array<DAO> getAllDAOs()


### Example


```typescript
import { createConfiguration, DaosApi } from '';

const configuration = createConfiguration();
const apiInstance = new DaosApi(configuration);

const request = {};

const data = await apiInstance.getAllDAOs(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters
This endpoint does not need any parameter.


### Return type

**Array<DAO>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | List of all DAOs |  -  |
**0** | Default error response |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **getAllMembersOfPOD**
> Array<User> getAllMembersOfPOD()


### Example


```typescript
import { createConfiguration, DaosApi } from '';
import type { DaosApiGetAllMembersOfPODRequest } from '';

const configuration = createConfiguration();
const apiInstance = new DaosApi(configuration);

const request: DaosApiGetAllMembersOfPODRequest = {
  
  daoId: "dao_id_example",
  
  podId: "pod_id_example",
};

const data = await apiInstance.getAllMembersOfPOD(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **daoId** | [**string**] |  | defaults to undefined
 **podId** | [**string**] |  | defaults to undefined


### Return type

**Array<User>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | List of all members in the POD |  -  |
**404** | DAO or POD not found |  -  |
**0** | Default error response |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **getAllPODsForDAO**
> Array<POD> getAllPODsForDAO()


### Example


```typescript
import { createConfiguration, DaosApi } from '';
import type { DaosApiGetAllPODsForDAORequest } from '';

const configuration = createConfiguration();
const apiInstance = new DaosApi(configuration);

const request: DaosApiGetAllPODsForDAORequest = {
  
  daoId: "dao_id_example",
};

const data = await apiInstance.getAllPODsForDAO(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **daoId** | [**string**] |  | defaults to undefined


### Return type

**Array<POD>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | List of all PODs for the DAO |  -  |
**401** | Unauthorized - Invalid or missing token |  -  |
**404** | User or DAO not found |  -  |
**0** | Default error response |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **getChannelMessages**
> DiscordMessagesResponse getChannelMessages()


### Example


```typescript
import { createConfiguration, DaosApi } from '';
import type { DaosApiGetChannelMessagesRequest } from '';

const configuration = createConfiguration();
const apiInstance = new DaosApi(configuration);

const request: DaosApiGetChannelMessagesRequest = {
  
  daoId: "dao_id_example",
  
  podId: "pod_id_example",
  
  channelId: "channel_id_example",
};

const data = await apiInstance.getChannelMessages(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **daoId** | [**string**] |  | defaults to undefined
 **podId** | [**string**] |  | defaults to undefined
 **channelId** | [**string**] |  | defaults to undefined


### Return type

**DiscordMessagesResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Discord messages retrieved successfully |  -  |
**400** | Bad Request - Channel not linked to this POD |  -  |
**401** | Unauthorized - Invalid or missing token |  -  |
**404** | DAO, POD or Discord channel not found |  -  |
**0** | Default error response |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **getDAOById**
> DAO getDAOById()


### Example


```typescript
import { createConfiguration, DaosApi } from '';
import type { DaosApiGetDAOByIdRequest } from '';

const configuration = createConfiguration();
const apiInstance = new DaosApi(configuration);

const request: DaosApiGetDAOByIdRequest = {
  
  daoId: "dao_id_example",
};

const data = await apiInstance.getDAOById(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **daoId** | [**string**] |  | defaults to undefined


### Return type

**DAO**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | DAO retrieved successfully |  -  |
**404** | DAO not found |  -  |
**0** | Default error response |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **getPODById**
> POD getPODById()


### Example


```typescript
import { createConfiguration, DaosApi } from '';
import type { DaosApiGetPODByIdRequest } from '';

const configuration = createConfiguration();
const apiInstance = new DaosApi(configuration);

const request: DaosApiGetPODByIdRequest = {
  
  daoId: "dao_id_example",
  
  podId: "pod_id_example",
};

const data = await apiInstance.getPODById(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **daoId** | [**string**] |  | defaults to undefined
 **podId** | [**string**] |  | defaults to undefined


### Return type

**POD**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | POD retrieved successfully |  -  |
**404** | DAO or POD not found |  -  |
**0** | Default error response |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **getPODDiscordChannels**
> DiscordChannelsResponse getPODDiscordChannels()


### Example


```typescript
import { createConfiguration, DaosApi } from '';
import type { DaosApiGetPODDiscordChannelsRequest } from '';

const configuration = createConfiguration();
const apiInstance = new DaosApi(configuration);

const request: DaosApiGetPODDiscordChannelsRequest = {
  
  daoId: "dao_id_example",
  
  podId: "pod_id_example",
};

const data = await apiInstance.getPODDiscordChannels(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **daoId** | [**string**] |  | defaults to undefined
 **podId** | [**string**] |  | defaults to undefined


### Return type

**DiscordChannelsResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Discord channels retrieved successfully |  -  |
**401** | Unauthorized - Invalid or missing token |  -  |
**404** | DAO or POD not found |  -  |
**0** | Default error response |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **getPODFeed**
> DiscordMessagesResponse getPODFeed()


### Example


```typescript
import { createConfiguration, DaosApi } from '';
import type { DaosApiGetPODFeedRequest } from '';

const configuration = createConfiguration();
const apiInstance = new DaosApi(configuration);

const request: DaosApiGetPODFeedRequest = {
  
  daoId: "dao_id_example",
  
  podId: "pod_id_example",
};

const data = await apiInstance.getPODFeed(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **daoId** | [**string**] |  | defaults to undefined
 **podId** | [**string**] |  | defaults to undefined


### Return type

**DiscordMessagesResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Discord feed retrieved successfully |  -  |
**401** | Unauthorized - Invalid or missing token |  -  |
**404** | DAO or POD not found |  -  |
**0** | Default error response |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **linkDiscordChannelToPOD**
> DiscordChannelResponse linkDiscordChannelToPOD(linkDiscordChannel)


### Example


```typescript
import { createConfiguration, DaosApi } from '';
import type { DaosApiLinkDiscordChannelToPODRequest } from '';

const configuration = createConfiguration();
const apiInstance = new DaosApi(configuration);

const request: DaosApiLinkDiscordChannelToPODRequest = {
  
  daoId: "dao_id_example",
  
  podId: "pod_id_example",
  
  linkDiscordChannel: {
    channelId: "channelId_example",
    podId: "podId_example",
  },
};

const data = await apiInstance.linkDiscordChannelToPOD(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **linkDiscordChannel** | **LinkDiscordChannel**|  |
 **daoId** | [**string**] |  | defaults to undefined
 **podId** | [**string**] |  | defaults to undefined


### Return type

**DiscordChannelResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**422** | Unprocessable Entity |  -  |
**201** | Discord channel linked successfully |  -  |
**400** | Bad Request - Invalid data |  -  |
**401** | Unauthorized - Invalid or missing token |  -  |
**404** | DAO, POD or Discord channel not found |  -  |
**0** | Default error response |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **removeAdminFromDAO**
> DAOMembershipResponse removeAdminFromDAO(dAOMembership)


### Example


```typescript
import { createConfiguration, DaosApi } from '';
import type { DaosApiRemoveAdminFromDAORequest } from '';

const configuration = createConfiguration();
const apiInstance = new DaosApi(configuration);

const request: DaosApiRemoveAdminFromDAORequest = {
  
  daoId: "dao_id_example",
  
  dAOMembership: {
    userId: "userId_example",
  },
};

const data = await apiInstance.removeAdminFromDAO(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **dAOMembership** | **DAOMembership**|  |
 **daoId** | [**string**] |  | defaults to undefined


### Return type

**DAOMembershipResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**422** | Unprocessable Entity |  -  |
**200** | User removed from DAO successfully |  -  |
**400** | Bad Request |  -  |
**401** | Unauthorized |  -  |
**404** | User or DAO not found |  -  |
**0** | Default error response |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **removeMemberFromDAO**
> DAOMembershipResponse removeMemberFromDAO(dAOMembership)


### Example


```typescript
import { createConfiguration, DaosApi } from '';
import type { DaosApiRemoveMemberFromDAORequest } from '';

const configuration = createConfiguration();
const apiInstance = new DaosApi(configuration);

const request: DaosApiRemoveMemberFromDAORequest = {
  
  daoId: "dao_id_example",
  
  dAOMembership: {
    userId: "userId_example",
  },
};

const data = await apiInstance.removeMemberFromDAO(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **dAOMembership** | **DAOMembership**|  |
 **daoId** | [**string**] |  | defaults to undefined


### Return type

**DAOMembershipResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**422** | Unprocessable Entity |  -  |
**200** | User removed from DAO successfully |  -  |
**400** | Bad Request |  -  |
**401** | Unauthorized |  -  |
**404** | User or DAO not found |  -  |
**0** | Default error response |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **removeMemberFromPOD**
> PODMembershipResponse removeMemberFromPOD(pODMembership)


### Example


```typescript
import { createConfiguration, DaosApi } from '';
import type { DaosApiRemoveMemberFromPODRequest } from '';

const configuration = createConfiguration();
const apiInstance = new DaosApi(configuration);

const request: DaosApiRemoveMemberFromPODRequest = {
  
  daoId: "dao_id_example",
  
  podId: "pod_id_example",
  
  pODMembership: {
    userId: "userId_example",
  },
};

const data = await apiInstance.removeMemberFromPOD(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **pODMembership** | **PODMembership**|  |
 **daoId** | [**string**] |  | defaults to undefined
 **podId** | [**string**] |  | defaults to undefined


### Return type

**PODMembershipResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**422** | Unprocessable Entity |  -  |
**200** | User removed from POD successfully |  -  |
**400** | Bad Request - User not in POD |  -  |
**401** | Unauthorized - Invalid or missing token |  -  |
**404** | User, DAO or POD not found |  -  |
**0** | Default error response |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **unlinkDiscordChannelFromPOD**
> DiscordChannelResponse unlinkDiscordChannelFromPOD()


### Example


```typescript
import { createConfiguration, DaosApi } from '';
import type { DaosApiUnlinkDiscordChannelFromPODRequest } from '';

const configuration = createConfiguration();
const apiInstance = new DaosApi(configuration);

const request: DaosApiUnlinkDiscordChannelFromPODRequest = {
  
  daoId: "dao_id_example",
  
  podId: "pod_id_example",
  
  channelId: "channel_id_example",
};

const data = await apiInstance.unlinkDiscordChannelFromPOD(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **daoId** | [**string**] |  | defaults to undefined
 **podId** | [**string**] |  | defaults to undefined
 **channelId** | [**string**] |  | defaults to undefined


### Return type

**DiscordChannelResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Discord channel unlinked successfully |  -  |
**400** | Bad Request - Channel not linked to this POD |  -  |
**401** | Unauthorized - Invalid or missing token |  -  |
**404** | DAO, POD or Discord channel not found |  -  |
**0** | Default error response |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **updateDAO**
> DAOSchemaResponse updateDAO(dAOUpdate)


### Example


```typescript
import { createConfiguration, DaosApi } from '';
import type { DaosApiUpdateDAORequest } from '';

const configuration = createConfiguration();
const apiInstance = new DaosApi(configuration);

const request: DaosApiUpdateDAORequest = {
  
  daoId: "dao_id_example",
  
  dAOUpdate: {
    name: "name_example",
    description: "description_example",
    isActive: true,
    discordServer: "discordServer_example",
    twitter: "twitter_example",
    telegram: "telegram_example",
    instagram: "instagram_example",
    tiktok: "tiktok_example",
    website: "website_example",
    treasury: "treasury_example",
    profile: { data: Buffer.from(fs.readFileSync('/path/to/file', 'utf-8')), name: '/path/to/file' },
    banner: { data: Buffer.from(fs.readFileSync('/path/to/file', 'utf-8')), name: '/path/to/file' },
  },
};

const data = await apiInstance.updateDAO(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **dAOUpdate** | **DAOUpdate**|  |
 **daoId** | [**string**] |  | defaults to undefined


### Return type

**DAOSchemaResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**422** | Unprocessable Entity |  -  |
**200** | DAO updated successfully |  -  |
**400** | Bad Request - Invalid data |  -  |
**401** | Unauthorized - Invalid or missing token |  -  |
**404** | DAO not found |  -  |
**0** | Default error response |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **updatePOD**
> PODSchemaResponse updatePOD(pODUpdate)


### Example


```typescript
import { createConfiguration, DaosApi } from '';
import type { DaosApiUpdatePODRequest } from '';

const configuration = createConfiguration();
const apiInstance = new DaosApi(configuration);

const request: DaosApiUpdatePODRequest = {
  
  daoId: "dao_id_example",
  
  podId: "pod_id_example",
  
  pODUpdate: {
    name: "name_example",
    description: "description_example",
    isActive: true,
    discordChannelId: "discordChannelId_example",
  },
};

const data = await apiInstance.updatePOD(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **pODUpdate** | **PODUpdate**|  |
 **daoId** | [**string**] |  | defaults to undefined
 **podId** | [**string**] |  | defaults to undefined


### Return type

**PODSchemaResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**422** | Unprocessable Entity |  -  |
**200** | POD updated successfully |  -  |
**400** | Bad Request - Invalid data |  -  |
**401** | Unauthorized - Invalid or missing token |  -  |
**404** | User, DAO or POD not found |  -  |
**0** | Default error response |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)


