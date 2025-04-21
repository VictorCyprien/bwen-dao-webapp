# .AuthApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getWalletChallenge**](AuthApi.md#getWalletChallenge) | **POST** /auth/wallet/challenge | Generate a challenge message for Solana wallet signature authentication
[**logout**](AuthApi.md#logout) | **POST** /auth/logout | Logout the user
[**refreshAccessToken**](AuthApi.md#refreshAccessToken) | **POST** /auth/refresh | Refresh access token using a valid refresh token
[**verifyWalletSignature**](AuthApi.md#verifyWalletSignature) | **POST** /auth/wallet/verify | Verify a Solana wallet signature and authenticate the user


# **getWalletChallenge**
> ChallengeResponse getWalletChallenge(challengeRequest)


### Example


```typescript
import { createConfiguration, AuthApi } from '';
import type { AuthApiGetWalletChallengeRequest } from '';

const configuration = createConfiguration();
const apiInstance = new AuthApi(configuration);

const request: AuthApiGetWalletChallengeRequest = {
  
  challengeRequest: {
    walletAddress: "walletAddress_example",
  },
};

const data = await apiInstance.getWalletChallenge(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **challengeRequest** | **ChallengeRequest**|  |


### Return type

**ChallengeResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**422** | Unprocessable Entity |  -  |
**200** | Challenge message generated successfully |  -  |
**404** | User not found |  -  |
**0** | Default error response |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **logout**
> LogoutResponse logout()


### Example


```typescript
import { createConfiguration, AuthApi } from '';

const configuration = createConfiguration();
const apiInstance = new AuthApi(configuration);

const request = {};

const data = await apiInstance.logout(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters
This endpoint does not need any parameter.


### Return type

**LogoutResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**201** | Successfully logged out |  -  |
**401** | Unauthorized - Invalid or missing token |  -  |
**0** | Default error response |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **refreshAccessToken**
> LoginResponse refreshAccessToken()


### Example


```typescript
import { createConfiguration, AuthApi } from '';

const configuration = createConfiguration();
const apiInstance = new AuthApi(configuration);

const request = {};

const data = await apiInstance.refreshAccessToken(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters
This endpoint does not need any parameter.


### Return type

**LoginResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**201** | Token refreshed successfully |  -  |
**401** | Invalid refresh token |  -  |
**0** | Default error response |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **verifyWalletSignature**
> LoginResponse verifyWalletSignature(verifySignature)


### Example


```typescript
import { createConfiguration, AuthApi } from '';
import type { AuthApiVerifyWalletSignatureRequest } from '';

const configuration = createConfiguration();
const apiInstance = new AuthApi(configuration);

const request: AuthApiVerifyWalletSignatureRequest = {
  
  verifySignature: {
    walletAddress: "walletAddress_example",
    signature: "signature_example",
  },
};

const data = await apiInstance.verifyWalletSignature(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **verifySignature** | **VerifySignature**|  |


### Return type

**LoginResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**422** | Unprocessable Entity |  -  |
**201** | Successfully authenticated |  -  |
**401** | Unauthorized or invalid signature |  -  |
**404** | User not found |  -  |
**0** | Default error response |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)


