import { ResponseContext, RequestContext, HttpFile, HttpInfo } from '../http/http';
import { Configuration, ConfigurationOptions, PromiseConfigurationOptions } from '../configuration'
import { PromiseMiddleware, Middleware, PromiseMiddlewareWrapper } from '../middleware';

import { HTTPValidationError } from '../models/HTTPValidationError';
import { ValidationError } from '../models/ValidationError';
import { ValidationErrorLocInner } from '../models/ValidationErrorLocInner';
import { ObservableDefaultApi } from './ObservableAPI';

import { DefaultApiRequestFactory, DefaultApiResponseProcessor} from "../apis/DefaultApi";
export class PromiseDefaultApi {
    private api: ObservableDefaultApi

    public constructor(
        configuration: Configuration,
        requestFactory?: DefaultApiRequestFactory,
        responseProcessor?: DefaultApiResponseProcessor
    ) {
        this.api = new ObservableDefaultApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Return an audio file from the outputs folder. The user can GET /audio/<filename> to fetch the WAV file.
     * Get Audio File
     * @param filename
     */
    public getAudioFileAudioFilenameGetWithHttpInfo(filename: string, _options?: PromiseConfigurationOptions): Promise<HttpInfo<any>> {
        let observableOptions: undefined | ConfigurationOptions
        if (_options){
	    observableOptions = {
                baseServer: _options.baseServer,
                httpApi: _options.httpApi,
                middleware: _options.middleware?.map(
                    m => new PromiseMiddlewareWrapper(m)
		),
		middlewareMergeStrategy: _options.middlewareMergeStrategy,
                authMethods: _options.authMethods
	    }
	}
        const result = this.api.getAudioFileAudioFilenameGetWithHttpInfo(filename, observableOptions);
        return result.toPromise();
    }

    /**
     * Return an audio file from the outputs folder. The user can GET /audio/<filename> to fetch the WAV file.
     * Get Audio File
     * @param filename
     */
    public getAudioFileAudioFilenameGet(filename: string, _options?: PromiseConfigurationOptions): Promise<any> {
        let observableOptions: undefined | ConfigurationOptions
        if (_options){
	    observableOptions = {
                baseServer: _options.baseServer,
                httpApi: _options.httpApi,
                middleware: _options.middleware?.map(
                    m => new PromiseMiddlewareWrapper(m)
		),
		middlewareMergeStrategy: _options.middlewareMergeStrategy,
                authMethods: _options.authMethods
	    }
	}
        const result = this.api.getAudioFileAudioFilenameGet(filename, observableOptions);
        return result.toPromise();
    }

    /**
     * Open the output folder in the system file explorer (Finder on macOS). This only works when running on localhost for security reasons.
     * Open Output Folder
     */
    public openOutputFolderOpenOutputFolderPostWithHttpInfo(_options?: PromiseConfigurationOptions): Promise<HttpInfo<any>> {
        let observableOptions: undefined | ConfigurationOptions
        if (_options){
	    observableOptions = {
                baseServer: _options.baseServer,
                httpApi: _options.httpApi,
                middleware: _options.middleware?.map(
                    m => new PromiseMiddlewareWrapper(m)
		),
		middlewareMergeStrategy: _options.middlewareMergeStrategy,
                authMethods: _options.authMethods
	    }
	}
        const result = this.api.openOutputFolderOpenOutputFolderPostWithHttpInfo(observableOptions);
        return result.toPromise();
    }

    /**
     * Open the output folder in the system file explorer (Finder on macOS). This only works when running on localhost for security reasons.
     * Open Output Folder
     */
    public openOutputFolderOpenOutputFolderPost(_options?: PromiseConfigurationOptions): Promise<any> {
        let observableOptions: undefined | ConfigurationOptions
        if (_options){
	    observableOptions = {
                baseServer: _options.baseServer,
                httpApi: _options.httpApi,
                middleware: _options.middleware?.map(
                    m => new PromiseMiddlewareWrapper(m)
		),
		middlewareMergeStrategy: _options.middlewareMergeStrategy,
                authMethods: _options.authMethods
	    }
	}
        const result = this.api.openOutputFolderOpenOutputFolderPost(observableOptions);
        return result.toPromise();
    }

    /**
     * Play audio directly from the server using the AudioPlayer. Expects a filename that exists in the OUTPUT_FOLDER.
     * Play Audio
     * @param filename
     */
    public playAudioPlayPostWithHttpInfo(filename: string, _options?: PromiseConfigurationOptions): Promise<HttpInfo<any>> {
        let observableOptions: undefined | ConfigurationOptions
        if (_options){
	    observableOptions = {
                baseServer: _options.baseServer,
                httpApi: _options.httpApi,
                middleware: _options.middleware?.map(
                    m => new PromiseMiddlewareWrapper(m)
		),
		middlewareMergeStrategy: _options.middlewareMergeStrategy,
                authMethods: _options.authMethods
	    }
	}
        const result = this.api.playAudioPlayPostWithHttpInfo(filename, observableOptions);
        return result.toPromise();
    }

    /**
     * Play audio directly from the server using the AudioPlayer. Expects a filename that exists in the OUTPUT_FOLDER.
     * Play Audio
     * @param filename
     */
    public playAudioPlayPost(filename: string, _options?: PromiseConfigurationOptions): Promise<any> {
        let observableOptions: undefined | ConfigurationOptions
        if (_options){
	    observableOptions = {
                baseServer: _options.baseServer,
                httpApi: _options.httpApi,
                middleware: _options.middleware?.map(
                    m => new PromiseMiddlewareWrapper(m)
		),
		middlewareMergeStrategy: _options.middlewareMergeStrategy,
                authMethods: _options.authMethods
	    }
	}
        const result = this.api.playAudioPlayPost(filename, observableOptions);
        return result.toPromise();
    }

    /**
     * Serve the audio_player.html page or a fallback HTML if not found
     * Root
     */
    public rootGetWithHttpInfo(_options?: PromiseConfigurationOptions): Promise<HttpInfo<any>> {
        let observableOptions: undefined | ConfigurationOptions
        if (_options){
	    observableOptions = {
                baseServer: _options.baseServer,
                httpApi: _options.httpApi,
                middleware: _options.middleware?.map(
                    m => new PromiseMiddlewareWrapper(m)
		),
		middlewareMergeStrategy: _options.middlewareMergeStrategy,
                authMethods: _options.authMethods
	    }
	}
        const result = this.api.rootGetWithHttpInfo(observableOptions);
        return result.toPromise();
    }

    /**
     * Serve the audio_player.html page or a fallback HTML if not found
     * Root
     */
    public rootGet(_options?: PromiseConfigurationOptions): Promise<any> {
        let observableOptions: undefined | ConfigurationOptions
        if (_options){
	    observableOptions = {
                baseServer: _options.baseServer,
                httpApi: _options.httpApi,
                middleware: _options.middleware?.map(
                    m => new PromiseMiddlewareWrapper(m)
		),
		middlewareMergeStrategy: _options.middlewareMergeStrategy,
                authMethods: _options.authMethods
	    }
	}
        const result = this.api.rootGet(observableOptions);
        return result.toPromise();
    }

    /**
     * Stop any currently playing audio.
     * Stop Audio
     */
    public stopAudioStopPostWithHttpInfo(_options?: PromiseConfigurationOptions): Promise<HttpInfo<any>> {
        let observableOptions: undefined | ConfigurationOptions
        if (_options){
	    observableOptions = {
                baseServer: _options.baseServer,
                httpApi: _options.httpApi,
                middleware: _options.middleware?.map(
                    m => new PromiseMiddlewareWrapper(m)
		),
		middlewareMergeStrategy: _options.middlewareMergeStrategy,
                authMethods: _options.authMethods
	    }
	}
        const result = this.api.stopAudioStopPostWithHttpInfo(observableOptions);
        return result.toPromise();
    }

    /**
     * Stop any currently playing audio.
     * Stop Audio
     */
    public stopAudioStopPost(_options?: PromiseConfigurationOptions): Promise<any> {
        let observableOptions: undefined | ConfigurationOptions
        if (_options){
	    observableOptions = {
                baseServer: _options.baseServer,
                httpApi: _options.httpApi,
                middleware: _options.middleware?.map(
                    m => new PromiseMiddlewareWrapper(m)
		),
		middlewareMergeStrategy: _options.middlewareMergeStrategy,
                authMethods: _options.authMethods
	    }
	}
        const result = this.api.stopAudioStopPost(observableOptions);
        return result.toPromise();
    }

    /**
     * POST an x-www-form-urlencoded form with \'text\' (and optional \'voice\' and \'speed\'). We run TTS on the text, save the audio in a unique file, and return JSON with the filename so the client can retrieve it.
     * Tts Endpoint
     * @param text
     * @param [voice]
     * @param [speed]
     */
    public ttsEndpointTtsPostWithHttpInfo(text: string, voice?: string, speed?: number, _options?: PromiseConfigurationOptions): Promise<HttpInfo<any>> {
        let observableOptions: undefined | ConfigurationOptions
        if (_options){
	    observableOptions = {
                baseServer: _options.baseServer,
                httpApi: _options.httpApi,
                middleware: _options.middleware?.map(
                    m => new PromiseMiddlewareWrapper(m)
		),
		middlewareMergeStrategy: _options.middlewareMergeStrategy,
                authMethods: _options.authMethods
	    }
	}
        const result = this.api.ttsEndpointTtsPostWithHttpInfo(text, voice, speed, observableOptions);
        return result.toPromise();
    }

    /**
     * POST an x-www-form-urlencoded form with \'text\' (and optional \'voice\' and \'speed\'). We run TTS on the text, save the audio in a unique file, and return JSON with the filename so the client can retrieve it.
     * Tts Endpoint
     * @param text
     * @param [voice]
     * @param [speed]
     */
    public ttsEndpointTtsPost(text: string, voice?: string, speed?: number, _options?: PromiseConfigurationOptions): Promise<any> {
        let observableOptions: undefined | ConfigurationOptions
        if (_options){
	    observableOptions = {
                baseServer: _options.baseServer,
                httpApi: _options.httpApi,
                middleware: _options.middleware?.map(
                    m => new PromiseMiddlewareWrapper(m)
		),
		middlewareMergeStrategy: _options.middlewareMergeStrategy,
                authMethods: _options.authMethods
	    }
	}
        const result = this.api.ttsEndpointTtsPost(text, voice, speed, observableOptions);
        return result.toPromise();
    }


}



