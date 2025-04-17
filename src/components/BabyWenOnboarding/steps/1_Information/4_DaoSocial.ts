import { OnboardingStep } from '../../../BabyWenOnboarding';
import { getRandomMessage } from '../messages';

// Function to get initial social links from session storage
export function getInitialSocialLinks() {
  return {
    daoWebsite: sessionStorage.getItem('daoWebsite') || '',
    daoTwitter: sessionStorage.getItem('daoTwitter') || '',
    daoTelegram: sessionStorage.getItem('daoTelegram') || '',
    daoDiscord: sessionStorage.getItem('daoDiscord') || '',
    daoInstagram: sessionStorage.getItem('daoInstagram') || '',
    daoTiktok: sessionStorage.getItem('daoTiktok') || ''
  };
}

// Validators for different social links
const validators = {
  twitter: (value: string) => {
    // Accept either a Twitter/X handle (@username) or URL
    const twitterRegex = /^(?:@[\w]{1,15}|(?:https?:\/\/)?(?:www\.)?(?:twitter\.com|x\.com)\/[\w]{1,15}\/?(?:\?.*)?$)/;
    
    if (!value || twitterRegex.test(value)) {
      return { isValid: true };
    }
    return { 
      isValid: false, 
      errorMessage: 'Please enter a valid Twitter/X URL (e.g., https://twitter.com/username)' 
    };
  },
  discord: (value: string) => {
    // Accept a Discord invite link
    const discordRegex = /^(?:https?:\/\/)?(?:www\.)?discord(?:app)?\.(?:com|gg)\/(?:invite\/)?([a-zA-Z0-9-]+)$/;
    
    if (!value || discordRegex.test(value)) {
      return { isValid: true };
    }
    return { 
      isValid: false, 
      errorMessage: 'Please enter a valid Discord invite URL' 
    };
  },
  website: (value: string) => {
    // Basic URL validation
    const urlRegex = /^(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+(?:\/[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]*)?$/;
    
    if (!value || urlRegex.test(value)) {
      return { isValid: true };
    }
    return { 
      isValid: false, 
      errorMessage: 'Please enter a valid website URL' 
    };
  },
  telegram: (value: string) => {
    // Accept a Telegram group link or username
    const telegramRegex = /^(?:https?:\/\/)?(?:www\.)?t(?:elegram)?\.(?:me|dog)\/([a-zA-Z0-9_]+)(?:\/.*)?$/;
    
    if (!value || telegramRegex.test(value)) {
      return { isValid: true };
    }
    return { 
      isValid: false, 
      errorMessage: 'Please enter a valid Telegram URL (e.g., https://t.me/groupname)' 
    };
  },
  instagram: (value: string) => {
    // Accept an Instagram handle or URL
    const instagramRegex = /^(?:@)?(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$|^(?:https?:\/\/)?(?:www\.)?instagram\.com\/([a-zA-Z0-9_.]+)\/?$/;
    
    if (!value || instagramRegex.test(value)) {
      return { isValid: true };
    }
    return { 
      isValid: false, 
      errorMessage: 'Please enter a valid Instagram URL (e.g., https://instagram.com/username)' 
    };
  },
  tiktok: (value: string) => {
    // Accept a TikTok handle or URL
    const tiktokRegex = /^(?:@)?[a-zA-Z0-9_]{2,24}$|^(?:https?:\/\/)?(?:www\.)?tiktok\.com\/@([a-zA-Z0-9_]{2,24})(?:\/.*)?$/;
    
    if (!value || tiktokRegex.test(value)) {
      return { isValid: true };
    }
    return { 
      isValid: false, 
      errorMessage: 'Please enter a valid TikTok URL (e.g., https://tiktok.com/@username)' 
    };
  }
};

const DaoSocialStep: OnboardingStep = {
  id: 'dao-social',
  messages: [
    {
      content: getRandomMessage('dao-social')
    }
  ],
  formFields: [
    {
      id: 'daoWebsite',
      label: 'Website',
      type: 'text',
      placeholder: 'https://yourwebsite.com',
      required: false,
      icon: 'globe',
      validator: validators.website
    },
    {
      id: 'daoTwitter',
      label: 'X (Twitter)',
      type: 'text',
      placeholder: 'https://twitter.com/username',
      required: false,
      icon: 'twitter',
      validator: validators.twitter
    },
    {
      id: 'daoTelegram',
      label: 'Telegram',
      type: 'text',
      placeholder: 'https://t.me/groupname',
      required: false,
      icon: 'telegram',
      validator: validators.telegram
    },
    {
      id: 'daoDiscord',
      label: 'Discord',
      type: 'text',
      placeholder: 'https://discord.gg/invite',
      required: false,
      icon: 'discord',
      validator: validators.discord
    },
    {
      id: 'daoInstagram',
      label: 'Instagram',
      type: 'text',
      placeholder: 'https://instagram.com/username',
      required: false,
      icon: 'instagram',
      validator: validators.instagram
    },
    {
      id: 'daoTiktok',
      label: 'TikTok',
      type: 'text',
      placeholder: 'https://tiktok.com/@username',
      required: false,
      icon: 'tiktok',
      validator: validators.tiktok
    }
  ],
  onResponse: (response: string) => {
    try {
      // Parse the JSON response from the form
      const data = JSON.parse(response);

      // Normalize and store social links in sessionStorage
      if (data.daoWebsite) {
        const websiteValue = normalizeUrl(data.daoWebsite);
        sessionStorage.setItem('daoWebsite', websiteValue);
      }
      
      if (data.daoTwitter) {
        const twitterValue = normalizeTwitter(data.daoTwitter);
        sessionStorage.setItem('daoTwitter', twitterValue);
      }
      
      if (data.daoTelegram) {
        const telegramValue = normalizeTelegram(data.daoTelegram);
        sessionStorage.setItem('daoTelegram', telegramValue);
      }
      
      if (data.daoDiscord) {
        const discordValue = normalizeDiscord(data.daoDiscord);
        sessionStorage.setItem('daoDiscord', discordValue);
      }
      
      if (data.daoInstagram) {
        const instagramValue = normalizeInstagram(data.daoInstagram);
        sessionStorage.setItem('daoInstagram', instagramValue);
      }
      
      if (data.daoTiktok) {
        const tiktokValue = normalizeTiktok(data.daoTiktok);
        sessionStorage.setItem('daoTiktok', tiktokValue);
      }
      
      // Get social links for the response message
      const socialLinks = [];
      if (data.daoWebsite) socialLinks.push("Website");
      if (data.daoTwitter) socialLinks.push("X (Twitter)");
      if (data.daoTelegram) socialLinks.push("Telegram");
      if (data.daoDiscord) socialLinks.push("Discord");
      if (data.daoInstagram) socialLinks.push("Instagram");
      if (data.daoTiktok) socialLinks.push("TikTok");
      
      return {
        nextStep: 'dao-governance-model'
      };
    } catch (e) {
      // If there's an error, just continue
      return {
        nextStep: 'dao-governance-model' 
      };
    }
  }
};

// Helper functions to normalize social links
function normalizeTwitter(value: string): string {
  // If it's just a username without @, add full URL
  if (/^[a-zA-Z0-9_]{1,15}$/.test(value)) {
    return `https://twitter.com/${value}`;
  }
  
  // If it's a handle with @, convert to URL
  if (/^@[a-zA-Z0-9_]{1,15}$/.test(value)) {
    return `https://twitter.com/${value.substring(1)}`;
  }
  
  // If it's already a URL but missing https, add it
  if (value.includes('twitter.com/') || value.includes('x.com/')) {
    if (!value.startsWith('http')) {
      return `https://${value}`;
    }
  }
  
  return value;
}

function normalizeDiscord(value: string): string {
  // Always ensure Discord invites have https
  if (value.startsWith('discord.gg/') || value.startsWith('www.discord.gg/')) {
    return `https://${value.replace(/^www\./, '')}`;
  }
  
  if (!value.startsWith('http')) {
    return `https://${value}`;
  }
  
  return value;
}

function normalizeUrl(value: string): string {
  // Ensure URLs have https
  if (!value.startsWith('http')) {
    return `https://${value}`;
  }
  return value;
}

function normalizeTelegram(value: string): string {
  // Format telegram links properly
  if (value.startsWith('@')) {
    return `https://t.me/${value.substring(1)}`;
  }
  
  if (!value.startsWith('http') && !value.startsWith('t.me/')) {
    return `https://t.me/${value}`;
  }
  
  if (value.startsWith('t.me/')) {
    return `https://${value}`;
  }
  
  return value;
}

function normalizeInstagram(value: string): string {
  // Format Instagram links properly
  if (value.startsWith('@')) {
    return `https://instagram.com/${value.substring(1)}`;
  }
  
  if (!value.startsWith('http') && !value.includes('instagram.com/')) {
    return `https://instagram.com/${value}`;
  }
  
  if (value.includes('instagram.com/') && !value.startsWith('http')) {
    return `https://${value}`;
  }
  
  return value;
}

function normalizeTiktok(value: string): string {
  // Format TikTok links properly
  if (value.startsWith('@')) {
    return `https://tiktok.com/${value}`;
  }
  
  if (!value.startsWith('http') && !value.includes('tiktok.com/')) {
    return `https://tiktok.com/@${value}`;
  }
  
  if (value.includes('tiktok.com/') && !value.startsWith('http')) {
    return `https://${value}`;
  }
  
  return value;
}

export default DaoSocialStep; 