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
const DEFAULT_AUDIO_FOLDER = '';

/**
 * Debounce function to limit how often a function can be called
 */
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  let pendingPromise: Promise<ReturnType<T>> | null = null;
  
  return (...args: Parameters<T>): Promise<ReturnType<T>> => {
    if (!pendingPromise) {
      pendingPromise = new Promise<ReturnType<T>>((resolve, reject) => {
        if (timeout) {
          clearTimeout(timeout);
        }
        
        timeout = setTimeout(() => {
          timeout = null;
          pendingPromise = null;
          try {
            resolve(func(...args));
          } catch (err) {
            reject(err);
          }
        }, wait);
      });
    }
    
    return pendingPromise;
  };
}

/**
 * SoundService handles audio playback operations
 */
export class SoundService {
  private apiEndpoint: string;
  private soundApi: DefaultApi;
  private audioFolder: string;
  private currentPlayRequest: Promise<any> | null = null;
  private pendingStopRequest = false;
  private lastPlayedFile: string | null = null;
  private isPlaying = false;
  private debouncedStop: () => Promise<{ success: boolean; error?: string }>;

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
    
    // Create debounced stop method
    this.debouncedStop = debounce(this._stop.bind(this), 300);
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
    // If we're already playing this exact file, don't request it again
    if (this.isPlaying && this.lastPlayedFile === filename) {
      return { success: true };
    }
    
    // If we have a pending play request, wait for it to complete first
    if (this.currentPlayRequest) {
      try {
        await this.currentPlayRequest;
      } catch (e) {
        // Ignore errors from previous requests
      }
    }
    
    // Stop any currently playing audio first to prevent conflicts
    if (this.isPlaying) {
      await this.stop();
      // Add a small delay to ensure the stop request is processed
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    try {
      const fullPath = this.audioFolder + filename;
      this.lastPlayedFile = filename;
      this.isPlaying = true;
      
      // Store the promise so we can track the request
      this.currentPlayRequest = this.soundApi.playAudioPlayPost(fullPath);
      
      // Wait for the play request to complete
      await this.currentPlayRequest;
      
      // Clear the current request
      this.currentPlayRequest = null;
      
      return { success: true };
    } catch (error) {
      console.error(`Error playing sound ${filename}:`, error);
      this.isPlaying = false;
      this.currentPlayRequest = null;
      
      // Try fallback if provided
      if (fallbackFilename) {
        try {
          console.warn(`Attempting to play fallback sound: ${fallbackFilename}`);
          const fallbackPath = this.audioFolder + "/" + fallbackFilename;
          
          this.lastPlayedFile = fallbackFilename;
          this.isPlaying = true;
          
          // Store the promise so we can track the request
          this.currentPlayRequest = this.soundApi.playAudioPlayPost(fallbackPath);
          
          // Wait for the play request to complete
          await this.currentPlayRequest;
          
          // Clear the current request
          this.currentPlayRequest = null;
          
          return { success: true };
        } catch (fallbackError) {
          console.error(`Error playing fallback sound ${fallbackFilename}:`, fallbackError);
          this.isPlaying = false;
          this.currentPlayRequest = null;
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
    // Use debounced version to prevent too many stop requests
    return this.debouncedStop();
  }
  
  /**
   * Internal method to stop audio playback
   */
  private async _stop(): Promise<{ success: boolean; error?: string }> {
    // If we already have a pending stop request, just return that
    if (this.pendingStopRequest) {
      return { success: true };
    }
    
    // If nothing is playing, just return success
    if (!this.isPlaying) {
      return { success: true };
    }
    
    // Mark that we're processing a stop request
    this.pendingStopRequest = true;
    
    try {
      // Wait for any current play request to complete first
      if (this.currentPlayRequest) {
        try {
          await this.currentPlayRequest;
        } catch (e) {
          // Ignore errors from play requests
        }
        this.currentPlayRequest = null;
      }
      
      // Call the stop endpoint to stop any playing audio
      await this.soundApi.stopAudioStopPost();
      
      // Reset state
      this.isPlaying = false;
      this.lastPlayedFile = null;
      this.pendingStopRequest = false;
      
      return { success: true };
    } catch (error) {
      console.error('Error stopping audio playback:', error);
      
      // Reset state even on error
      this.isPlaying = false;
      this.lastPlayedFile = null;
      this.pendingStopRequest = false;
      
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