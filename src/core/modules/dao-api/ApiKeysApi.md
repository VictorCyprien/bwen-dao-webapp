# .ApiKeysApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**apikeysDeviceIdDelete**](ApiKeysApi.md#apikeysDeviceIdDelete) | **DELETE** /apikeys/{device_id} | Delete an API key
[**createAPIKey**](ApiKeysApi.md#createAPIKey) | **POST** /apikeys/ | Create a new API key for the authenticated user
[**getAPIKeys**](ApiKeysApi.md#getAPIKeys) | **GET** /apikeys/ | List all API keys for the authenticated user


# **apikeysDeviceIdDelete**
> DeleteDeviceResponse apikeysDeviceIdDelete()


### Example


```typescript
import { createConfiguration, ApiKeysApi } from '';
import type { ApiKeysApiApikeysDeviceIdDeleteRequest } from '';

const configuration = createConfiguration();
const apiInstance = new ApiKeysApi(configuration);

const request: ApiKeysApiApikeysDeviceIdDeleteRequest = {
  
  deviceId: "device_id_example",
};

const data = await apiInstance.apikeysDeviceIdDelete(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **deviceId** | [**string**] |  | defaults to undefined


### Return type

**DeleteDeviceResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | API key deleted successfully |  -  |
**401** | Unauthorized |  -  |
**403** | Forbidden |  -  |
**404** | API key not found |  -  |
**0** | Default error response |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **createAPIKey**
> CreateDeviceResponse createAPIKey(createDeviceRequest)

Creates a new API key and returns it to the user.

### Example


```typescript
import { createConfiguration, ApiKeysApi } from '';
import type { ApiKeysApiCreateAPIKeyRequest } from '';

const configuration = createConfiguration();
const apiInstance = new ApiKeysApi(configuration);

const request: ApiKeysApiCreateAPIKeyRequest = {
  
  createDeviceRequest: {
    deviceName: "API Key",
  },
};

const data = await apiInstance.createAPIKey(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **createDeviceRequest** | **CreateDeviceRequest**|  |


### Return type

**CreateDeviceResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**422** | Unprocessable Entity |  -  |
**201** | API key created successfully |  -  |
**404** | User not found |  -  |
**403** | Forbidden |  -  |
**401** | Unauthorized |  -  |
**0** | Default error response |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **getAPIKeys**
> DeviceList getAPIKeys()

Returns a list of API keys (with sensitive information removed)

### Example


```typescript
import { createConfiguration, ApiKeysApi } from '';

const configuration = createConfiguration();
const apiInstance = new ApiKeysApi(configuration);

const request = {};

const data = await apiInstance.getAPIKeys(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters
This endpoint does not need any parameter.


### Return type

**DeviceList**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | List of API keys |  -  |
**404** | User not found |  -  |
**403** | Forbidden |  -  |
**401** | Unauthorized |  -  |
**0** | Default error response |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)


