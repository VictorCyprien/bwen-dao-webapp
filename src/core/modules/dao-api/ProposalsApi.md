# .ProposalsApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createProposalForDAO**](ProposalsApi.md#createProposalForDAO) | **POST** /proposals/dao/{dao_id} | Create a new proposal for this specific DAO
[**createProposalForPOD**](ProposalsApi.md#createProposalForPOD) | **POST** /proposals/dao/{dao_id}/pod/{pod_id} | Create a new proposal for this specific POD
[**deleteDAOProposal**](ProposalsApi.md#deleteDAOProposal) | **DELETE** /proposals/dao/{dao_id}/{proposal_id} | Delete a proposal for a DAO
[**deletePODProposal**](ProposalsApi.md#deletePODProposal) | **DELETE** /proposals/dao/{dao_id}/pod/{pod_id}/{proposal_id} | Delete a proposal for a POD
[**getActiveProposalsByDAO**](ProposalsApi.md#getActiveProposalsByDAO) | **GET** /proposals/dao/{dao_id}/active | Get all active proposals for a specific DAO
[**getActiveProposalsByPOD**](ProposalsApi.md#getActiveProposalsByPOD) | **GET** /proposals/dao/{dao_id}/pod/{pod_id}/active | Get all active proposals for a specific POD
[**getDAOProposalById**](ProposalsApi.md#getDAOProposalById) | **GET** /proposals/dao/{dao_id}/{proposal_id} | Get a specific proposal for a DAO
[**getPODProposalById**](ProposalsApi.md#getPODProposalById) | **GET** /proposals/dao/{dao_id}/pod/{pod_id}/{proposal_id} | Get a specific proposal for a POD
[**getPODProposalVotes**](ProposalsApi.md#getPODProposalVotes) | **GET** /proposals/dao/{dao_id}/pod/{pod_id}/{proposal_id}/vote | Get vote counts for a POD proposal
[**getProposalVotes**](ProposalsApi.md#getProposalVotes) | **GET** /proposals/dao/{dao_id}/{proposal_id}/vote | Get vote counts for a proposal
[**getProposalsByDAO**](ProposalsApi.md#getProposalsByDAO) | **GET** /proposals/dao/{dao_id} | Get all proposals for a specific DAO
[**getProposalsByPOD**](ProposalsApi.md#getProposalsByPOD) | **GET** /proposals/dao/{dao_id}/pod/{pod_id} | Get all proposals for a specific POD
[**removeVoteFromDAOProposal**](ProposalsApi.md#removeVoteFromDAOProposal) | **DELETE** /proposals/dao/{dao_id}/{proposal_id}/vote | Remove a user\&#39;s vote from a proposal
[**removeVoteFromPODProposal**](ProposalsApi.md#removeVoteFromPODProposal) | **DELETE** /proposals/dao/{dao_id}/pod/{pod_id}/{proposal_id}/vote | Remove a vote from a POD proposal
[**updateDAOProposal**](ProposalsApi.md#updateDAOProposal) | **PUT** /proposals/dao/{dao_id}/{proposal_id} | Update a proposal for a DAO
[**updatePODProposal**](ProposalsApi.md#updatePODProposal) | **PUT** /proposals/dao/{dao_id}/pod/{pod_id}/{proposal_id} | Update a proposal for a POD
[**voteOnDAOProposal**](ProposalsApi.md#voteOnDAOProposal) | **POST** /proposals/dao/{dao_id}/{proposal_id}/vote | Vote on a proposal for a DAO
[**voteOnPODProposal**](ProposalsApi.md#voteOnPODProposal) | **POST** /proposals/dao/{dao_id}/pod/{pod_id}/{proposal_id}/vote | Vote on a POD proposal


# **createProposalForDAO**
> ProposalSchemaResponse createProposalForDAO(inputCreateProposal)


### Example


```typescript
import { createConfiguration, ProposalsApi } from '';
import type { ProposalsApiCreateProposalForDAORequest } from '';

const configuration = createConfiguration();
const apiInstance = new ProposalsApi(configuration);

const request: ProposalsApiCreateProposalForDAORequest = {
  
  daoId: "dao_id_example",
  
  inputCreateProposal: {
    name: "name_example",
    description: "description_example",
    daoId: "daoId_example",
    podId: "podId_example",
    startTime: new Date('1970-01-01T00:00:00.00Z'),
    endTime: new Date('1970-01-01T00:00:00.00Z'),
    actions: {
      "key": null,
    },
    pubkey: "pubkey_example",
    transaction: "transaction_example",
  },
};

const data = await apiInstance.createProposalForDAO(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **inputCreateProposal** | **InputCreateProposal**|  |
 **daoId** | [**string**] |  | defaults to undefined


### Return type

**ProposalSchemaResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**422** | Unprocessable Entity |  -  |
**201** | Proposal created successfully |  -  |
**403** | Forbidden - User is not a member of this DAO or lacks permission |  -  |
**400** | Bad Request - Invalid data |  -  |
**404** | DAO not found |  -  |
**401** | Unauthorized - Invalid or missing token |  -  |
**0** | Default error response |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **createProposalForPOD**
> ProposalSchemaResponse createProposalForPOD(inputCreateProposal)


### Example


```typescript
import { createConfiguration, ProposalsApi } from '';
import type { ProposalsApiCreateProposalForPODRequest } from '';

const configuration = createConfiguration();
const apiInstance = new ProposalsApi(configuration);

const request: ProposalsApiCreateProposalForPODRequest = {
  
  daoId: "dao_id_example",
  
  podId: "pod_id_example",
  
  inputCreateProposal: {
    name: "name_example",
    description: "description_example",
    daoId: "daoId_example",
    podId: "podId_example",
    startTime: new Date('1970-01-01T00:00:00.00Z'),
    endTime: new Date('1970-01-01T00:00:00.00Z'),
    actions: {
      "key": null,
    },
    pubkey: "pubkey_example",
    transaction: "transaction_example",
  },
};

const data = await apiInstance.createProposalForPOD(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **inputCreateProposal** | **InputCreateProposal**|  |
 **daoId** | [**string**] |  | defaults to undefined
 **podId** | [**string**] |  | defaults to undefined


### Return type

**ProposalSchemaResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**422** | Unprocessable Entity |  -  |
**201** | Proposal created successfully |  -  |
**403** | Forbidden - User is not a member of this POD or lacks permission |  -  |
**400** | Bad Request - Invalid data |  -  |
**404** | POD not found |  -  |
**401** | Unauthorized - Invalid or missing token |  -  |
**0** | Default error response |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **deleteDAOProposal**
> ProposalSchemaResponse deleteDAOProposal()


### Example


```typescript
import { createConfiguration, ProposalsApi } from '';
import type { ProposalsApiDeleteDAOProposalRequest } from '';

const configuration = createConfiguration();
const apiInstance = new ProposalsApi(configuration);

const request: ProposalsApiDeleteDAOProposalRequest = {
  
  daoId: "dao_id_example",
  
  proposalId: "proposal_id_example",
};

const data = await apiInstance.deleteDAOProposal(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **daoId** | [**string**] |  | defaults to undefined
 **proposalId** | [**string**] |  | defaults to undefined


### Return type

**ProposalSchemaResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Proposal deleted successfully |  -  |
**400** | Bad Request - Error deleting proposal or Proposal does not belong to this DAO |  -  |
**403** | Forbidden - User lacks permission to cancel this proposal |  -  |
**401** | Unauthorized - Invalid or missing token |  -  |
**404** | DAO or Proposal not found |  -  |
**0** | Default error response |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **deletePODProposal**
> ProposalSchemaResponse deletePODProposal()


### Example


```typescript
import { createConfiguration, ProposalsApi } from '';
import type { ProposalsApiDeletePODProposalRequest } from '';

const configuration = createConfiguration();
const apiInstance = new ProposalsApi(configuration);

const request: ProposalsApiDeletePODProposalRequest = {
  
  daoId: "dao_id_example",
  
  podId: "pod_id_example",
  
  proposalId: "proposal_id_example",
};

const data = await apiInstance.deletePODProposal(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **daoId** | [**string**] |  | defaults to undefined
 **podId** | [**string**] |  | defaults to undefined
 **proposalId** | [**string**] |  | defaults to undefined


### Return type

**ProposalSchemaResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Proposal deleted successfully |  -  |
**400** | Bad Request - Error deleting proposal or Proposal does not belong to this POD |  -  |
**403** | Forbidden - User lacks permission to delete this proposal |  -  |
**401** | Unauthorized - Invalid or missing token |  -  |
**404** | POD or Proposal not found |  -  |
**0** | Default error response |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **getActiveProposalsByDAO**
> Array<Proposal> getActiveProposalsByDAO()


### Example


```typescript
import { createConfiguration, ProposalsApi } from '';
import type { ProposalsApiGetActiveProposalsByDAORequest } from '';

const configuration = createConfiguration();
const apiInstance = new ProposalsApi(configuration);

const request: ProposalsApiGetActiveProposalsByDAORequest = {
  
  daoId: "dao_id_example",
};

const data = await apiInstance.getActiveProposalsByDAO(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **daoId** | [**string**] |  | defaults to undefined


### Return type

**Array<Proposal>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | List of active proposals for the DAO |  -  |
**404** | DAO not found |  -  |
**0** | Default error response |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **getActiveProposalsByPOD**
> PodProposalListResponse getActiveProposalsByPOD()


### Example


```typescript
import { createConfiguration, ProposalsApi } from '';
import type { ProposalsApiGetActiveProposalsByPODRequest } from '';

const configuration = createConfiguration();
const apiInstance = new ProposalsApi(configuration);

const request: ProposalsApiGetActiveProposalsByPODRequest = {
  
  daoId: "dao_id_example",
  
  podId: "pod_id_example",
};

const data = await apiInstance.getActiveProposalsByPOD(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **daoId** | [**string**] |  | defaults to undefined
 **podId** | [**string**] |  | defaults to undefined


### Return type

**PodProposalListResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | List of active proposals for the POD |  -  |
**404** | POD not found |  -  |
**0** | Default error response |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **getDAOProposalById**
> Proposal getDAOProposalById()


### Example


```typescript
import { createConfiguration, ProposalsApi } from '';
import type { ProposalsApiGetDAOProposalByIdRequest } from '';

const configuration = createConfiguration();
const apiInstance = new ProposalsApi(configuration);

const request: ProposalsApiGetDAOProposalByIdRequest = {
  
  daoId: "dao_id_example",
  
  proposalId: "proposal_id_example",
};

const data = await apiInstance.getDAOProposalById(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **daoId** | [**string**] |  | defaults to undefined
 **proposalId** | [**string**] |  | defaults to undefined


### Return type

**Proposal**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Proposal retrieved successfully |  -  |
**400** | Proposal does not belong to this DAO |  -  |
**404** | DAO or Proposal not found |  -  |
**0** | Default error response |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **getPODProposalById**
> Proposal getPODProposalById()


### Example


```typescript
import { createConfiguration, ProposalsApi } from '';
import type { ProposalsApiGetPODProposalByIdRequest } from '';

const configuration = createConfiguration();
const apiInstance = new ProposalsApi(configuration);

const request: ProposalsApiGetPODProposalByIdRequest = {
  
  daoId: "dao_id_example",
  
  podId: "pod_id_example",
  
  proposalId: "proposal_id_example",
};

const data = await apiInstance.getPODProposalById(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **daoId** | [**string**] |  | defaults to undefined
 **podId** | [**string**] |  | defaults to undefined
 **proposalId** | [**string**] |  | defaults to undefined


### Return type

**Proposal**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Proposal retrieved successfully |  -  |
**400** | Proposal does not belong to this POD |  -  |
**404** | POD or Proposal not found |  -  |
**0** | Default error response |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **getPODProposalVotes**
> ProposalVoteResponse getPODProposalVotes()


### Example


```typescript
import { createConfiguration, ProposalsApi } from '';
import type { ProposalsApiGetPODProposalVotesRequest } from '';

const configuration = createConfiguration();
const apiInstance = new ProposalsApi(configuration);

const request: ProposalsApiGetPODProposalVotesRequest = {
  
  daoId: "dao_id_example",
  
  podId: "pod_id_example",
  
  proposalId: "proposal_id_example",
};

const data = await apiInstance.getPODProposalVotes(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **daoId** | [**string**] |  | defaults to undefined
 **podId** | [**string**] |  | defaults to undefined
 **proposalId** | [**string**] |  | defaults to undefined


### Return type

**ProposalVoteResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Vote counts retrieved successfully |  -  |
**400** | Bad Request - Proposal does not belong to this POD |  -  |
**401** | Unauthorized - Invalid or missing token |  -  |
**404** | POD or Proposal not found |  -  |
**0** | Default error response |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **getProposalVotes**
> ProposalVoteResponse getProposalVotes()


### Example


```typescript
import { createConfiguration, ProposalsApi } from '';
import type { ProposalsApiGetProposalVotesRequest } from '';

const configuration = createConfiguration();
const apiInstance = new ProposalsApi(configuration);

const request: ProposalsApiGetProposalVotesRequest = {
  
  daoId: "dao_id_example",
  
  proposalId: "proposal_id_example",
};

const data = await apiInstance.getProposalVotes(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **daoId** | [**string**] |  | defaults to undefined
 **proposalId** | [**string**] |  | defaults to undefined


### Return type

**ProposalVoteResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Vote counts retrieved successfully |  -  |
**400** | Bad Request - Proposal does not belong to this DAO |  -  |
**401** | Unauthorized - Invalid or missing token |  -  |
**404** | DAO or Proposal not found |  -  |
**0** | Default error response |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **getProposalsByDAO**
> Array<Proposal> getProposalsByDAO()


### Example


```typescript
import { createConfiguration, ProposalsApi } from '';
import type { ProposalsApiGetProposalsByDAORequest } from '';

const configuration = createConfiguration();
const apiInstance = new ProposalsApi(configuration);

const request: ProposalsApiGetProposalsByDAORequest = {
  
  daoId: "dao_id_example",
};

const data = await apiInstance.getProposalsByDAO(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **daoId** | [**string**] |  | defaults to undefined


### Return type

**Array<Proposal>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | List of proposals for the DAO |  -  |
**404** | DAO not found |  -  |
**0** | Default error response |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **getProposalsByPOD**
> PodProposalListResponse getProposalsByPOD()


### Example


```typescript
import { createConfiguration, ProposalsApi } from '';
import type { ProposalsApiGetProposalsByPODRequest } from '';

const configuration = createConfiguration();
const apiInstance = new ProposalsApi(configuration);

const request: ProposalsApiGetProposalsByPODRequest = {
  
  daoId: "dao_id_example",
  
  podId: "pod_id_example",
};

const data = await apiInstance.getProposalsByPOD(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **daoId** | [**string**] |  | defaults to undefined
 **podId** | [**string**] |  | defaults to undefined


### Return type

**PodProposalListResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | List of proposals for the POD |  -  |
**404** | POD not found |  -  |
**0** | Default error response |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **removeVoteFromDAOProposal**
> ProposalVoteResponse removeVoteFromDAOProposal()


### Example


```typescript
import { createConfiguration, ProposalsApi } from '';
import type { ProposalsApiRemoveVoteFromDAOProposalRequest } from '';

const configuration = createConfiguration();
const apiInstance = new ProposalsApi(configuration);

const request: ProposalsApiRemoveVoteFromDAOProposalRequest = {
  
  daoId: "dao_id_example",
  
  proposalId: "proposal_id_example",
};

const data = await apiInstance.removeVoteFromDAOProposal(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **daoId** | [**string**] |  | defaults to undefined
 **proposalId** | [**string**] |  | defaults to undefined


### Return type

**ProposalVoteResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Vote removed successfully |  -  |
**400** | Bad Request - Proposal is not active, user has not voted, or proposal does not belong to this DAO |  -  |
**401** | Unauthorized - Invalid or missing token |  -  |
**404** | DAO or Proposal not found |  -  |
**0** | Default error response |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **removeVoteFromPODProposal**
> ProposalVoteResponse removeVoteFromPODProposal()


### Example


```typescript
import { createConfiguration, ProposalsApi } from '';
import type { ProposalsApiRemoveVoteFromPODProposalRequest } from '';

const configuration = createConfiguration();
const apiInstance = new ProposalsApi(configuration);

const request: ProposalsApiRemoveVoteFromPODProposalRequest = {
  
  daoId: "dao_id_example",
  
  podId: "pod_id_example",
  
  proposalId: "proposal_id_example",
};

const data = await apiInstance.removeVoteFromPODProposal(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **daoId** | [**string**] |  | defaults to undefined
 **podId** | [**string**] |  | defaults to undefined
 **proposalId** | [**string**] |  | defaults to undefined


### Return type

**ProposalVoteResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Vote removed successfully |  -  |
**400** | Bad Request - Proposal is not active, user has not voted, or proposal does not belong to this POD |  -  |
**403** | Forbidden - User is not a member of this POD or lacks permission |  -  |
**401** | Unauthorized - Invalid or missing token |  -  |
**404** | POD or Proposal not found |  -  |
**0** | Default error response |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **updateDAOProposal**
> ProposalSchemaResponse updateDAOProposal(proposalUpdate)


### Example


```typescript
import { createConfiguration, ProposalsApi } from '';
import type { ProposalsApiUpdateDAOProposalRequest } from '';

const configuration = createConfiguration();
const apiInstance = new ProposalsApi(configuration);

const request: ProposalsApiUpdateDAOProposalRequest = {
  
  daoId: "dao_id_example",
  
  proposalId: "proposal_id_example",
  
  proposalUpdate: {
    name: "name_example",
    description: "description_example",
    startTime: new Date('1970-01-01T00:00:00.00Z'),
    endTime: new Date('1970-01-01T00:00:00.00Z'),
    podId: "podId_example",
    actions: {
      "key": null,
    },
  },
};

const data = await apiInstance.updateDAOProposal(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **proposalUpdate** | **ProposalUpdate**|  |
 **daoId** | [**string**] |  | defaults to undefined
 **proposalId** | [**string**] |  | defaults to undefined


### Return type

**ProposalSchemaResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**422** | Unprocessable Entity |  -  |
**200** | Proposal updated successfully |  -  |
**400** | Bad Request - Invalid data or Proposal does not belong to this DAO |  -  |
**403** | Forbidden - User lacks permission to update this proposal |  -  |
**401** | Unauthorized - Invalid or missing token |  -  |
**404** | DAO or Proposal not found |  -  |
**0** | Default error response |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **updatePODProposal**
> ProposalSchemaResponse updatePODProposal(proposalUpdate)


### Example


```typescript
import { createConfiguration, ProposalsApi } from '';
import type { ProposalsApiUpdatePODProposalRequest } from '';

const configuration = createConfiguration();
const apiInstance = new ProposalsApi(configuration);

const request: ProposalsApiUpdatePODProposalRequest = {
  
  daoId: "dao_id_example",
  
  podId: "pod_id_example",
  
  proposalId: "proposal_id_example",
  
  proposalUpdate: {
    name: "name_example",
    description: "description_example",
    startTime: new Date('1970-01-01T00:00:00.00Z'),
    endTime: new Date('1970-01-01T00:00:00.00Z'),
    podId: "podId_example",
    actions: {
      "key": null,
    },
  },
};

const data = await apiInstance.updatePODProposal(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **proposalUpdate** | **ProposalUpdate**|  |
 **daoId** | [**string**] |  | defaults to undefined
 **podId** | [**string**] |  | defaults to undefined
 **proposalId** | [**string**] |  | defaults to undefined


### Return type

**ProposalSchemaResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**422** | Unprocessable Entity |  -  |
**200** | Proposal updated successfully |  -  |
**400** | Bad Request - Invalid data or Proposal does not belong to this POD |  -  |
**403** | Forbidden - User lacks permission to update this proposal |  -  |
**401** | Unauthorized - Invalid or missing token |  -  |
**404** | POD or Proposal not found |  -  |
**0** | Default error response |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **voteOnDAOProposal**
> ProposalVoteResponse voteOnDAOProposal(proposalVote)


### Example


```typescript
import { createConfiguration, ProposalsApi } from '';
import type { ProposalsApiVoteOnDAOProposalRequest } from '';

const configuration = createConfiguration();
const apiInstance = new ProposalsApi(configuration);

const request: ProposalsApiVoteOnDAOProposalRequest = {
  
  daoId: "dao_id_example",
  
  proposalId: "proposal_id_example",
  
  proposalVote: {
    vote: "for",
    pubkey: "pubkey_example",
    transaction: "transaction_example",
  },
};

const data = await apiInstance.voteOnDAOProposal(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **proposalVote** | **ProposalVote**|  |
 **daoId** | [**string**] |  | defaults to undefined
 **proposalId** | [**string**] |  | defaults to undefined


### Return type

**ProposalVoteResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**422** | Unprocessable Entity |  -  |
**200** | Vote recorded successfully |  -  |
**400** | Bad Request - Proposal is not active, user has already voted, or proposal does not belong to this DAO |  -  |
**403** | Forbidden - User is not a member of this DAO or lacks permission |  -  |
**401** | Unauthorized - Invalid or missing token |  -  |
**404** | DAO or Proposal not found |  -  |
**0** | Default error response |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **voteOnPODProposal**
> ProposalVoteResponse voteOnPODProposal(proposalVote)


### Example


```typescript
import { createConfiguration, ProposalsApi } from '';
import type { ProposalsApiVoteOnPODProposalRequest } from '';

const configuration = createConfiguration();
const apiInstance = new ProposalsApi(configuration);

const request: ProposalsApiVoteOnPODProposalRequest = {
  
  daoId: "dao_id_example",
  
  podId: "pod_id_example",
  
  proposalId: "proposal_id_example",
  
  proposalVote: {
    vote: "for",
    pubkey: "pubkey_example",
    transaction: "transaction_example",
  },
};

const data = await apiInstance.voteOnPODProposal(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **proposalVote** | **ProposalVote**|  |
 **daoId** | [**string**] |  | defaults to undefined
 **podId** | [**string**] |  | defaults to undefined
 **proposalId** | [**string**] |  | defaults to undefined


### Return type

**ProposalVoteResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**422** | Unprocessable Entity |  -  |
**200** | Vote recorded successfully |  -  |
**400** | Bad Request - Proposal is not active, user has already voted, or proposal does not belong to this POD |  -  |
**403** | Forbidden - User is not a member of this POD or lacks permission |  -  |
**401** | Unauthorized - Invalid or missing token |  -  |
**404** | POD or Proposal not found |  -  |
**0** | Default error response |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)


