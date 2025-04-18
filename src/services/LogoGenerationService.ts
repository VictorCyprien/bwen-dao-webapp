import axios from 'axios';

// List of available style options for logo generation
export const LOGO_STYLES = [
  { id: 'minimalist', name: 'Minimalist', description: 'Clean, simple, modern design' },
  { id: 'futuristic', name: 'Futuristic', description: 'High-tech, digital, innovative' },
  { id: 'abstract', name: 'Abstract', description: 'Artistic, symbolic, unique' },
  { id: 'geometric', name: 'Geometric', description: 'Shapes, patterns, structured' },
  { id: 'gradient', name: 'Gradient', description: 'Smooth color transitions, vibrant' }
];

/**
 * Service for generating logos using Replicate API
 */
class LogoGenerationServiceClass {
  private apiToken: string;

  constructor() {
    // Use the environment variable
    this.apiToken = import.meta.env.VITE_REPLICATE_API_TOKEN || '';
    
    // Check if we have a token
    if (!this.apiToken) {
      console.warn('Replicate API token is not defined in environment variables');
    }
  }

  /**
   * Check if we can generate a logo
   */
  canGenerate(): boolean {
    return true;
  }

  /**
   * Get the number of remaining generations - returns a high number since there's no limit
   */
  getRemainingGenerations(): number {
    return 99999; // Effectively unlimited
  }

  /**
   * Generate a logo using Replicate API
   * @param daoName - DAO name to include in the prompt
   * @param style - Style of the logo
   * @returns URL to the generated image
   */
  async generateLogo(daoName: string, style: string): Promise<string> {
    if (!this.apiToken) {
      throw new Error('Replicate API token is not configured');
    }

    try {
      // Log the DAO name we're using
      console.log('==== LOGO GENERATION ====');
      console.log(`DAO Name: "${daoName}"`);
      console.log(`Style: ${style}`);
      
      // Construct a good prompt based on the style
      let prompt = this.constructPrompt(daoName, style);
      
      // Random seed for variety
      const seed = Math.floor(Math.random() * 1000000);
      
      console.log('Prompt:', prompt);
      console.log('Seed:', seed);
      
      // Make API request to Replicate through our proxy
      const response = await axios.post(
        '/replicate/v1/predictions',
        {
          // Model ID for prunaai/hidream-l1-fast
          version: "f67f0ec7ef9fe91b74e8a68d34efaa9145bec28675cb190cbff8a70f0490256e",
          input: {
            prompt: prompt,
            seed: seed,
            speed_mode: "Extra Juiced 🚀 (even more speed)",
            output_quality: 80
          }
        },
        {
          headers: {
            'Authorization': `Token ${this.apiToken}`,
            'Content-Type': 'application/json',
          }
        }
      );

      // Get the prediction ID
      const predictionId = response.data.id;
      console.log('Prediction ID:', predictionId);
      
      // Poll for results
      let imageUrl = '';
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
        console.log('Status:', status);
        
        // If completed, get the output
        if (status === 'succeeded') {
          // The output from Replicate is usually a URL to the generated image
          // HiDream returns an array with a single URL
          if (Array.isArray(statusResponse.data.output)) {
            imageUrl = statusResponse.data.output[0] || '';
          } else {
            imageUrl = statusResponse.data.output || '';
          }
          console.log('Image URL:', imageUrl);
        }
      }
      
      if (status === 'failed') {
        throw new Error('Logo generation failed');
      }
      
      if (!imageUrl) {
        throw new Error('No image URL returned from API');
      }
      
      return imageUrl;
    } catch (error) {
      console.error('Error in logo generation service:', error);
      throw error;
    }
  }

  /**
   * Construct a prompt for the logo based on the style
   */
  private constructPrompt(daoName: string, style: string): string {
    const basePrompt = `Create a professional logo for a DAO (Decentralized Autonomous Organization) called "${daoName}"`;
    
    switch (style) {
      case 'minimalist':
        return `${basePrompt}. Minimalist style, clean lines, simple geometry, modern and professional. Suitable for blockchain and Web3 projects.`;
      
      case 'futuristic':
        return `${basePrompt}. Futuristic style with digital elements, tech-inspired, innovative. Use glowing effects and circuit-like patterns. Suitable for cutting-edge blockchain projects.`;
      
      case 'abstract':
        return `${basePrompt}. Abstract and artistic style, with flowing organic shapes. Creative and unique, conveying innovation and forward-thinking. Suitable for creative DAOs.`;
      
      case 'geometric':
        return `${basePrompt}. Geometric style with precise shapes and patterns. Structured, mathematical, and balanced. Suitable for finance or governance DAOs.`;
      
      case 'gradient':
        return `${basePrompt}. Modern gradient style with smooth color transitions. Vibrant, eye-catching with purple and blue tones. Contemporary and digital-looking.`;
      
      default:
        return `${basePrompt}. Modern, professional design suitable for a blockchain organization. Balance of creativity and professionalism.`;
    }
  }
}

export const logoGenerationService = new LogoGenerationServiceClass(); 