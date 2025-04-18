import axios from 'axios';

/**
 * Service for interacting with Replicate AI API
 */
class ReplicateServiceClass {
  private apiToken: string;
  private MIN_INPUT_LENGTH = 50; // Minimum input length required

  constructor() {
    // Use the environment variable
    this.apiToken = import.meta.env.VITE_REPLICATE_API_TOKEN || '';
    
    if (!this.apiToken) {
      console.warn('Replicate API token is not defined in environment variables');
    }
  }

  /**
   * Improve text using Replicate's Llama 4 model
   * @param text - The original text to improve
   * @param maxLength - Maximum length of the improved text
   * @returns The improved text
   */
  async improveText(text: string, maxLength: number = 300): Promise<string> {
    try {
      // Check if the input is too short
      if (text.trim().length < this.MIN_INPUT_LENGTH) {
        throw new Error(`Description is too short. Please provide at least ${this.MIN_INPUT_LENGTH} characters to improve.`);
      }
      
      console.log('Starting API request to proxy Replicate');
      
      // API request to Replicate through our proxy
      const response = await axios.post(
        '/replicate/v1/predictions',
        {
          version: "c0b2e67438a7dd156a29e27155abcef9f98eec3e9de16ed0d7b11d449828fcd3",
          input: {
            prompt: `Improve this DAO (Decentralized Autonomous Organization) description by making it more clear, concise, and compelling. The description should be between 200-${maxLength} characters. IMPORTANT: Output ONLY the improved description, with NO explanations, NO introductions like "Here is" or "I have improved", and NO quotation marks around it. Ensure the description addresses the DAO's purpose, vision, and unique value proposition:\n\n${text}`,
            max_tokens: maxLength + 100, // Add buffer for processing
            temperature: 0.7,
            top_p: 0.9
          },
        },
        {
          headers: {
            'Authorization': `Token ${this.apiToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Get the prediction ID
      const predictionId = response.data.id;
      console.log('Received prediction ID:', predictionId);
      
      // Poll for results
      let improvedText = '';
      let status = 'starting';
      
      while (status !== 'succeeded' && status !== 'failed') {
        // Wait for 1 second between polls
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check prediction status through proxy
        const statusResponse = await axios.get(
          `/replicate/v1/predictions/${predictionId}`,
          {
            headers: {
              'Authorization': `Token ${this.apiToken}`,
              'Content-Type': 'application/json',
            },
          }
        );
        
        status = statusResponse.data.status;
        console.log('Prediction status:', status);
        
        // If completed, get the output
        if (status === 'succeeded') {
          // The output is an array of strings that need to be joined
          if (Array.isArray(statusResponse.data.output)) {
            improvedText = statusResponse.data.output.join('');
          } else {
            improvedText = statusResponse.data.output || '';
          }
          console.log('Received improved text from API');
        }
      }
      
      if (status === 'failed') {
        throw new Error('Replicate API prediction failed');
      }
      
      // Clean up the text to remove common patterns from AI responses
      improvedText = improvedText.trim();
      
      // Remove quotation marks around the text
      improvedText = improvedText.replace(/^["'](.*)["']$/s, '$1');
      
      // Remove any meta descriptions or explanations
      improvedText = improvedText.replace(/^(here is|i have improved|improved version:|here's|here's the improved version:)/i, '');
      improvedText = improvedText.replace(/^(the improved description is:)/i, '');
      improvedText = improvedText.replace(/^["'\s]*(.*?)["'\s]*$/s, '$1');
      
      // Remove any trailing notes or explanations
      const explanationPatterns = [
        /however,.*$/is,
        /this description.*$/is,
        /\. note that.*$/is,
        /\. this is.*$/is,
        /\. the character count.*$/is
      ];
      
      for (const pattern of explanationPatterns) {
        improvedText = improvedText.replace(pattern, '');
      }
      
      // Ensure it's not too long
      if (improvedText.length > maxLength) {
        improvedText = improvedText.substring(0, maxLength - 3) + '...';
      }
      
      return improvedText.trim();
    } catch (error) {
      console.error('Error in Replicate service:', error);
      throw error;
    }
  }
}

export const replicateService = new ReplicateServiceClass(); 