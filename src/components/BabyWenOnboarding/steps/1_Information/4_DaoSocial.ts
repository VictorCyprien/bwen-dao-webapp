import { OnboardingStep, StepId } from '../../../BabyWenOnboarding';

const DaoSocialStep: OnboardingStep = {
  id: 'dao-social',
  messages: [
    {
      content: "Let's connect your DAO with the world! Add your social media links."
    }
  ],
  formFields: [
    {
      id: 'website',
      label: 'Website',
      type: 'text',
      placeholder: 'Enter your website URL',
      required: false,
      validator: (value: string) => {
        if (!value) return { isValid: true };
        // Check if it's a valid URL with http/https protocol
        const urlRegex = /^(https?:\/\/)[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
        if (!urlRegex.test(value)) {
          return {
            isValid: false,
            errorMessage: 'Website must start with http:// or https:// (e.g., https://example.com)'
          };
        }
        return { isValid: true };
      }
    },
    {
      id: 'twitter',
      label: 'X',
      type: 'text',
      placeholder: 'x.com/USERNAME or twitter.com/USERNAME',
      required: false,
      validator: (value: string) => {
        if (!value) return { isValid: true };
        
        // Normalize the input
        let normalizedValue = value.trim().toLowerCase();
        
        // Add https:// if missing
        if (!normalizedValue.startsWith('http')) {
          normalizedValue = 'https://' + normalizedValue;
        }
        
        try {
          const url = new URL(normalizedValue);
          
          // Check if it's x.com or twitter.com domain
          if (!(url.hostname === 'x.com' || url.hostname === 'twitter.com')) {
            return {
              isValid: false,
              errorMessage: 'X link must be in format x.com/USERNAME or twitter.com/USERNAME'
            };
          }
          
          // Check if it has a username path (not empty and not just '/')
          const username = url.pathname.substring(1);
          if (!username || username.length < 1) {
            return {
              isValid: false,
              errorMessage: 'X link must include a USERNAME (e.g., x.com/YourUsername)'
            };
          }
          
          return { isValid: true };
        } catch (e) {
          return {
            isValid: false,
            errorMessage: 'X link must be in format x.com/USERNAME or twitter.com/USERNAME'
          };
        }
      }
    },
    {
      id: 'telegram',
      label: 'Telegram',
      type: 'text',
      placeholder: 't.me/USERNAME',
      required: false,
      validator: (value: string) => {
        if (!value) return { isValid: true };
        
        // Normalize the input
        let normalizedValue = value.trim().toLowerCase();
        
        // Add https:// if missing
        if (!normalizedValue.startsWith('http')) {
          normalizedValue = 'https://' + normalizedValue;
        }
        
        try {
          const url = new URL(normalizedValue);
          
          // Check if it's t.me domain
          if (url.hostname !== 't.me') {
            return {
              isValid: false,
              errorMessage: 'Telegram link must be in format t.me/USERNAME'
            };
          }
          
          // Check if it has a username path (not empty and not just '/')
          const username = url.pathname.substring(1);
          if (!username || username.length < 1) {
            return {
              isValid: false,
              errorMessage: 'Telegram link must include a USERNAME (e.g., t.me/YourUsername)'
            };
          }
          
          return { isValid: true };
        } catch (e) {
          return {
            isValid: false,
            errorMessage: 'Telegram link must be in format t.me/USERNAME'
          };
        }
      }
    },
    {
      id: 'discord',
      label: 'Discord',
      type: 'text',
      placeholder: 'discord.gg/SERVER_INVITE',
      required: false,
      validator: (value: string) => {
        if (!value) return { isValid: true };
        
        // Normalize the input
        let normalizedValue = value.trim().toLowerCase();
        
        // Add https:// if missing
        if (!normalizedValue.startsWith('http')) {
          normalizedValue = 'https://' + normalizedValue;
        }
        
        try {
          const url = new URL(normalizedValue);
          
          // Check if it's discord.gg domain
          if (url.hostname !== 'discord.gg') {
            return {
              isValid: false,
              errorMessage: 'Discord link must be in format discord.gg/SERVER_INVITE'
            };
          }
          
          // Check if it has an invite code (not empty and not just '/')
          const inviteCode = url.pathname.substring(1);
          if (!inviteCode || inviteCode.length < 1) {
            return {
              isValid: false,
              errorMessage: 'Discord link must include a SERVER_INVITE (e.g., discord.gg/YourInviteCode)'
            };
          }
          
          return { isValid: true };
        } catch (e) {
          return {
            isValid: false,
            errorMessage: 'Discord link must be in format discord.gg/SERVER_INVITE'
          };
        }
      }
    },
    {
      id: 'instagram',
      label: 'Instagram',
      type: 'text',
      placeholder: 'instagram.com/USERNAME',
      required: false,
      validator: (value: string) => {
        if (!value) return { isValid: true };
        
        // Normalize the input
        let normalizedValue = value.trim().toLowerCase();
        
        // Add https:// if missing
        if (!normalizedValue.startsWith('http')) {
          normalizedValue = 'https://' + normalizedValue;
        }
        
        try {
          const url = new URL(normalizedValue);
          
          // Check if it's instagram.com domain
          if (url.hostname !== 'instagram.com') {
            return {
              isValid: false,
              errorMessage: 'Instagram link must be in format instagram.com/USERNAME'
            };
          }
          
          // Check if it has a username path (not empty and not just '/')
          const username = url.pathname.substring(1);
          if (!username || username.length < 1) {
            return {
              isValid: false,
              errorMessage: 'Instagram link must include a USERNAME (e.g., instagram.com/YourUsername)'
            };
          }
          
          return { isValid: true };
        } catch (e) {
          return {
            isValid: false,
            errorMessage: 'Instagram link must be in format instagram.com/USERNAME'
          };
        }
      }
    },
    {
      id: 'tiktok',
      label: 'TikTok',
      type: 'text',
      placeholder: 'tiktok.com/@USERNAME',
      required: false,
      validator: (value: string) => {
        if (!value) return { isValid: true };
        
        // Normalize the input
        let normalizedValue = value.trim().toLowerCase();
        
        // Add https:// if missing
        if (!normalizedValue.startsWith('http')) {
          normalizedValue = 'https://' + normalizedValue;
        }
        
        try {
          const url = new URL(normalizedValue);
          
          // Check if it's tiktok.com domain
          if (url.hostname !== 'tiktok.com') {
            return {
              isValid: false,
              errorMessage: 'TikTok link must be in format tiktok.com/@USERNAME'
            };
          }
          
          // Check if it has a username path that starts with @
          const pathname = url.pathname;
          if (!pathname.startsWith('/@')) {
            return {
              isValid: false,
              errorMessage: 'TikTok link must include @USERNAME (e.g., tiktok.com/@YourUsername)'
            };
          }
          
          // Make sure there's a username after the @
          const username = pathname.substring(2); // Skip the /@
          if (!username || username.length < 1) {
            return {
              isValid: false,
              errorMessage: 'TikTok link must include a valid username (e.g., tiktok.com/@YourUsername)'
            };
          }
          
          return { isValid: true };
        } catch (e) {
          return {
            isValid: false,
            errorMessage: 'TikTok link must be in format tiktok.com/@USERNAME'
          };
        }
      }
    }
  ],
  onResponse: (response: string) => {
    try {
      // Parse social links if available
      const data = JSON.parse(response);
      const socialLinks = Object.entries(data)
        .filter(([_, value]) => value !== '')
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ');

      // Store social links in sessionStorage
      if (data.websiteUrl) {
        sessionStorage.setItem('websiteUrl', data.websiteUrl);
      }
      if (data.twitterUrl) {
        sessionStorage.setItem('twitterUrl', data.twitterUrl);
      }
      if (data.discordUrl) {
        sessionStorage.setItem('discordUrl', data.discordUrl);
      }

      // TODO: Add other social links later
      
      const responseMessage = socialLinks 
        ? `I've saved your social links: ${socialLinks}. Now let's set up your governance model!` 
        : "I've noted that you don't have any social links yet. No problem! Let's set up your governance model!";
      
      return {
        responseMessage,
        nextStep: 'dao-governance-model'
      };
    } catch (e) {
      return {
        responseMessage: "Thanks for the information. Let's move on to setting up your governance model!",
        nextStep: 'dao-governance-model' 
      };
    }
  }
};

export default DaoSocialStep; 