/**
 * Sound Service
 * Handles all API interactions related to playing sounds
 */

import { 
  createConfiguration,
  DefaultApi
} from '../core/modules/bwen-voice';
import { ServerConfiguration } from '../core/modules/bwen-voice/servers';

// Default API endpoint - now using the proxy URL
const DEFAULT_API_ENDPOINT = '/sound';

// Default audio folder path
const DEFAULT_AUDIO_FOLDER = 'audio/babywen';

/**
 * SoundService handles audio playback operations
 */
export class SoundService {
  private apiEndpoint: string;
  private soundApi: DefaultApi;
  private audioFolder: string;

  constructor(apiEndpoint: string = DEFAULT_API_ENDPOINT, audioFolder: string = DEFAULT_AUDIO_FOLDER) {
    this.apiEndpoint = apiEndpoint;
    this.audioFolder = audioFolder;
    
    // Create configuration for the API with custom base URL
    const serverConfig = new ServerConfiguration(this.apiEndpoint, {});
    const configuration = createConfiguration({
      baseServer: serverConfig
    });
    
    // Initialize API client
    this.soundApi = new DefaultApi(configuration);
  }

  /**
   * Set the API endpoint and reinitialize API client
   */
  setApiEndpoint(endpoint: string): void {
    this.apiEndpoint = endpoint;
    
    // Create new configuration with updated endpoint
    const serverConfig = new ServerConfiguration(this.apiEndpoint, {});
    const configuration = createConfiguration({
      baseServer: serverConfig
    });
    
    // Reinitialize API client
    this.soundApi = new DefaultApi(configuration);
  }

  /**
   * Play a sound by filename
   * @param filename The name of the audio file to play (without folder path)
   * @param fallbackFilename Optional fallback file if the main file cannot be played
   * @returns Promise resolving to true if successful, or false with an error message
   */
  async play(filename: string, fallbackFilename?: string): Promise<{ success: boolean; error?: string }> {
    try {
      const fullPath = this.audioFolder + "/" + filename;

      // Call the play endpoint with the full filename path
      await this.soundApi.playAudioPlayPost(fullPath);
      return { success: true };
    } catch (error) {
      console.error(`Error playing sound ${filename}:`, error);
      
      // Try fallback if provided
      if (fallbackFilename) {
        try {
          console.warn(`Attempting to play fallback sound: ${fallbackFilename}`);
          const fallbackPath = this.audioFolder + "/" + fallbackFilename;
          await this.soundApi.playAudioPlayPost(fallbackPath);
          return { success: true };
        } catch (fallbackError) {
          console.error(`Error playing fallback sound ${fallbackFilename}:`, fallbackError);
        }
      }
      
      // Extract error message from the API response if available
      let errorMessage = 'Failed to play sound';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null) {
        // Try to extract API error message
        const anyError = error as any;
        if (anyError.body?.message) {
          errorMessage = anyError.body.message;
        } else if (anyError.message) {
          errorMessage = anyError.message;
        }
      }
      
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Stop any currently playing audio
   * @returns Promise resolving to true if successful, or false with an error message
   */
  async stop(): Promise<{ success: boolean; error?: string }> {
    try {
      // Call the stop endpoint to stop any playing audio
      await this.soundApi.stopAudioStopPost();
      return { success: true };
    } catch (error) {
      console.error('Error stopping audio playback:', error);
      
      // Extract error message from the API response if available
      let errorMessage = 'Failed to stop audio';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null) {
        // Try to extract API error message
        const anyError = error as any;
        if (anyError.body?.message) {
          errorMessage = anyError.body.message;
        } else if (anyError.message) {
          errorMessage = anyError.message;
        }
      }
      
      return { success: false, error: errorMessage };
    }
  }
}

// Create a singleton instance
export const soundService = new SoundService();

// Export default for convenience
export default soundService; 