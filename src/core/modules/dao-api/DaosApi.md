# .DaosApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**accessDAOModule**](DaosApi.md#accessDAOModule) | **GET** /daos/{dao_id}/modules/{module_name} | Access a specific module for a DAO
[**addAdminToDAO**](DaosApi.md#addAdminToDAO) | **POST** /daos/{dao_id}/admins | Add an admin to a DAO
[**addDAOModule**](DaosApi.md#addDAOModule) | **POST** /daos/{dao_id}/modules/add | Add a module to a DAO
[**addMemberToDAO**](DaosApi.md#addMemberToDAO) | **POST** /daos/{dao_id}/members | Add a member to a DAO
[**addMemberToPOD**](DaosApi.md#addMemberToPOD) | **POST** /daos/{dao_id}/pods/{pod_id}/members | Add a member to a POD
[**assignPermissionToRole**](DaosApi.md#assignPermissionToRole) | **POST** /daos/{dao_id}/roles/{role_id}/permissions | Assign a permission to a role in a DAO
[**assignRoleToUser**](DaosApi.md#assignRoleToUser) | **POST** /daos/{dao_id}/members/{user_id}/roles | Assign a role to a user in a DAO
[**cancelDAOInvitation**](DaosApi.md#cancelDAOInvitation) | **DELETE** /daos/{dao_id}/invitations/{invitation_id} | Cancel/delete a DAO invitation
[**checkDAOInitialization**](DaosApi.md#checkDAOInitialization) | **GET** /daos/init | Check if user has already initialized DAO creation (useful after disconnections)
[**checkUserDAOOwnership**](DaosApi.md#checkUserDAOOwnership) | **GET** /daos/ownership | Check if the authenticated user owns a DAO
[**checkUserPermission**](DaosApi.md#checkUserPermission) | **GET** /daos/{dao_id}/members/{user_id}/permissions/{permission_id} | Check if a user has a specific permission in a DAO
[**checkUserRole**](DaosApi.md#checkUserRole) | **GET** /daos/{dao_id}/members/{user_id}/roles/{role_id} | Check if a user has a specific role in a DAO
[**createDAO**](DaosApi.md#createDAO) | **POST** /daos/ | Create a new DAO (Step 2) - Complete DAO creation with all required fields
[**createDAORole**](DaosApi.md#createDAORole) | **POST** /daos/{dao_id}/roles | Create a new role for a DAO
[**createPOD**](DaosApi.md#createPOD) | **POST** /daos/{dao_id}/pods | Create a new POD
[**deleteDAO**](DaosApi.md#deleteDAO) | **DELETE** /daos/{dao_id} | Delete a DAO
[**deleteDAORole**](DaosApi.md#deleteDAORole) | **DELETE** /daos/{dao_id}/roles/{role_id} | Delete a role from a DAO
[**deletePOD**](DaosApi.md#deletePOD) | **DELETE** /daos/{dao_id}/pods/{pod_id} | Delete a POD
[**enableDAOFeatured**](DaosApi.md#enableDAOFeatured) | **PATCH** /daos/{dao_id}/featured | Enable a DAO\&#39;s featured option
[**getAllDAOs**](DaosApi.md#getAllDAOs) | **GET** /daos/ | List all DAOs
[**getAllMembersOfPOD**](DaosApi.md#getAllMembersOfPOD) | **GET** /daos/{dao_id}/pods/{pod_id}/members | Get all members of a POD
[**getAllPODsForDAO**](DaosApi.md#getAllPODsForDAO) | **GET** /daos/{dao_id}/pods | Get all PODs for a DAO
[**getChannelMessages**](DaosApi.md#getChannelMessages) | **GET** /daos/{dao_id}/pods/{pod_id}/discord-channels/{channel_id}/messages | Get messages from a specific Discord channel
[**getDAOById**](DaosApi.md#getDAOById) | **GET** /daos/{dao_id} | Get a DAO by ID
[**getDAOFeaturedStatus**](DaosApi.md#getDAOFeaturedStatus) | **GET** /daos/{dao_id}/featured | Get a DAO\&#39;s featured status
[**getDAOGovernance**](DaosApi.md#getDAOGovernance) | **GET** /daos/{dao_id}/governance | Get governance model for a DAO
[**getDAOInvitation**](DaosApi.md#getDAOInvitation) | **GET** /daos/{dao_id}/invitations/{invitation_id} | Get details of a specific invitation
[**getDAOInvitations**](DaosApi.md#getDAOInvitations) | **GET** /daos/{dao_id}/invitations | Get all invitations for a DAO
[**getDAOModules**](DaosApi.md#getDAOModules) | **GET** /daos/{dao_id}/modules | Get all modules enabled for a DAO
[**getDAOPermissions**](DaosApi.md#getDAOPermissions) | **GET** /daos/{dao_id}/permissions | Get all permissions available for a DAO
[**getDAORole**](DaosApi.md#getDAORole) | **GET** /daos/{dao_id}/roles/{role_id} | Get a specific role for a DAO
[**getDAORoles**](DaosApi.md#getDAORoles) | **GET** /daos/{dao_id}/roles | Get all roles for a DAO
[**getGovernanceModels**](DaosApi.md#getGovernanceModels) | **GET** /daos/governance/models | Get all available governance models
[**getPODById**](DaosApi.md#getPODById) | **GET** /daos/{dao_id}/pods/{pod_id} | Get a POD by ID
[**getPODDiscordChannels**](DaosApi.md#getPODDiscordChannels) | **GET** /daos/{dao_id}/pods/{pod_id}/discord-channels | Get all Discord channels for a POD
[**getPODFeed**](DaosApi.md#getPODFeed) | **GET** /daos/{dao_id}/pods/{pod_id}/feed | Get Discord feed for a POD
[**getRolePermissions**](DaosApi.md#getRolePermissions) | **GET** /daos/{dao_id}/roles/{role_id}/permissions | Get all permissions for a specific role in a DAO
[**getUserPermissions**](DaosApi.md#getUserPermissions) | **GET** /daos/{dao_id}/members/{user_id}/permissions | Get all permissions a user has in a DAO
[**getUserRoles**](DaosApi.md#getUserRoles) | **GET** /daos/{dao_id}/members/{user_id}/roles | Get roles for a specific user in a DAO
[**initializeDAOCreation**](DaosApi.md#initializeDAOCreation) | **POST** /daos/init | Initialize DAO creation (Step 1) - Store pubkey and transaction in Redis
[**initializeDAOGovernance**](DaosApi.md#initializeDAOGovernance) | **POST** /daos/{dao_id}/governance/initialize | Initialize governance model for a DAO
[**inviteUserToDAO**](DaosApi.md#inviteUserToDAO) | **POST** /daos/{dao_id}/invitations | Create an invitation to join a DAO
[**linkDiscordChannelToPOD**](DaosApi.md#linkDiscordChannelToPOD) | **POST** /daos/{dao_id}/pods/{pod_id}/discord-channels | Link a Discord channel to a POD
[**removeAdminFromDAO**](DaosApi.md#removeAdminFromDAO) | **DELETE** /daos/{dao_id}/admins | Remove an admin from a DAO
[**removeDAOModule**](DaosApi.md#removeDAOModule) | **POST** /daos/{dao_id}/modules/remove | Remove a module from a DAO
[**removeMemberFromDAO**](DaosApi.md#removeMemberFromDAO) | **DELETE** /daos/{dao_id}/members | Remove a member from a DAO
[**removeMemberFromPOD**](DaosApi.md#removeMemberFromPOD) | **DELETE** /daos/{dao_id}/pods/{pod_id}/members | Remove a member from a POD
[**removePermissionFromRole**](DaosApi.md#removePermissionFromRole) | **DELETE** /daos/{dao_id}/roles/{role_id}/permissions/{permission_id} | Remove a permission from a role in a DAO
[**removeRoleFromUser**](DaosApi.md#removeRoleFromUser) | **DELETE** /daos/{dao_id}/members/{user_id}/roles/{role_id} | Remove a role from a user in a DAO
[**respondToDAOInvitation**](DaosApi.md#respondToDAOInvitation) | **POST** /daos/{dao_id}/invitations/{invitation_id} | Respond to a DAO invitation (accept/decline)
[**unlinkDiscordChannelFromPOD**](DaosApi.md#unlinkDiscordChannelFromPOD) | **DELETE** /daos/{dao_id}/pods/{pod_id}/discord-channels/{channel_id} | Unlink a Discord channel from a POD
[**updateDAO**](DaosApi.md#updateDAO) | **PUT** /daos/{dao_id} | Update a DAO
[**updateDAOGovernance**](DaosApi.md#updateDAOGovernance) | **PUT** /daos/{dao_id}/governance | Update governance model for a DAO
[**updateDAORole**](DaosApi.md#updateDAORole) | **PUT** /daos/{dao_id}/roles/{role_id} | Update a role for a DAO
[**updatePOD**](DaosApi.md#updatePOD) | **PUT** /daos/{dao_id}/pods/{pod_id} | Update a POD


# **accessDAOModule**
> DAOModuleAccessResponse accessDAOModule()


### Example


```typescript
import { createConfiguration, DaosApi } from '';
import type { DaosApiAccessDAOModuleRequest } from '';

const configuration = createConfiguration();
const apiInstance = new DaosApi(configuration);

const request: DaosApiAccessDAOModuleRequest = {
  
  daoId: "dao_id_example",
  
  moduleName: "module_name_example",
};

const data = await apiInstance.accessDAOModule(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **daoId** | [**string**] |  | defaults to undefined
 **moduleName** | [**string**] |  | defaults to undefined


### Return type

**DAOModuleAccessResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Module accessed successfully |  -  |
**400** | Bad Request - Invalid module |  -  |
**401** | Unauthorized - Invalid or missing token |  -  |
**404** | DAO or module not found |  -  |
**0** | Default error response |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

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

# **addDAOModule**
> DAOModuleResponse addDAOModule(dAOModule)


### Example


```typescript
import { createConfiguration, DaosApi } from '';
import type { DaosApiAddDAOModuleRequest } from '';

const configuration = createConfiguration();
const apiInstance = new DaosApi(configuration);

const request: DaosApiAddDAOModuleRequest = {
  
  daoId: "dao_id_example",
  
  dAOModule: {
    module: "module_example",
  },
};

const data = await apiInstance.addDAOModule(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **dAOModule** | **DAOModule**|  |
 **daoId** | [**string**] |  | defaults to undefined


### Return type

**DAOModuleResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**422** | Unprocessable Entity |  -  |
**200** | Module added successfully |  -  |
**400** | Bad Request - Invalid module |  -  |
**401** | Unauthorized - Invalid or missing token |  -  |
**404** | DAO not found |  -  |
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
**401** | Unauthorized |  -  |
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

# **assignPermissionToRole**
> RolePermissionResponse assignPermissionToRole(rolePermissionAssignment)


### Example


```typescript
import { createConfiguration, DaosApi } from '';
import type { DaosApiAssignPermissionToRoleRequest } from '';

const configuration = createConfiguration();
const apiInstance = new DaosApi(configuration);

const request: DaosApiAssignPermissionToRoleRequest = {
  
  daoId: "dao_id_example",
  
  roleId: "role_id_example",
  
  rolePermissionAssignment: {
    roleId: "roleId_example",
    permissionId: "permissionId_example",
  },
};

const data = await apiInstance.assignPermissionToRole(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **rolePermissionAssignment** | **RolePermissionAssignment**|  |
 **daoId** | [**string**] |  | defaults to undefined
 **roleId** | [**string**] |  | defaults to undefined


### Return type

**RolePermissionResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**422** | Unprocessable Entity |  -  |
**201** | Permission assigned successfully |  -  |
**400** | Bad Request - Invalid data |  -  |
**401** | Unauthorized - Invalid or missing token |  -  |
**404** | DAO, role, or permission not found |  -  |
**0** | Default error response |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **assignRoleToUser**
> UserRoleResponse assignRoleToUser(userRoleAssignment)


### Example


```typescript
import { createConfiguration, DaosApi } from '';
import type { DaosApiAssignRoleToUserRequest } from '';

const configuration = createConfiguration();
const apiInstance = new DaosApi(configuration);

const request: DaosApiAssignRoleToUserRequest = {
  
  daoId: "dao_id_example",
  
  userId: "user_id_example",
  
  userRoleAssignment: {
    userId: "userId_example",
    roleId: "roleId_example",
    votingPower: 1,
  },
};

const data = await apiInstance.assignRoleToUser(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userRoleAssignment** | **UserRoleAssignment**|  |
 **daoId** | [**string**] |  | defaults to undefined
 **userId** | [**string**] |  | defaults to undefined


### Return type

**UserRoleResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**422** | Unprocessable Entity |  -  |
**201** | Role assigned successfully |  -  |
**400** | Bad Request - Invalid data |  -  |
**401** | Unauthorized - Invalid or missing token |  -  |
**404** | DAO, user, or role not found |  -  |
**0** | Default error response |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **cancelDAOInvitation**
> DAOInvitationResponse cancelDAOInvitation()


### Example


```typescript
import { createConfiguration, DaosApi } from '';
import type { DaosApiCancelDAOInvitationRequest } from '';

const configuration = createConfiguration();
const apiInstance = new DaosApi(configuration);

const request: DaosApiCancelDAOInvitationRequest = {
  
  daoId: "dao_id_example",
  
  invitationId: "invitation_id_example",
};

const data = await apiInstance.cancelDAOInvitation(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **daoId** | [**string**] |  | defaults to undefined
 **invitationId** | [**string**] |  | defaults to undefined


### Return type

**DAOInvitationResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Invitation cancelled successfully |  -  |
**400** | Bad Request |  -  |
**401** | Unauthorized |  -  |
**404** | Invitation, DAO, or user not found |  -  |
**0** | Default error response |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **checkDAOInitialization**
> InitDAOResponse checkDAOInitialization()


### Example


```typescript
import { createConfiguration, DaosApi } from '';

const configuration = createConfiguration();
const apiInstance = new DaosApi(configuration);

const request = {};

const data = await apiInstance.checkDAOInitialization(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters
This endpoint does not need any parameter.


### Return type

**InitDAOResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | DAO initialization data status |  -  |
**404** | User or initialization data not found |  -  |
**401** | Unauthorized - Invalid or missing token |  -  |
**0** | Default error response |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **checkUserDAOOwnership**
> UserDAOOwnershipResponse checkUserDAOOwnership()


### Example


```typescript
import { createConfiguration, DaosApi } from '';

const configuration = createConfiguration();
const apiInstance = new DaosApi(configuration);

const request = {};

const data = await apiInstance.checkUserDAOOwnership(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters
This endpoint does not need any parameter.


### Return type

**UserDAOOwnershipResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | User DAO ownership status |  -  |
**404** | User not found |  -  |
**401** | Unauthorized - Invalid or missing token |  -  |
**0** | Default error response |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **checkUserPermission**
> UserPermissionCheck checkUserPermission()


### Example


```typescript
import { createConfiguration, DaosApi } from '';
import type { DaosApiCheckUserPermissionRequest } from '';

const configuration = createConfiguration();
const apiInstance = new DaosApi(configuration);

const request: DaosApiCheckUserPermissionRequest = {
  
  daoId: "dao_id_example",
  
  userId: "user_id_example",
  
  permissionId: "permission_id_example",
};

const data = await apiInstance.checkUserPermission(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **daoId** | [**string**] |  | defaults to undefined
 **userId** | [**string**] |  | defaults to undefined
 **permissionId** | [**string**] |  | defaults to undefined


### Return type

**UserPermissionCheck**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Permission check completed |  -  |
**401** | Unauthorized - Invalid or missing token |  -  |
**404** | DAO, user or permission not found |  -  |
**0** | Default error response |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **checkUserRole**
> UserRoleCheck checkUserRole()


### Example


```typescript
import { createConfiguration, DaosApi } from '';
import type { DaosApiCheckUserRoleRequest } from '';

const configuration = createConfiguration();
const apiInstance = new DaosApi(configuration);

const request: DaosApiCheckUserRoleRequest = {
  
  daoId: "dao_id_example",
  
  userId: "user_id_example",
  
  roleId: "role_id_example",
};

const data = await apiInstance.checkUserRole(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **daoId** | [**string**] |  | defaults to undefined
 **userId** | [**string**] |  | defaults to undefined
 **roleId** | [**string**] |  | defaults to undefined


### Return type

**UserRoleCheck**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Role check successful |  -  |
**404** | DAO, user, or role not found |  -  |
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
    discordServer: "discordServer_example",
    twitter: "twitter_example",
    telegram: "telegram_example",
    instagram: "instagram_example",
    tiktok: "tiktok_example",
    website: "website_example",
    tokenAddress: "tokenAddress_example",
    governanceModel: 1,
    votingPowerSystem: "Defined",
    quorumPercentage: 1,
    profile: { data: Buffer.from(fs.readFileSync('/path/to/file', 'utf-8')), name: '/path/to/file' },
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

# **createDAORole**
> RoleResponse createDAORole(inputCreateRole)


### Example


```typescript
import { createConfiguration, DaosApi } from '';
import type { DaosApiCreateDAORoleRequest } from '';

const configuration = createConfiguration();
const apiInstance = new DaosApi(configuration);

const request: DaosApiCreateDAORoleRequest = {
  
  daoId: "dao_id_example",
  
  inputCreateRole: {
    name: "name_example",
    description: "description_example",
  },
};

const data = await apiInstance.createDAORole(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **inputCreateRole** | **InputCreateRole**|  |
 **daoId** | [**string**] |  | defaults to undefined


### Return type

**RoleResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**422** | Unprocessable Entity |  -  |
**201** | Role created successfully |  -  |
**400** | Bad Request - Invalid data |  -  |
**401** | Unauthorized - Invalid or missing token |  -  |
**404** | DAO not found |  -  |
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

# **deleteDAORole**
> RoleResponse deleteDAORole()


### Example


```typescript
import { createConfiguration, DaosApi } from '';
import type { DaosApiDeleteDAORoleRequest } from '';

const configuration = createConfiguration();
const apiInstance = new DaosApi(configuration);

const request: DaosApiDeleteDAORoleRequest = {
  
  daoId: "dao_id_example",
  
  roleId: "role_id_example",
};

const data = await apiInstance.deleteDAORole(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **daoId** | [**string**] |  | defaults to undefined
 **roleId** | [**string**] |  | defaults to undefined


### Return type

**RoleResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Role deleted successfully |  -  |
**400** | Bad Request - Invalid data |  -  |
**401** | Unauthorized - Invalid or missing token |  -  |
**404** | DAO or role not found |  -  |
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

# **enableDAOFeatured**
> FeaturedResponse enableDAOFeatured(featuredToggle)


### Example


```typescript
import { createConfiguration, DaosApi } from '';
import type { DaosApiEnableDAOFeaturedRequest } from '';

const configuration = createConfiguration();
const apiInstance = new DaosApi(configuration);

const request: DaosApiEnableDAOFeaturedRequest = {
  
  daoId: "dao_id_example",
  
  featuredToggle: {
    days: 7,
  },
};

const data = await apiInstance.enableDAOFeatured(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **featuredToggle** | **FeaturedToggle**|  |
 **daoId** | [**string**] |  | defaults to undefined


### Return type

**FeaturedResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**422** | Unprocessable Entity |  -  |
**201** | DAO featured option enabled successfully |  -  |
**400** | Bad Request - Invalid data |  -  |
**401** | Unauthorized - Invalid or missing token |  -  |
**404** | DAO not found |  -  |
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

# **getDAOFeaturedStatus**
> FeaturedResponse getDAOFeaturedStatus()


### Example


```typescript
import { createConfiguration, DaosApi } from '';
import type { DaosApiGetDAOFeaturedStatusRequest } from '';

const configuration = createConfiguration();
const apiInstance = new DaosApi(configuration);

const request: DaosApiGetDAOFeaturedStatusRequest = {
  
  daoId: "dao_id_example",
};

const data = await apiInstance.getDAOFeaturedStatus(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **daoId** | [**string**] |  | defaults to undefined


### Return type

**FeaturedResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | DAO featured status retrieved successfully |  -  |
**404** | DAO not found |  -  |
**0** | Default error response |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **getDAOGovernance**
> Governance getDAOGovernance()


### Example


```typescript
import { createConfiguration, DaosApi } from '';
import type { DaosApiGetDAOGovernanceRequest } from '';

const configuration = createConfiguration();
const apiInstance = new DaosApi(configuration);

const request: DaosApiGetDAOGovernanceRequest = {
  
  daoId: "dao_id_example",
};

const data = await apiInstance.getDAOGovernance(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **daoId** | [**string**] |  | defaults to undefined


### Return type

**Governance**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Governance model retrieved successfully |  -  |
**404** | DAO not found |  -  |
**0** | Default error response |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **getDAOInvitation**
> DAOInvitationResponse getDAOInvitation()


### Example


```typescript
import { createConfiguration, DaosApi } from '';
import type { DaosApiGetDAOInvitationRequest } from '';

const configuration = createConfiguration();
const apiInstance = new DaosApi(configuration);

const request: DaosApiGetDAOInvitationRequest = {
  
  daoId: "dao_id_example",
  
  invitationId: "invitation_id_example",
};

const data = await apiInstance.getDAOInvitation(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **daoId** | [**string**] |  | defaults to undefined
 **invitationId** | [**string**] |  | defaults to undefined


### Return type

**DAOInvitationResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | DAO invitation |  -  |
**401** | Unauthorized |  -  |
**404** | Invitation, DAO, or user not found |  -  |
**0** | Default error response |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **getDAOInvitations**
> DAOInvitationList getDAOInvitations()


### Example


```typescript
import { createConfiguration, DaosApi } from '';
import type { DaosApiGetDAOInvitationsRequest } from '';

const configuration = createConfiguration();
const apiInstance = new DaosApi(configuration);

const request: DaosApiGetDAOInvitationsRequest = {
  
  daoId: "dao_id_example",
};

const data = await apiInstance.getDAOInvitations(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **daoId** | [**string**] |  | defaults to undefined


### Return type

**DAOInvitationList**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | DAO invitations |  -  |
**401** | Unauthorized |  -  |
**404** | DAO not found |  -  |
**0** | Default error response |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **getDAOModules**
> DAOModulesList getDAOModules()


### Example


```typescript
import { createConfiguration, DaosApi } from '';
import type { DaosApiGetDAOModulesRequest } from '';

const configuration = createConfiguration();
const apiInstance = new DaosApi(configuration);

const request: DaosApiGetDAOModulesRequest = {
  
  daoId: "dao_id_example",
};

const data = await apiInstance.getDAOModules(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **daoId** | [**string**] |  | defaults to undefined


### Return type

**DAOModulesList**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | DAO modules retrieved successfully |  -  |
**404** | DAO not found |  -  |
**0** | Default error response |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **getDAOPermissions**
> PermissionListResponse getDAOPermissions()


### Example


```typescript
import { createConfiguration, DaosApi } from '';
import type { DaosApiGetDAOPermissionsRequest } from '';

const configuration = createConfiguration();
const apiInstance = new DaosApi(configuration);

const request: DaosApiGetDAOPermissionsRequest = {
  
  daoId: "dao_id_example",
};

const data = await apiInstance.getDAOPermissions(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **daoId** | [**string**] |  | defaults to undefined


### Return type

**PermissionListResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Permissions retrieved successfully |  -  |
**404** | DAO not found |  -  |
**0** | Default error response |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **getDAORole**
> Role getDAORole()


### Example


```typescript
import { createConfiguration, DaosApi } from '';
import type { DaosApiGetDAORoleRequest } from '';

const configuration = createConfiguration();
const apiInstance = new DaosApi(configuration);

const request: DaosApiGetDAORoleRequest = {
  
  daoId: "dao_id_example",
  
  roleId: "role_id_example",
};

const data = await apiInstance.getDAORole(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **daoId** | [**string**] |  | defaults to undefined
 **roleId** | [**string**] |  | defaults to undefined


### Return type

**Role**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Role retrieved successfully |  -  |
**404** | DAO or role not found |  -  |
**0** | Default error response |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **getDAORoles**
> RoleListResponse getDAORoles()


### Example


```typescript
import { createConfiguration, DaosApi } from '';
import type { DaosApiGetDAORolesRequest } from '';

const configuration = createConfiguration();
const apiInstance = new DaosApi(configuration);

const request: DaosApiGetDAORolesRequest = {
  
  daoId: "dao_id_example",
};

const data = await apiInstance.getDAORoles(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **daoId** | [**string**] |  | defaults to undefined


### Return type

**RoleListResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Roles retrieved successfully |  -  |
**404** | DAO not found |  -  |
**0** | Default error response |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **getGovernanceModels**
> GovernanceModelsList getGovernanceModels()


### Example


```typescript
import { createConfiguration, DaosApi } from '';

const configuration = createConfiguration();
const apiInstance = new DaosApi(configuration);

const request = {};

const data = await apiInstance.getGovernanceModels(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters
This endpoint does not need any parameter.


### Return type

**GovernanceModelsList**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Governance models retrieved successfully |  -  |
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

# **getRolePermissions**
> PermissionListResponse getRolePermissions()


### Example


```typescript
import { createConfiguration, DaosApi } from '';
import type { DaosApiGetRolePermissionsRequest } from '';

const configuration = createConfiguration();
const apiInstance = new DaosApi(configuration);

const request: DaosApiGetRolePermissionsRequest = {
  
  daoId: "dao_id_example",
  
  roleId: "role_id_example",
};

const data = await apiInstance.getRolePermissions(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **daoId** | [**string**] |  | defaults to undefined
 **roleId** | [**string**] |  | defaults to undefined


### Return type

**PermissionListResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Role permissions retrieved successfully |  -  |
**404** | DAO or role not found |  -  |
**0** | Default error response |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **getUserPermissions**
> PermissionListResponse getUserPermissions()


### Example


```typescript
import { createConfiguration, DaosApi } from '';
import type { DaosApiGetUserPermissionsRequest } from '';

const configuration = createConfiguration();
const apiInstance = new DaosApi(configuration);

const request: DaosApiGetUserPermissionsRequest = {
  
  daoId: "dao_id_example",
  
  userId: "user_id_example",
};

const data = await apiInstance.getUserPermissions(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **daoId** | [**string**] |  | defaults to undefined
 **userId** | [**string**] |  | defaults to undefined


### Return type

**PermissionListResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | User permissions retrieved successfully |  -  |
**401** | Unauthorized - Invalid or missing token |  -  |
**404** | DAO or user not found |  -  |
**0** | Default error response |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **getUserRoles**
> RoleListResponse getUserRoles()


### Example


```typescript
import { createConfiguration, DaosApi } from '';
import type { DaosApiGetUserRolesRequest } from '';

const configuration = createConfiguration();
const apiInstance = new DaosApi(configuration);

const request: DaosApiGetUserRolesRequest = {
  
  daoId: "dao_id_example",
  
  userId: "user_id_example",
};

const data = await apiInstance.getUserRoles(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **daoId** | [**string**] |  | defaults to undefined
 **userId** | [**string**] |  | defaults to undefined


### Return type

**RoleListResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | User\&#39;s roles retrieved successfully |  -  |
**404** | DAO or user not found |  -  |
**0** | Default error response |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **initializeDAOCreation**
> InitDAOResponse initializeDAOCreation(inputInitDAO)


### Example


```typescript
import { createConfiguration, DaosApi } from '';
import type { DaosApiInitializeDAOCreationRequest } from '';

const configuration = createConfiguration();
const apiInstance = new DaosApi(configuration);

const request: DaosApiInitializeDAOCreationRequest = {
  
  inputInitDAO: {
    pubkey: "pubkey_example",
    transaction: "transaction_example",
  },
};

const data = await apiInstance.initializeDAOCreation(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **inputInitDAO** | **InputInitDAO**|  |


### Return type

**InitDAOResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**422** | Unprocessable Entity |  -  |
**201** | DAO initialization successful |  -  |
**400** | Bad Request - Invalid data |  -  |
**401** | Unauthorized - Invalid or missing token |  -  |
**0** | Default error response |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **initializeDAOGovernance**
> GovernanceResponse initializeDAOGovernance(inputCreateGovernance)


### Example


```typescript
import { createConfiguration, DaosApi } from '';
import type { DaosApiInitializeDAOGovernanceRequest } from '';

const configuration = createConfiguration();
const apiInstance = new DaosApi(configuration);

const request: DaosApiInitializeDAOGovernanceRequest = {
  
  daoId: "dao_id_example",
  
  inputCreateGovernance: {
    governanceModel: 1,
    votingPowerSystem: "Defined",
    councilEntryCondition: "Election",
    councilEntryThreshold: 1,
    daoEntryCondition: "Candidature",
    daoEntryThreshold: 1,
    quorumPercentage: 1,
  },
};

const data = await apiInstance.initializeDAOGovernance(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **inputCreateGovernance** | **InputCreateGovernance**|  |
 **daoId** | [**string**] |  | defaults to undefined


### Return type

**GovernanceResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**422** | Unprocessable Entity |  -  |
**201** | Governance model initialized successfully |  -  |
**400** | Bad Request - Invalid data |  -  |
**401** | Unauthorized - Invalid or missing token |  -  |
**404** | DAO not found |  -  |
**0** | Default error response |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **inviteUserToDAO**
> DAOInvitationResponse inviteUserToDAO(dAOInvitation)


### Example


```typescript
import { createConfiguration, DaosApi } from '';
import type { DaosApiInviteUserToDAORequest } from '';

const configuration = createConfiguration();
const apiInstance = new DaosApi(configuration);

const request: DaosApiInviteUserToDAORequest = {
  
  daoId: "dao_id_example",
  
  dAOInvitation: {
    userId: "userId_example",
    expiresInDays: 1,
  },
};

const data = await apiInstance.inviteUserToDAO(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **dAOInvitation** | **DAOInvitation**|  |
 **daoId** | [**string**] |  | defaults to undefined


### Return type

**DAOInvitationResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**422** | Unprocessable Entity |  -  |
**200** | Invitation created successfully |  -  |
**400** | Bad Request |  -  |
**401** | Unauthorized |  -  |
**404** | User or DAO not found |  -  |
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

# **removeDAOModule**
> DAOModuleResponse removeDAOModule(dAOModule)


### Example


```typescript
import { createConfiguration, DaosApi } from '';
import type { DaosApiRemoveDAOModuleRequest } from '';

const configuration = createConfiguration();
const apiInstance = new DaosApi(configuration);

const request: DaosApiRemoveDAOModuleRequest = {
  
  daoId: "dao_id_example",
  
  dAOModule: {
    module: "module_example",
  },
};

const data = await apiInstance.removeDAOModule(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **dAOModule** | **DAOModule**|  |
 **daoId** | [**string**] |  | defaults to undefined


### Return type

**DAOModuleResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**422** | Unprocessable Entity |  -  |
**200** | Module removed successfully |  -  |
**400** | Bad Request - Invalid module |  -  |
**401** | Unauthorized - Invalid or missing token |  -  |
**404** | DAO not found |  -  |
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

# **removePermissionFromRole**
> RolePermissionResponse removePermissionFromRole()


### Example


```typescript
import { createConfiguration, DaosApi } from '';
import type { DaosApiRemovePermissionFromRoleRequest } from '';

const configuration = createConfiguration();
const apiInstance = new DaosApi(configuration);

const request: DaosApiRemovePermissionFromRoleRequest = {
  
  daoId: "dao_id_example",
  
  roleId: "role_id_example",
  
  permissionId: "permission_id_example",
};

const data = await apiInstance.removePermissionFromRole(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **daoId** | [**string**] |  | defaults to undefined
 **roleId** | [**string**] |  | defaults to undefined
 **permissionId** | [**string**] |  | defaults to undefined


### Return type

**RolePermissionResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Permission removed successfully |  -  |
**400** | Bad Request - Invalid data |  -  |
**401** | Unauthorized - Invalid or missing token |  -  |
**404** | DAO, role, or permission not found |  -  |
**0** | Default error response |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **removeRoleFromUser**
> UserRoleResponse removeRoleFromUser()


### Example


```typescript
import { createConfiguration, DaosApi } from '';
import type { DaosApiRemoveRoleFromUserRequest } from '';

const configuration = createConfiguration();
const apiInstance = new DaosApi(configuration);

const request: DaosApiRemoveRoleFromUserRequest = {
  
  daoId: "dao_id_example",
  
  userId: "user_id_example",
  
  roleId: "role_id_example",
};

const data = await apiInstance.removeRoleFromUser(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **daoId** | [**string**] |  | defaults to undefined
 **userId** | [**string**] |  | defaults to undefined
 **roleId** | [**string**] |  | defaults to undefined


### Return type

**UserRoleResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Role removed successfully |  -  |
**400** | Bad Request - Invalid data |  -  |
**401** | Unauthorized - Invalid or missing token |  -  |
**404** | DAO, user, or role not found |  -  |
**0** | Default error response |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **respondToDAOInvitation**
> DAOInvitationResponse respondToDAOInvitation(dAOInvitationAction)


### Example


```typescript
import { createConfiguration, DaosApi } from '';
import type { DaosApiRespondToDAOInvitationRequest } from '';

const configuration = createConfiguration();
const apiInstance = new DaosApi(configuration);

const request: DaosApiRespondToDAOInvitationRequest = {
  
  daoId: "dao_id_example",
  
  invitationId: "invitation_id_example",
  
  dAOInvitationAction: {
    action: "action_example",
  },
};

const data = await apiInstance.respondToDAOInvitation(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **dAOInvitationAction** | **DAOInvitationAction**|  |
 **daoId** | [**string**] |  | defaults to undefined
 **invitationId** | [**string**] |  | defaults to undefined


### Return type

**DAOInvitationResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**422** | Unprocessable Entity |  -  |
**200** | Invitation updated successfully |  -  |
**400** | Bad Request |  -  |
**401** | Unauthorized |  -  |
**404** | Invitation, DAO, or user not found |  -  |
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
    featured: true,
    discordServer: "discordServer_example",
    twitter: "twitter_example",
    telegram: "telegram_example",
    instagram: "instagram_example",
    tiktok: "tiktok_example",
    website: "website_example",
    treasury: "treasury_example",
    governanceModel: 1,
    votingPowerSystem: "Defined",
    quorumPercentage: 1,
    profile: { data: Buffer.from(fs.readFileSync('/path/to/file', 'utf-8')), name: '/path/to/file' },
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

# **updateDAOGovernance**
> GovernanceResponse updateDAOGovernance(inputUpdateGovernance)


### Example


```typescript
import { createConfiguration, DaosApi } from '';
import type { DaosApiUpdateDAOGovernanceRequest } from '';

const configuration = createConfiguration();
const apiInstance = new DaosApi(configuration);

const request: DaosApiUpdateDAOGovernanceRequest = {
  
  daoId: "dao_id_example",
  
  inputUpdateGovernance: {
    governanceModel: 1,
    votingPowerSystem: "Defined",
    councilEntryCondition: "Election",
    councilEntryThreshold: 1,
    daoEntryCondition: "Candidature",
    daoEntryThreshold: 1,
    quorumPercentage: 1,
  },
};

const data = await apiInstance.updateDAOGovernance(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **inputUpdateGovernance** | **InputUpdateGovernance**|  |
 **daoId** | [**string**] |  | defaults to undefined


### Return type

**GovernanceResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**422** | Unprocessable Entity |  -  |
**200** | Governance model updated successfully |  -  |
**400** | Bad Request - Invalid data |  -  |
**401** | Unauthorized - Invalid or missing token |  -  |
**404** | DAO not found |  -  |
**0** | Default error response |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **updateDAORole**
> RoleResponse updateDAORole(inputUpdateRole)


### Example


```typescript
import { createConfiguration, DaosApi } from '';
import type { DaosApiUpdateDAORoleRequest } from '';

const configuration = createConfiguration();
const apiInstance = new DaosApi(configuration);

const request: DaosApiUpdateDAORoleRequest = {
  
  daoId: "dao_id_example",
  
  roleId: "role_id_example",
  
  inputUpdateRole: {
    name: "name_example",
    description: "description_example",
  },
};

const data = await apiInstance.updateDAORole(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **inputUpdateRole** | **InputUpdateRole**|  |
 **daoId** | [**string**] |  | defaults to undefined
 **roleId** | [**string**] |  | defaults to undefined


### Return type

**RoleResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**422** | Unprocessable Entity |  -  |
**200** | Role updated successfully |  -  |
**400** | Bad Request - Invalid data |  -  |
**401** | Unauthorized - Invalid or missing token |  -  |
**404** | DAO or role not found |  -  |
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


