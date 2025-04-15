import { ResponseContext, RequestContext, HttpFile, HttpInfo } from '../http/http';
import { Configuration, ConfigurationOptions } from '../configuration'
import type { Middleware } from '../middleware';

import { HTTPValidationError } from '../models/HTTPValidationError';
import { ValidationError } from '../models/ValidationError';
import { ValidationErrorLocInner } from '../models/ValidationErrorLocInner';

import { ObservableDefaultApi } from "./ObservableAPI";
import { DefaultApiRequestFactory, DefaultApiResponseProcessor} from "../apis/DefaultApi";

export interface DefaultApiGetAudioFileAudioFilenameGetRequest {
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof DefaultApigetAudioFileAudioFilenameGet
     */
    filename: string
}

export interface DefaultApiOpenOutputFolderOpenOutputFolderPostRequest {
}

export interface DefaultApiPlayAudioPlayPostRequest {
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof DefaultApiplayAudioPlayPost
     */
    filename: string
}

export interface DefaultApiRootGetRequest {
}

export interface DefaultApiStopAudioStopPostRequest {
}

export interface DefaultApiTtsEndpointTtsPostRequest {
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof DefaultApittsEndpointTtsPost
     */
    text: string
    /**
     * 
     * Defaults to: &#39;af_heart&#39;
     * @type string
     * @memberof DefaultApittsEndpointTtsPost
     */
    voice?: string
    /**
     * 
     * Defaults to: 1.0
     * @type number
     * @memberof DefaultApittsEndpointTtsPost
     */
    speed?: number
}

export class ObjectDefaultApi {
    private api: ObservableDefaultApi

    public constructor(configuration: Configuration, requestFactory?: DefaultApiRequestFactory, responseProcessor?: DefaultApiResponseProcessor) {
        this.api = new ObservableDefaultApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Return an audio file from the outputs folder. The user can GET /audio/<filename> to fetch the WAV file.
     * Get Audio File
     * @param param the request object
     */
    public getAudioFileAudioFilenameGetWithHttpInfo(param: DefaultApiGetAudioFileAudioFilenameGetRequest, options?: ConfigurationOptions): Promise<HttpInfo<any>> {
        return this.api.getAudioFileAudioFilenameGetWithHttpInfo(param.filename,  options).toPromise();
    }

    /**
     * Return an audio file from the outputs folder. The user can GET /audio/<filename> to fetch the WAV file.
     * Get Audio File
     * @param param the request object
     */
    public getAudioFileAudioFilenameGet(param: DefaultApiGetAudioFileAudioFilenameGetRequest, options?: ConfigurationOptions): Promise<any> {
        return this.api.getAudioFileAudioFilenameGet(param.filename,  options).toPromise();
    }

    /**
     * Open the output folder in the system file explorer (Finder on macOS). This only works when running on localhost for security reasons.
     * Open Output Folder
     * @param param the request object
     */
    public openOutputFolderOpenOutputFolderPostWithHttpInfo(param: DefaultApiOpenOutputFolderOpenOutputFolderPostRequest = {}, options?: ConfigurationOptions): Promise<HttpInfo<any>> {
        return this.api.openOutputFolderOpenOutputFolderPostWithHttpInfo( options).toPromise();
    }

    /**
     * Open the output folder in the system file explorer (Finder on macOS). This only works when running on localhost for security reasons.
     * Open Output Folder
     * @param param the request object
     */
    public openOutputFolderOpenOutputFolderPost(param: DefaultApiOpenOutputFolderOpenOutputFolderPostRequest = {}, options?: ConfigurationOptions): Promise<any> {
        return this.api.openOutputFolderOpenOutputFolderPost( options).toPromise();
    }

    /**
     * Play audio directly from the server using the AudioPlayer. Expects a filename that exists in the OUTPUT_FOLDER.
     * Play Audio
     * @param param the request object
     */
    public playAudioPlayPostWithHttpInfo(param: DefaultApiPlayAudioPlayPostRequest, options?: ConfigurationOptions): Promise<HttpInfo<any>> {
        return this.api.playAudioPlayPostWithHttpInfo(param.filename,  options).toPromise();
    }

    /**
     * Play audio directly from the server using the AudioPlayer. Expects a filename that exists in the OUTPUT_FOLDER.
     * Play Audio
     * @param param the request object
     */
    public playAudioPlayPost(param: DefaultApiPlayAudioPlayPostRequest, options?: ConfigurationOptions): Promise<any> {
        return this.api.playAudioPlayPost(param.filename,  options).toPromise();
    }

    /**
     * Serve the audio_player.html page or a fallback HTML if not found
     * Root
     * @param param the request object
     */
    public rootGetWithHttpInfo(param: DefaultApiRootGetRequest = {}, options?: ConfigurationOptions): Promise<HttpInfo<any>> {
        return this.api.rootGetWithHttpInfo( options).toPromise();
    }

    /**
     * Serve the audio_player.html page or a fallback HTML if not found
     * Root
     * @param param the request object
     */
    public rootGet(param: DefaultApiRootGetRequest = {}, options?: ConfigurationOptions): Promise<any> {
        return this.api.rootGet( options).toPromise();
    }

    /**
     * Stop any currently playing audio.
     * Stop Audio
     * @param param the request object
     */
    public stopAudioStopPostWithHttpInfo(param: DefaultApiStopAudioStopPostRequest = {}, options?: ConfigurationOptions): Promise<HttpInfo<any>> {
        return this.api.stopAudioStopPostWithHttpInfo( options).toPromise();
    }

    /**
     * Stop any currently playing audio.
     * Stop Audio
     * @param param the request object
     */
    public stopAudioStopPost(param: DefaultApiStopAudioStopPostRequest = {}, options?: ConfigurationOptions): Promise<any> {
        return this.api.stopAudioStopPost( options).toPromise();
    }

    /**
     * POST an x-www-form-urlencoded form with \'text\' (and optional \'voice\' and \'speed\'). We run TTS on the text, save the audio in a unique file, and return JSON with the filename so the client can retrieve it.
     * Tts Endpoint
     * @param param the request object
     */
    public ttsEndpointTtsPostWithHttpInfo(param: DefaultApiTtsEndpointTtsPostRequest, options?: ConfigurationOptions): Promise<HttpInfo<any>> {
        return this.api.ttsEndpointTtsPostWithHttpInfo(param.text, param.voice, param.speed,  options).toPromise();
    }

    /**
     * POST an x-www-form-urlencoded form with \'text\' (and optional \'voice\' and \'speed\'). We run TTS on the text, save the audio in a unique file, and return JSON with the filename so the client can retrieve it.
     * Tts Endpoint
     * @param param the request object
     */
    public ttsEndpointTtsPost(param: DefaultApiTtsEndpointTtsPostRequest, options?: ConfigurationOptions): Promise<any> {
        return this.api.ttsEndpointTtsPost(param.text, param.voice, param.speed,  options).toPromise();
    }

}
