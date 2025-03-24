# .TelegramAuthApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**disconnectTelegram**](TelegramAuthApi.md#disconnectTelegram) | **DELETE** /auth/telegram/disconnect | Disconnect Telegram account
[**telegramCallback**](TelegramAuthApi.md#telegramCallback) | **POST** /auth/telegram/callback | Process Telegram authentication data


# **disconnectTelegram**
> DisconnectResponse disconnectTelegram()

Removes the connection between the user\'s account and their Telegram account.

### Example


```typescript
import { createConfiguration, TelegramAuthApi } from '';

const configuration = createConfiguration();
const apiInstance = new TelegramAuthApi(configuration);

const request = {};

const data = await apiInstance.disconnectTelegram(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters
This endpoint does not need any parameter.


### Return type

**DisconnectResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**500** | Error disconnecting account |  -  |
**404** | No connection found |  -  |
**401** | Unauthorized |  -  |
**200** | Connection successfully removed |  -  |
**0** | Default error response |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **telegramCallback**
> ConnectionResponse telegramCallback(telegramAuth)

Handles the authentication data from the Telegram Login Widget.

### Example


```typescript
import { createConfiguration, TelegramAuthApi } from '';
import type { TelegramAuthApiTelegramCallbackRequest } from '';

const configuration = createConfiguration();
const apiInstance = new TelegramAuthApi(configuration);

const request: TelegramAuthApiTelegramCallbackRequest = {
  
  telegramAuth: {
    id: 1,
    firstName: "firstName_example",
    lastName: "lastName_example",
    username: "username_example",
    photoUrl: "photoUrl_example",
    authDate: 1,
    hash: "hash_example",
  },
};

const data = await apiInstance.telegramCallback(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **telegramAuth** | **TelegramAuth**|  |


### Return type

**ConnectionResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**422** | Unprocessable Entity |  -  |
**200** | Account successfully linked |  -  |
**500** | Error saving connection |  -  |
**400** | Invalid or missing data |  -  |
**401** | Unauthorized |  -  |
**0** | Default error response |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)


