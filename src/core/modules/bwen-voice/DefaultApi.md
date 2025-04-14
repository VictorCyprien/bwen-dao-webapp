# .DefaultApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getAudioFileAudioFilenameGet**](DefaultApi.md#getAudioFileAudioFilenameGet) | **GET** /audio/{filename} | Get Audio File
[**openOutputFolderOpenOutputFolderPost**](DefaultApi.md#openOutputFolderOpenOutputFolderPost) | **POST** /open_output_folder | Open Output Folder
[**playAudioPlayPost**](DefaultApi.md#playAudioPlayPost) | **POST** /play | Play Audio
[**rootGet**](DefaultApi.md#rootGet) | **GET** / | Root
[**stopAudioStopPost**](DefaultApi.md#stopAudioStopPost) | **POST** /stop | Stop Audio
[**ttsEndpointTtsPost**](DefaultApi.md#ttsEndpointTtsPost) | **POST** /tts | Tts Endpoint


# **getAudioFileAudioFilenameGet**
> any getAudioFileAudioFilenameGet()

Return an audio file from the outputs folder. The user can GET /audio/<filename> to fetch the WAV file.

### Example


```typescript
import { createConfiguration, DefaultApi } from '';
import type { DefaultApiGetAudioFileAudioFilenameGetRequest } from '';

const configuration = createConfiguration();
const apiInstance = new DefaultApi(configuration);

const request: DefaultApiGetAudioFileAudioFilenameGetRequest = {
  
  filename: "filename_example",
};

const data = await apiInstance.getAudioFileAudioFilenameGet(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **filename** | [**string**] |  | defaults to undefined


### Return type

**any**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful Response |  -  |
**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **openOutputFolderOpenOutputFolderPost**
> any openOutputFolderOpenOutputFolderPost()

Open the output folder in the system file explorer (Finder on macOS). This only works when running on localhost for security reasons.

### Example


```typescript
import { createConfiguration, DefaultApi } from '';

const configuration = createConfiguration();
const apiInstance = new DefaultApi(configuration);

const request = {};

const data = await apiInstance.openOutputFolderOpenOutputFolderPost(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters
This endpoint does not need any parameter.


### Return type

**any**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful Response |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **playAudioPlayPost**
> any playAudioPlayPost()

Play audio directly from the server using the AudioPlayer. Expects a filename that exists in the OUTPUT_FOLDER.

### Example


```typescript
import { createConfiguration, DefaultApi } from '';
import type { DefaultApiPlayAudioPlayPostRequest } from '';

const configuration = createConfiguration();
const apiInstance = new DefaultApi(configuration);

const request: DefaultApiPlayAudioPlayPostRequest = {
  
  filename: "filename_example",
};

const data = await apiInstance.playAudioPlayPost(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **filename** | [**string**] |  | defaults to undefined


### Return type

**any**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/x-www-form-urlencoded
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful Response |  -  |
**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **rootGet**
> any rootGet()

Serve the audio_player.html page or a fallback HTML if not found

### Example


```typescript
import { createConfiguration, DefaultApi } from '';

const configuration = createConfiguration();
const apiInstance = new DefaultApi(configuration);

const request = {};

const data = await apiInstance.rootGet(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters
This endpoint does not need any parameter.


### Return type

**any**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful Response |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **stopAudioStopPost**
> any stopAudioStopPost()

Stop any currently playing audio.

### Example


```typescript
import { createConfiguration, DefaultApi } from '';

const configuration = createConfiguration();
const apiInstance = new DefaultApi(configuration);

const request = {};

const data = await apiInstance.stopAudioStopPost(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters
This endpoint does not need any parameter.


### Return type

**any**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful Response |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **ttsEndpointTtsPost**
> any ttsEndpointTtsPost()

POST an x-www-form-urlencoded form with \'text\' (and optional \'voice\' and \'speed\'). We run TTS on the text, save the audio in a unique file, and return JSON with the filename so the client can retrieve it.

### Example


```typescript
import { createConfiguration, DefaultApi } from '';
import type { DefaultApiTtsEndpointTtsPostRequest } from '';

const configuration = createConfiguration();
const apiInstance = new DefaultApi(configuration);

const request: DefaultApiTtsEndpointTtsPostRequest = {
  
  text: "text_example",
  
  voice: "af_heart",
  
  speed: 1.0,
};

const data = await apiInstance.ttsEndpointTtsPost(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **text** | [**string**] |  | defaults to undefined
 **voice** | [**string**] |  | (optional) defaults to 'af_heart'
 **speed** | [**number**] |  | (optional) defaults to 1.0


### Return type

**any**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/x-www-form-urlencoded
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful Response |  -  |
**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)


