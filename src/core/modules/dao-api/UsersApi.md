# .UsersApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createUser**](UsersApi.md#createUser) | **POST** /users/ | Create a new user
[**getAuthUserInfos**](UsersApi.md#getAuthUserInfos) | **GET** /users/@me | Get authenticated user informations
[**getUserWithWalletAddress**](UsersApi.md#getUserWithWalletAddress) | **GET** /users/{wallet_address} | Check if user with the wallet address exists
[**updateUser**](UsersApi.md#updateUser) | **PUT** /users/{user_id} | Update an existing user


# **createUser**
> UserResponse createUser(inputCreateUser)


### Example


```typescript
import { createConfiguration, UsersApi } from '';
import type { UsersApiCreateUserRequest } from '';

const configuration = createConfiguration();
const apiInstance = new UsersApi(configuration);

const request: UsersApiCreateUserRequest = {
  
  inputCreateUser: {
    username: "username_example",
    walletAddress: "walletAddress_example",
    email: "email_example",
    memberName: "memberName_example",
    profilePicture: { data: Buffer.from(fs.readFileSync('/path/to/file', 'utf-8')), name: '/path/to/file' },
  },
};

const data = await apiInstance.createUser(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **inputCreateUser** | **InputCreateUser**|  |


### Return type

**UserResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**422** | Unprocessable Entity |  -  |
**201** | User successfully created |  -  |
**400** | Bad Request |  -  |
**0** | Default error response |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **getAuthUserInfos**
> User getAuthUserInfos()


### Example


```typescript
import { createConfiguration, UsersApi } from '';

const configuration = createConfiguration();
const apiInstance = new UsersApi(configuration);

const request = {};

const data = await apiInstance.getAuthUserInfos(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters
This endpoint does not need any parameter.


### Return type

**User**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | User information retrieved successfully |  -  |
**401** | Unauthorized - Invalid or missing token |  -  |
**0** | Default error response |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **getUserWithWalletAddress**
> UserExistResponse getUserWithWalletAddress()


### Example


```typescript
import { createConfiguration, UsersApi } from '';
import type { UsersApiGetUserWithWalletAddressRequest } from '';

const configuration = createConfiguration();
const apiInstance = new UsersApi(configuration);

const request: UsersApiGetUserWithWalletAddressRequest = {
  
  walletAddress: "wallet_address_example",
};

const data = await apiInstance.getUserWithWalletAddress(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **walletAddress** | [**string**] |  | defaults to undefined


### Return type

**UserExistResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Check if user exists completed successfully |  -  |
**0** | Default error response |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **updateUser**
> UserResponse updateUser(inputUpdateUser)


### Example


```typescript
import { createConfiguration, UsersApi } from '';
import type { UsersApiUpdateUserRequest } from '';

const configuration = createConfiguration();
const apiInstance = new UsersApi(configuration);

const request: UsersApiUpdateUserRequest = {
  
  userId: "user_id_example",
  
  inputUpdateUser: {
    username: "username_example",
    email: "email_example",
    memberName: "memberName_example",
    profilePicture: { data: Buffer.from(fs.readFileSync('/path/to/file', 'utf-8')), name: '/path/to/file' },
  },
};

const data = await apiInstance.updateUser(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **inputUpdateUser** | **InputUpdateUser**|  |
 **userId** | [**string**] |  | defaults to undefined


### Return type

**UserResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**422** | Unprocessable Entity |  -  |
**200** | User updated successfully |  -  |
**400** | Bad Request - Error updating user |  -  |
**401** | Unauthorized - Invalid or missing token |  -  |
**404** | User not found |  -  |
**0** | Default error response |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)


