import React from 'react';
import { useNavigate } from 'react-router-dom';
import { typography, ui, containers } from '../styles/theme';
import { X, Shield, Wallet, LogOut, ChevronRight, AlertTriangle, User, ChevronDown } from 'lucide-react';
import useApiAndWallet from '../hooks/useApiAndWallet';
import ApiAuthStatus from './common/ApiAuthStatus';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { userService } from '../services/UserService';
import { daosService } from '../services/DaosService';
import { onboardingMessages } from './BabyWenOnboarding/steps/messages';

// Import components for the onboarding experience

import ChatInput from './BabyWenOnboarding/components/ChatInput';
import MultiChoiceInput from './BabyWenOnboarding/components/MultiChoiceInput';
import FormInput, { FormField } from './BabyWenOnboarding/components/FormInput';
import ButtonAction from './BabyWenOnboarding/components/ButtonAction';
import MultiSelect from './BabyWenOnboarding/components/MultiSelect';
import DaoReviewDisplay from './BabyWenOnboarding/components/DaoReviewDisplay';

// Import the DAO introduction steps
import DaoNameStep from './BabyWenOnboarding/steps/1_Information/1_DaoName';
import DaoDescriptionStep from './BabyWenOnboarding/steps/1_Information/2_DaoDescription';
import DaoLogoStep from './BabyWenOnboarding/steps/1_Information/3_DaoLogo';
import DaoSocialStep, { getInitialSocialLinks } from './BabyWenOnboarding/steps/1_Information/4_DaoSocial';

// Import the DAO governance steps
import GovernanceModelStep from './BabyWenOnboarding/steps/2_Governance/1_GovernanceModel';
import IdeaRightsStep from './BabyWenOnboarding/steps/2_Governance/2_IdeaRights';
import VoteRightsStep from './BabyWenOnboarding/steps/2_Governance/3_VoteRights';
import SurvalidationStep from './BabyWenOnboarding/steps/2_Governance/3.1_Survalidation';
import VotingPowerStep from './BabyWenOnboarding/steps/2_Governance/4_VotingPower';
import VoteDelegationStep from './BabyWenOnboarding/steps/2_Governance/5_VoteDelegation';

// Import the DAO membership steps
import TokenExistenceStep from './BabyWenOnboarding/steps/3_Membership/1_TokenExistence';
import TokenAddressStep from './BabyWenOnboarding/steps/3_Membership/1.1_TokenAddress';
import TokenNameStep from './BabyWenOnboarding/steps/3_Membership/1.21_TokenName';
import TokenTickerStep from './BabyWenOnboarding/steps/3_Membership/1.22_TokenTicker';
import MembershipConditionsStep from './BabyWenOnboarding/steps/3_Membership/2_MembershipConditions';

import TokenThresholdStep from './BabyWenOnboarding/steps/3_Membership/2.1_TokenThreshold';
import ApplicationApprovalStep from './BabyWenOnboarding/steps/3_Membership/2.2_ApplicationApproval';

// Import the final review step
import DaoReviewStep from './BabyWenOnboarding/steps/4_Review/DaoReviewStep';
import DaoSuccessStep from './BabyWenOnboarding/steps/4_Review/DaoSuccessStep';
import { InputCreateDAO } from '../core/modules/dao-api';

// Types for the onboarding flow
export type StepId = 'dao-name' | 'dao-description' | 'dao-logo' | 'dao-social' | 
                     'dao-governance-model' | 'dao-idea-rights' | 'dao-vote-rights' | 
                     'dao-survalidation' | 'dao-voting-power' | 'dao-vote-delegation' |
                     'dao-token-existence' | 'dao-token-address' | 'dao-token-name' | 
                     'dao-token-ticker' | 'dao-membership-conditions' | 'dao-token-threshold' |
                     'dao-application-approval' | 'dao-review' | 'dao-success';

// Button action variants
export type ButtonVariant = 'primary' | 'secondary' | 'danger';

// Interfaces for different input types
export interface OnboardingStep {
  id: StepId;
  messages: {
    content: string;
    options?: string[];
  }[];
  component?: React.ReactNode;
  // New fields for different input types
  formFields?: FormField[];
  buttonAction?: {
    label: string;
    action: string;
    variant?: ButtonVariant;
  };
  multiSelectOptions?: string[];
  // Option details for MultiChoiceInput
  optionDetails?: Record<string, { title: string; description: string }>;
  // Support for custom components
  customComponent?: React.ComponentType<any>;
  onCustomComponentResponse?: (option: string, data?: any) => {
    responseMessage?: string;
    nextStep?: StepId;
  };
  onResponse: (response: string) => {
    responseMessage?: string;
    nextStep?: StepId;
  };
}

export interface Message {
  sender: 'user' | 'babywen';
  text: string;
  options?: string[];
}

// Main BabyWenOnboarding component
const BabyWenOnboarding: React.FC = () => {
  // Navigation
  const navigate = useNavigate();
  
  // Track last played sound to prevent duplicates
  const [lastPlayedStepSound, setLastPlayedStepSound] = React.useState<StepId | null>(null);
  const [lastPlayedStepSoundIndex, setLastPlayedStepSoundIndex] = React.useState<number | null>(null);
  // Reference to the current audio element and a flag to track if audio is currently playing
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  
  // Audio Playback Manager - handles all audio to ensure only one sound is playing at a time
  const audioManager = React.useMemo(() => {
    let currentAudio: HTMLAudioElement | null = null;
    let isPlaying = false;
    let currentPlayPromise: Promise<boolean> | null = null;
    let resolveCurrentPlay: ((value: boolean) => void) | null = null;

    // Internal function to clean up the current audio
    const cleanupAudio = () => {
      if (currentAudio) {
        console.log("Cleaning up audio");
        currentAudio.oncanplaythrough = null;
        currentAudio.onended = null;
        currentAudio.onpause = null;
        currentAudio.onerror = null;
        
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio = null;
      }
      isPlaying = false;
    };

    return {
      play: (stepId: StepId, variationIndex: number = 0): Promise<boolean> => {
        // If we're already playing something, resolve it and clean up
        if (isPlaying && resolveCurrentPlay) {
          console.log("Stopping previous playback promise");
          resolveCurrentPlay(false);
        }
        
        // Always clean up any existing audio
        cleanupAudio();
        
        console.log(`Starting new audio playback for ${stepId}-${variationIndex}`);
        isPlaying = true;
        
        // Create a new promise for this play request
        currentPlayPromise = new Promise<boolean>((resolve) => {
          resolveCurrentPlay = resolve;
          
          const soundFileName = `${stepId}-${variationIndex}.wav`;
          console.log(`Loading sound file: ${soundFileName}`);
          
          // Create a new audio element
          const audio = new Audio(`/assets/sounds/${soundFileName}`);
          currentAudio = audio;
          
          // Set up event handlers
          audio.oncanplaythrough = () => {
            // Make sure we're still the current audio before playing
            if (currentAudio !== audio) {
              console.log("Audio was replaced before it could play");
              return;
            }
            
            console.log(`Starting playback of: ${soundFileName}`);
            audio.play()
              .then(() => {
                if (currentAudio === audio) {
                  console.log(`Now playing: ${soundFileName}`);
                  setLastPlayedStepSound(stepId);
                  setLastPlayedStepSoundIndex(variationIndex);
                } else {
                  console.log("Audio was replaced during play()");
                  audio.pause();
                }
              })
              .catch(err => {
                console.error(`Error playing ${soundFileName}:`, err);
                
                // If this is still the current audio, try the fallback
                if (currentAudio === audio && variationIndex > 0) {
                  console.log(`Trying fallback sound: ${stepId}-0.wav`);
                  audioManager.play(stepId, 0).then(resolve);
                } else {
                  isPlaying = false;
                  resolve(false);
                }
              });
          };
          
          audio.onended = () => {
            console.log(`Finished playing: ${soundFileName}`);
            if (currentAudio === audio) {
              cleanupAudio();
              resolve(true);
            }
          };
          
          audio.onpause = () => {
            console.log(`Audio paused: ${soundFileName}`);
            if (currentAudio === audio && audio.currentTime > 0 && audio.currentTime < audio.duration) {
              console.log(`Playback interrupted: ${soundFileName}`);
              cleanupAudio();
              resolve(false);
            }
          };
          
          audio.onerror = () => {
            console.error(`Error loading sound: ${soundFileName}`);
            
            // If this is still the current audio, try the fallback
            if (currentAudio === audio && variationIndex > 0) {
              console.log(`Trying fallback sound after error: ${stepId}-0.wav`);
              audioManager.play(stepId, 0).then(resolve);
            } else {
              cleanupAudio();
              resolve(false);
            }
          };
        });
        
        return currentPlayPromise;
      },
      
      stop: (): void => {
        console.log("Stop requested");
        if (isPlaying && resolveCurrentPlay) {
          resolveCurrentPlay(false);
        }
        cleanupAudio();
      },
      
      isPlaying: (): boolean => isPlaying
    };
  }, []);

  // Active section for sidebar highlight
  const [activeSection, setActiveSection] = React.useState<string>('dashboard');
  
  // UI States
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [currentStep, setCurrentStep] = React.useState<StepId>('dao-name');
  const [stepHistory, setStepHistory] = React.useState<StepId[]>(['dao-name']); // Track step history
  const [userInput, setUserInput] = React.useState<string>('');
  const [isTyping, setIsTyping] = React.useState<boolean>(false);
  const [showExitConfirmation, setShowExitConfirmation] = React.useState<boolean>(false);
  const [showInput, setShowInput] = React.useState<boolean>(false); // Start with input hidden
  const [inputType, setInputType] = React.useState<'text' | 'multiChoice' | 'form' | 'button' | 'multiSelect' | 'custom'>('text');
  const [redirectCountdown, setRedirectCountdown] = React.useState<number>(20); // Countdown timer for redirect
  // Add refs to store interval and timeout IDs
  const countdownIntervalRef = React.useRef<NodeJS.Timeout | null>(null);
  const redirectTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  // Add initialFormValues state
  const [initialFormValues, setInitialFormValues] = React.useState<Record<string, string>>({});
  
  // Animation states
  const [hasAnimatedIn, setHasAnimatedIn] = React.useState<boolean>(false);
  const [showVideoAndQuestion, setShowVideoAndQuestion] = React.useState<boolean>(false);
  const [showInputContainer, setShowInputContainer] = React.useState<boolean>(false);
  
  // Welcome modal state
  const [showWelcomeModal, setShowWelcomeModal] = React.useState<boolean>(true);
  const [showOnboarding, setShowOnboarding] = React.useState<boolean>(false);
  
  // User dropdown state
  const [showProfileDropdown, setShowProfileDropdown] = React.useState<boolean>(false);
  
  // Wallet change detection state
  const [initialWalletAddress, setInitialWalletAddress] = React.useState<string | null>(null);
  const [showWalletChangeError, setShowWalletChangeError] = React.useState<boolean>(false);
  
  // Get API and wallet status
  const { apiStatus, userDisplayInfo, connected, publicKey, userInfo } = useApiAndWallet();
  
  // Check if wallet is connected
  const isWalletConnected = userDisplayInfo?.isAuthenticated || false;
  
  // Mock user wallet data - Replace with actual user wallet data in production
  const [userWallet, setUserWallet] = React.useState({
    address: '0x7C5a...F92E',
    shortAddress: '0x7C5a...F92E',
    balance: '1.24 ETH',
    connected: true
  });
  
  // Handle disconnect wallet
  const handleDisconnect = () => {
    // Add your wallet disconnect logic here
    setUserWallet({...userWallet, connected: false});
    // Navigate back to home or wallet connection page
    navigate('/');
  };
  
  // Create an object that maps step IDs to step objects
  const steps: Record<StepId, OnboardingStep> = {
    'dao-name': DaoNameStep,
    'dao-description': DaoDescriptionStep,
    'dao-logo': DaoLogoStep,
    'dao-social': DaoSocialStep,
    'dao-governance-model': GovernanceModelStep,
    'dao-idea-rights': IdeaRightsStep,
    'dao-vote-rights': VoteRightsStep,
    'dao-survalidation': SurvalidationStep,
    'dao-voting-power': VotingPowerStep,
    'dao-vote-delegation': VoteDelegationStep,
    'dao-token-existence': TokenExistenceStep,
    'dao-token-address': TokenAddressStep,
    'dao-token-name': TokenNameStep,
    'dao-token-ticker': TokenTickerStep,
    'dao-membership-conditions': MembershipConditionsStep,
    'dao-token-threshold': TokenThresholdStep,
    'dao-application-approval': ApplicationApprovalStep,
    'dao-review': DaoReviewStep,
    'dao-success': DaoSuccessStep
  };

  // Start onboarding after welcome modal is closed
  const startOnboarding = () => {
    // Check if wallet is connected
    if (!isWalletConnected) {
      // Redirect to connect wallet page or show connection modal
      alert("Please connect your wallet before starting DAO creation");
      return;
    }
    
    // Store the initial wallet address to detect changes
    if (publicKey) {
      setInitialWalletAddress(publicKey.toString());
    }
    
    setShowWelcomeModal(false);
    setShowOnboarding(true);
    
    // Initial appearance animation sequence
    setTimeout(() => setHasAnimatedIn(true), 100);
    setTimeout(() => setShowVideoAndQuestion(true), 500);
    setTimeout(() => {
      setShowInputContainer(true);
      
      // Instead of manually setting up the first step, use our updateCurrentStep function
      // This ensures consistent behavior for all step transitions
      updateCurrentStep('dao-name');
    }, 1500); // Increased delay to ensure it appears after video/question
  };

  // Simplified function to play sound using the audio manager
  const playStepSound = (stepId: StepId, variationIndex: number = 0): Promise<boolean> => {
    console.log(`Request to play sound: ${stepId}-${variationIndex}`);
    return audioManager.play(stepId, variationIndex);
  };
  
  // Simplified function to stop audio using the audio manager
  const stopAudio = (): Promise<void> => {
    console.log("Stopping all audio");
    audioManager.stop();
    return Promise.resolve();
  };

  // Check for wallet changes during onboarding
  React.useEffect(() => {
    if (!showOnboarding || !initialWalletAddress || !publicKey) return;
    
    const currentWalletAddress = publicKey.toString();
    
    // If wallet address changed during onboarding, show error
    if (initialWalletAddress !== currentWalletAddress) {
      setShowWalletChangeError(true);
    }
  }, [publicKey, showOnboarding, initialWalletAddress]);

  // Initialize with welcome modal
  React.useEffect(() => {
    // Clear any previous onboarding data when component mounts
    // But preserve the createdDaoId if it exists
    const createdDaoId = sessionStorage.getItem('createdDaoId');
    clearOnboardingData();
    if (createdDaoId) {
      sessionStorage.setItem('createdDaoId', createdDaoId);
    }
    // Animation starts after user proceeds from welcome modal
    
    // Clean up audio on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Function to determine the input type based on the step
  const determineInputType = (step: OnboardingStep) => {
    if (step.customComponent) {
      return 'custom';
    } else if (step.formFields && step.formFields.length > 0) {
      return 'form';
    } else if (step.buttonAction) {
      return 'button';
    } else if (step.multiSelectOptions && step.multiSelectOptions.length > 0) {
      return 'multiSelect';
    } else if (step.messages[0].options && step.messages[0].options.length > 0) {
      return 'multiChoice';
    } else {
      return 'text';
    }
  };

  // Function to get initial form values from sessionStorage
  const getInitialFormValues = (formFields: FormField[] = []): Record<string, string> => {
    const values: Record<string, string> = {};
    
    formFields.forEach(field => {
      const storedValue = sessionStorage.getItem(field.id);
      if (storedValue) {
        values[field.id] = storedValue;
      }
    });
    
    return values;
  };

  // Implement the updateCurrentStep function to handle all step transitions
  const updateCurrentStep = async (stepId: StepId) => {
    // Stop any currently playing sound immediately
    await stopAudio();
    
    // Clear any previous UI state
    setIsTyping(true);
    setShowInput(false);
    setMessages([]);
    
    // Update the current step state
    setCurrentStep(stepId);
    
    // Get the step object for the new step
    const step = steps[stepId];
    if (!step) return;
    
    // Determine the input type for this step and update state
    const newInputType = determineInputType(step);
    setInputType(newInputType);
    
    // Handle form data initialization if this is a form step
    if (newInputType === 'form' && step.formFields) {
      // Special handling for social links step
      if (step.id === 'dao-social') {
        // Use the specialized function to get social links
        const socialLinks = getInitialSocialLinks();
        setInitialFormValues(socialLinks);
      } else {
        // Get initial form values for other form steps from sessionStorage
        const values = getInitialFormValues(step.formFields);
        setInitialFormValues(values);
      }
    }
    
    // Display the step's messages sequentially
    for (let i = 0; i < step.messages.length; i++) {
      const message = step.messages[i];
      // Get the message variation index (if first message of step)
      let messageVariationIndex = 0;
      if (i === 0) {
        // If first message comes from messages.ts, it might be randomized
        // We can get its index in onboardingMessages[stepId] array
        const messageVariations = onboardingMessages[stepId];
        if (messageVariations && messageVariations.length > 0) {
          messageVariationIndex = messageVariations.indexOf(message.content);
          // If not found, default to 0
          if (messageVariationIndex === -1) messageVariationIndex = 0;
        }
      }
      
      // Pass the variation index to simulateBabyWenTyping for first message
      await simulateBabyWenTyping(
        message.content, 
        message.options, 
        stepId,
        i === 0 ? messageVariationIndex : undefined
      );
    }
    
    // Show the input after all messages have been displayed (unless on final step)
    if (stepId !== 'dao-success') {
      setShowInput(true);
    }
  };

  // Update the processUserResponse function to use updateCurrentStep
  const processUserResponse = async (response: string) => {
    // Stop any currently playing sound immediately
    await stopAudio();
    
    // Get the current step
    const step = steps[currentStep as keyof typeof steps];
    
    // Get the response from the step
    const result = step.onResponse(response);
    
    // If there's a response message, simulate BabyWen typing
    if (result.responseMessage) {
      await simulateBabyWenTyping(result.responseMessage);
    }
    
    // Define the flow order centrally
    const determineNextStep = () => {
      // Check if the step's onResponse returned a specific nextStep
      if (result.nextStep) {
        return result.nextStep;
      }
      
      // Define the sequence of steps (default flow)
      const flowOrder: StepId[] = [
        // Information section
        'dao-name', 
        'dao-description',
        'dao-logo',
        'dao-social',
        
        // Token & Membership section
        'dao-token-existence',
        'dao-token-address', // Only shown if user has a token
        'dao-token-name',    // Only shown if user needs to create a token
        'dao-token-ticker',  // Only shown if user needs to create a token
        'dao-membership-conditions',
        
        // Governance section
        'dao-governance-model',
        'dao-idea-rights',
        'dao-vote-rights',
        'dao-survalidation',  // Only shown conditionally
        'dao-voting-power',
        'dao-vote-delegation',
        
        // Final review step
        'dao-review'
      ];
      
      // Find current step index
      const currentIndex = flowOrder.indexOf(currentStep);
      
      // If we're at the end of the flow, go back to the beginning
      if (currentIndex === flowOrder.length - 1) {
        return flowOrder[0];
      }
      
      // Otherwise go to the next step
      return flowOrder[currentIndex + 1];
    };
    
    // Get the next step based on the flow
    const nextStepId = determineNextStep();
    
    // Update step history
    setStepHistory((prev: StepId[]) => [...prev, nextStepId]);
    
    // Update to the next step using our new function
    await updateCurrentStep(nextStepId);
  };
  
  // Handle sending a message
  const handleSendMessage = async () => {
    if (userInput.trim() === '') return;
    
    // Stop any currently playing sound immediately
    await stopAudio();
    
    // Show loading immediately
    setIsTyping(true);
    setShowInput(false);
    
    // Add user message to chat
    const newUserMessage = { sender: 'user' as const, text: userInput.trim() };
    setMessages((prev: Message[]) => [...prev, newUserMessage]);
    setUserInput('');
    
    // Process user input based on current step
    await processUserResponse(userInput.trim());
  };
  
  // Handle option click for multi-choice responses
  const handleOptionClick = async (option: string) => {
    // Stop any currently playing sound immediately
    await stopAudio();
    
    // Show loading immediately
    setIsTyping(true);
    setShowInput(false);
    
    // Add user message with the selected option
    setMessages((prev: Message[]) => [...prev, { sender: 'user' as const, text: option }]);
    
    // Process the response
    await processUserResponse(option);
  };

  // Handle form submission
  const handleFormSubmit = async (formData: Record<string, string>) => {
    // Stop any currently playing sound immediately
    await stopAudio();
    
    // Show loading immediately
    setIsTyping(true);
    setShowInput(false);
    
    // Convert form data to JSON string for processing
    const formDataString = JSON.stringify(formData);
    
    // Show a summary of the submitted data
    const formSummary = Object.entries(formData)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');
    
    // Add user message with form summary
    setMessages((prev: Message[]) => [...prev, { sender: 'user' as const, text: `Submitted: ${formSummary}` }]);
    
    // Process the form data
    await processUserResponse(formDataString);
  };

  // Handle button action
  const handleButtonAction = async () => {
    // Stop any currently playing sound immediately
    await stopAudio();
    
    const step = steps[currentStep as keyof typeof steps];
    
    if (step.buttonAction?.action === 'showAlert') {
      alert('Hello World! This is a special message just for you!');
    } else if (step.buttonAction?.action === 'createDao') {
      // This is where we would call the DAO creation service
      console.log('Creating DAO with collected data from sessionStorage');
      
      // Get data from sessionStorage
      const collectedData : InputCreateDAO = {
        // Basic DAO Info
        name: sessionStorage.getItem('daoName') || '',
        description: sessionStorage.getItem('daoDescription') || '',
        //profile
        discordServer: sessionStorage.getItem('daoDiscord') || '',
        twitter: sessionStorage.getItem('daoTwitter') || '',
        website: sessionStorage.getItem('daoWebsite') || '',
        telegram: sessionStorage.getItem('daoTelegram') || '',
        tiktok: sessionStorage.getItem('daoTiktok') || '',
        instagram: sessionStorage.getItem('daoInstagram') || '',
        ownerId: userInfo?.userId,
      };
      
      // Add user message indicating button was clicked
      setMessages((prev: Message[]) => [...prev, { 
        sender: 'user' as const, 
        text: `Clicked: ${step.buttonAction?.label}` 
      }]);
      
      // Show loading state
      setIsTyping(true);
      setShowInput(false);
      
      // Handle logo file if it exists
      let logoFile: File | undefined = undefined;
      const logoFileString = sessionStorage.getItem('daoLogoFile');
      const logoType = sessionStorage.getItem('daoLogoType');
      const logoUrl = sessionStorage.getItem('daoLogoUrl');
      
      // Convert dataURL back to File object for uploaded files
      if (logoFileString && logoType === 'upload') {
        try {
          const fileData = JSON.parse(logoFileString);
          if (fileData.dataUrl) {
            // Convert base64 data to blob
            const byteString = atob(fileData.dataUrl.split(',')[1]);
            const mimeType = fileData.dataUrl.split(',')[0].split(':')[1].split(';')[0];
            const arrayBuffer = new ArrayBuffer(byteString.length);
            const uint8Array = new Uint8Array(arrayBuffer);
            
            for (let i = 0; i < byteString.length; i++) {
              uint8Array[i] = byteString.charCodeAt(i);
            }
            
            const blob = new Blob([arrayBuffer], { type: mimeType });
            logoFile = new File([blob], fileData.name, { type: fileData.type });
            console.log("Restored file from sessionStorage:", fileData.name);
          }
        } catch (err) {
          console.error("Error converting stored logo data to File:", err);
        }
      } 
      // Handle generated logo URLs
      else if (logoType === 'generate' && logoUrl) {
        try {
          console.log("Converting generated logo URL to File:", logoUrl);
          
          // Fetch the image from the URL
          const response = await fetch(logoUrl);
          const blob = await response.blob();
          
          // Create a File object from the blob
          // Use a meaningful filename with timestamp
          const fileName = `dao_logo_${Date.now()}.png`;
          logoFile = new File([blob], fileName, { type: 'image/png' });
          
          console.log("Successfully converted logo URL to File:", fileName);
        } catch (err) {
          console.error("Error converting logo URL to File:", err);
        }
      }
      
      // Call the DAO creation service
      daosService.createDao({
        name: collectedData.name,
        description: collectedData.description,
        userId: collectedData.ownerId || '',
        treasury: undefined,
        discordServer: collectedData.discordServer,
        twitter: collectedData.twitter,
        telegram: collectedData.telegram,
        instagram: collectedData.instagram,
        tiktok: collectedData.tiktok,
        website: collectedData.website,
        // Use the converted file if available
        profilePicture: logoFile
      }).then(result => {
        if (result) {
          const daoId = result.daoId?.toString() || '';
          console.log('DAO created with ID:', daoId);
          
          // Store the DAO ID for the success step to use
          sessionStorage.setItem('createdDaoId', daoId);
          
          // Clear all onboarding data but keep the created DAO ID
          clearOnboardingData();
          // Make sure to keep the DAO ID
          sessionStorage.setItem('createdDaoId', daoId);
          
          // Show success message and change to success step
          setCurrentStep('dao-success');
          
          // Update step history
          setStepHistory((prev: StepId[]) => [...prev, 'dao-success']);
          
          // Show the success message
          simulateBabyWenTyping(steps['dao-success'].messages[0].content, undefined, 'dao-success');
          
          // Determine the input type for the success step
          determineInputType(steps['dao-success']);
          
          // Reset countdown
          setRedirectCountdown(20);
          
          // Start countdown timer
          const countdownInterval = setInterval(() => {
            setRedirectCountdown((prevCount: number) => {
              const newCount = prevCount - 1;
              if (newCount <= 0) {
                clearInterval(countdownInterval);
              }
              return newCount;
            });
          }, 1000);
          
          // Store the interval ID
          countdownIntervalRef.current = countdownInterval;
          
          // Set a timeout to redirect after 20 seconds
          const redirectTimeout = setTimeout(() => {
            if (countdownIntervalRef.current) {
              clearInterval(countdownIntervalRef.current);
              countdownIntervalRef.current = null;
            }
            navigate(`/daos/${daoId}`);
          }, 20000); // 20 second delay before redirect
          
          // Store the timeout ID
          redirectTimeoutRef.current = redirectTimeout;
        } else {
          // Show error message
          simulateBabyWenTyping("I'm sorry, there was an error creating your DAO. Please try again.");
          setShowInput(true);
        }
      }).catch(error => {
        console.error('Error creating DAO:', error);
        // Show error message
        simulateBabyWenTyping("I'm sorry, there was an error creating your DAO. Please try again.");
        setShowInput(true);
      });
      
      return; // Exit early to avoid duplicate messages
    } else if (step.buttonAction?.action === 'goToDashboard') {
      // Get the created DAO ID
      const daoId = sessionStorage.getItem('createdDaoId') || '';
      
      // Clear the countdown interval and redirect timeout
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }
      
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
        redirectTimeoutRef.current = null;
      }
      
      // Clear all onboarding data except the DAO ID
      clearOnboardingData();
      
      // Navigate to the DAO dashboard
      if (daoId) {
        navigate(`/daos/${daoId}`);
      } else {
        navigate('/dashboard');
      }
      
      return; // Exit early
    }
    
    // For non-special actions, add user message and process response
    setMessages((prev: Message[]) => [...prev, { 
      sender: 'user' as const, 
      text: `Clicked: ${step.buttonAction?.label}` 
    }]);
    
    // Process the button action
    await processUserResponse('button_clicked');
  };

  // Handle multi-select submission
  const handleMultiSelectSubmit = async (selectedOptions: string[]) => {
    // Stop any currently playing sound immediately
    await stopAudio();
    
    // Show loading immediately
    setIsTyping(true);
    setShowInput(false);
    
    // Convert selected options to JSON string for processing
    const optionsString = JSON.stringify(selectedOptions);
    
    // Show selected options
    const optionsSummary = selectedOptions.join(', ');
    
    // Add user message with selections
    setMessages((prev: Message[]) => [...prev, { 
      sender: 'user' as const, 
      text: `Selected: ${optionsSummary}` 
    }]);
    
    // Save selected options to sessionStorage using the currentStep ID as the key
    sessionStorage.setItem(currentStep, optionsString);
    
    // Process the selected options
    await processUserResponse(optionsString);
  };
    
  // Simulate BabyWen typing with smoother transitions
  const simulateBabyWenTyping = async (
    message: string, 
    options?: string[], 
    stepId?: StepId,
    variationIndex?: number
  ) => {
    // Show loading immediately
    setIsTyping(true);
    setShowInput(false);
    
    // Always stop any currently playing sound first
    await stopAudio();
    
    // Ensure loading shows for at least 1 second
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update messages with new content
    setMessages((prev: Message[]) => [...prev, { sender: 'babywen' as const, text: message, options }]);
    
    // Critical: Very small delay to ensure React has updated the DOM with the new message
    await new Promise(resolve => setTimeout(resolve, 20));
    
    // IMPORTANT: Make everything appear at once - text and input field
    setIsTyping(false);
    setShowInput(true);
    
    // Play sound for the current step
    if (stepId !== undefined && variationIndex !== undefined) {
      console.log(`Playing sound for step ${stepId} with variation ${variationIndex}`);
      playStepSound(stepId, variationIndex)
        .then(result => console.log(`Sound play completed for ${stepId}-${variationIndex}:`, result))
        .catch(error => console.error(`Error playing sound for step ${stepId}:`, error));
    }
  };
  
  // Function to clear all onboarding data from sessionStorage
  const clearOnboardingData = () => {
    const keysToRemove = [
      // Basic information
      'daoName', 'daoDescription', 'daoLogo',
      // Logo-related data
      'daoLogoType', 'daoLogoFileName', 'daoLogoUrl', 'daoLogoFile',
      // Social links
      'daoTwitter', 'daoDiscord', 'daoWebsite', 'daoTelegram', 'daoInstagram', 'daoTiktok',
      // Token information
      'hasExistingToken', 'tokenAddress', 'tokenName', 'tokenTicker',
      // Membership information
      'membershipConditions', 'tokenThreshold', 'applicationApproval',
      // Governance information
      'governanceModel', 'ideaRights', 'voteRights', 'survalidation', 'votingPower', 'voteDelegation'
    ];

    // Remove each key
    keysToRemove.forEach(key => sessionStorage.removeItem(key));
    console.log("Cleared all onboarding data from sessionStorage");
  };

  // Handle exit confirmation dialog
  const handleExitClick = () => {
    setShowExitConfirmation(true);
  };

  const confirmExit = () => {
    // Clear all data before exiting
    clearOnboardingData();
    navigate('/');
  };
  
  const cancelExit = () => {
    setShowExitConfirmation(false);
  };
  
  // Get the most recent messages for display
  const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;
  const secondLastMessage = messages.length > 1 ? messages[messages.length - 2] : null;
  
  // Get the current step
  const currentStepObj = steps[currentStep as keyof typeof steps];
  
  // Handle going back to the previous step
  const handleGoBack = async () => {
    // Stop any currently playing sound when going back
    await stopAudio();
    
    // Can't go back if we're at the first step or only have one step in history
    if (stepHistory.length <= 1) return;
    
    // Remove current step from history
    const newHistory = [...stepHistory];
    newHistory.pop();
    
    // Get the previous step
    const previousStepId = newHistory[newHistory.length - 1];
    const previousStep = steps[previousStepId as keyof typeof steps];
    
    // Update state
    setStepHistory(newHistory);
    
    // Hide input while we reset
    setShowInput(false);
    
    // Reset last played sound to ensure we can hear the previous step sound
    setLastPlayedStepSound(null);
    
    // Clear messages
    setMessages([]);
    
    // Determine input type for the previous step
    const prevInputType = determineInputType(previousStep);
    setInputType(prevInputType);
    
    // If the previous step is a form, initialize the form values
    if (prevInputType === 'form' && previousStep.formFields) {
      // Special handling for social links step
      if (previousStep.id === 'dao-social') {
        // Use the specialized function to get social links
        const socialLinks = getInitialSocialLinks();
        setInitialFormValues(socialLinks);
      } else {
        // Get initial form values for other form steps from sessionStorage
        const values = getInitialFormValues(previousStep.formFields);
        setInitialFormValues(values);
      }
    }
    
    // Now update the current step (this will trigger the display of messages and show input)
    await updateCurrentStep(previousStepId);

    // Clear specific sessionStorage variables based on which step we're going back from
    if (previousStepId === 'dao-governance-model') {
      // Remove all governance info variables
      const governanceKeys = [
        'governanceModel', 'ideaRights', 'voteRights', 
        'survalidation', 'votingPower', 'voteDelegation',
      ];
      governanceKeys.forEach(key => sessionStorage.removeItem(key));
    } else if (previousStepId === 'dao-token-existence') {
      // Remove all token info variables
      const tokenKeys = [
        'hasExistingToken', 'tokenAddress', 'tokenName', 'tokenTicker'
      ];
      tokenKeys.forEach(key => sessionStorage.removeItem(key));
    } else if (previousStepId === 'dao-membership-conditions') {
      // Remove all membership info variables
      const membershipKeys = [
        'membershipConditions', 'membershipType', 'tokenThreshold', 'applicationApproval', 'approvalType'
      ];
      membershipKeys.forEach(key => sessionStorage.removeItem(key));
    }
  };
  
  // Handle wallet connection
  const handleConnectWallet = () => {
    // Redirect to wallet connection page - update this to the correct wallet connection route
    navigate('/wallet-connect');
    
    // Keep the welcome modal open so user can return to it after connecting
    setShowWelcomeModal(true);
  };
  
  // Handle custom component response
  const handleCustomComponentResponse = async (option: string, data?: any) => {
    // Stop any currently playing sound immediately
    await stopAudio();
    
    console.log("handleCustomComponentResponse called with option:", option, "and data:", data);
    
    if (currentStepObj?.onCustomComponentResponse) {
      const result = currentStepObj.onCustomComponentResponse(option, data);
      console.log("Custom component response result:", result);
      
      if (result.responseMessage) {
        await simulateBabyWenTyping(result.responseMessage);
      }
      
      if (result.nextStep) {
        console.log("Moving to next step:", result.nextStep);
        // Update step history
        setStepHistory((prev: StepId[]) => [...prev, result.nextStep!]);
        // Use the updateCurrentStep function instead of directly setting the state
        await updateCurrentStep(result.nextStep);
      } else {
        console.log("No nextStep provided in result");
      }
    } else {
      console.log("No onCustomComponentResponse handler found for current step");
    }
  };
  
  // Render appropriate input component based on input type
  const renderInputComponent = () => {
    if (!showInput) return null;
    
    // Show back button (only if we have a step history)
    const canGoBack = stepHistory.length > 1;
    
    // If we're on the success step, show the countdown
    if (currentStep === 'dao-success') {
      return (
        <>
          <div className="w-full mb-6">
            <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl p-6 border border-indigo-500/30">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-center text-white mb-2">DAO Created Successfully!</h3>
              <p className="text-indigo-200 text-center mb-4">
                Your DAO is now live and ready to use.
              </p>
              <div className="flex justify-center mb-2">
                <div className="bg-indigo-900/40 rounded-full px-4 py-2 text-indigo-200">
                  Redirecting in <span className="font-bold text-white">{redirectCountdown}</span> seconds
                </div>
              </div>
            </div>
          </div>
          <div className="w-full">
            <ButtonAction
              label={currentStepObj?.buttonAction?.label || 'Go to Dashboard Now'}
              onClick={handleButtonAction}
              variant={currentStepObj?.buttonAction?.variant as ButtonVariant || 'primary'}
            />
          </div>
        </>
      );
    }
    
    // If we're on the review step, show the DAO Review Display above the button
    if (currentStep === 'dao-review') {
      return (
        <>
          <div className="w-full mb-6">
            <DaoReviewDisplay />
          </div>
          <div className="w-full flex justify-center">
            <ButtonAction
              label={currentStepObj?.buttonAction?.label || 'Create DAO'}
              onClick={handleButtonAction}
              variant={currentStepObj?.buttonAction?.variant as ButtonVariant || 'primary'}
            />
          </div>
          
          {/* Back button */}
          {canGoBack && (
            <div className="mt-3 flex justify-center">
              <button
                onClick={() => {
                  // Stop any sound before going back
                  stopAudio().catch(error => {
                    console.warn('Error stopping audio playback:', error);
                  });
                  handleGoBack();
                }}
                className="text-xs text-indigo-400/70 hover:text-indigo-300 transition-colors"
              >
                Go Back
              </button>
            </div>
          )}
        </>
      );
    }
    
    // Get any previously selected option for the current step
    const previouslySelectedOption = sessionStorage.getItem(currentStep);
    
    return (
      <>
        <div className="w-full">
          {inputType === 'text' && (
            <ChatInput
              value={userInput}
              onChange={setUserInput}
              onSend={handleSendMessage}
            />
          )}
          
          {inputType === 'multiChoice' && (
            <MultiChoiceInput
              options={lastMessage?.options || []}
              onSelect={handleOptionClick}
              optionDetails={currentStepObj?.optionDetails || {}}
            />
          )}
          
          {inputType === 'form' && (
            <FormInput
              fields={currentStepObj?.formFields || []}
              onSubmit={handleFormSubmit}
              initialValues={initialFormValues}
            />
          )}
          
          {inputType === 'button' && (
            <ButtonAction
              label={currentStepObj?.buttonAction?.label || 'Click Me'}
              onClick={handleButtonAction}
              variant={currentStepObj?.buttonAction?.variant as ButtonVariant || 'primary'}
            />
          )}
          
          {inputType === 'multiSelect' && (
            <MultiSelect
              options={currentStepObj?.multiSelectOptions || []}
              onSubmit={handleMultiSelectSubmit}
            />
          )}
          
          {inputType === 'custom' && currentStepObj?.customComponent && (
            React.createElement(currentStepObj.customComponent, {
              onSelectOption: handleCustomComponentResponse,
              key: currentStep // Add key to force re-render when step changes
            })
          )}
        </div>
        
        {/* Back button */}
        {canGoBack && (
          <div className="mt-3 flex justify-center">
            <button
              onClick={() => {
                // Stop any sound before going back
                stopAudio().catch(error => {
                  console.warn('Error stopping audio playback:', error);
                });
                handleGoBack();
              }}
              className="text-xs text-indigo-400/70 hover:text-indigo-300 transition-colors"
            >
              Go Back
            </button>
          </div>
        )}
      </>
    );
  };
  
  // Clean up timers and audio when component unmounts
  React.useEffect(() => {
    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
      }
      // Stop any playing audio
      stopAudio();
    };
  }, []);
  
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden relative">
      {/* Welcome Modal */}
      {showWelcomeModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] backdrop-blur-sm transition-all duration-500 ease-in-out animate-fadeIn p-4">
          <div className="bg-gradient-to-b from-[#1a1a1a] to-[#111] rounded-2xl p-4 sm:p-6 md:p-8 w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl border border-indigo-500/30 shadow-2xl animate-scaleIn">
            {/* Modal Header */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6 gap-3">
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center">
                <Shield className="mr-2 text-indigo-400" size={24} /> 
                Welcome to DAO Creation
              </h2>
              
              {/* Wallet Section: Show either ApiAuthStatus or Connect Wallet button */}
              {isWalletConnected ? (
                <ApiAuthStatus 
                  apiStatus={apiStatus} 
                  userDisplayInfo={userDisplayInfo}
                />
              ) : (
                <WalletMultiButton className="wallet-adapter-button-custom" />
              )}
            </div>
            
            {/* Modal Content */}
            <div className="mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row items-start mb-4 p-3 sm:p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                <AlertTriangle className="text-amber-500 shrink-0 mt-1 mr-0 sm:mr-3 mb-2 sm:mb-0" size={20} />
                <div>
                  <h3 className="text-amber-400 font-medium mb-2">Important Wallet Security Notice</h3>
                  <p className="text-white/80 text-xs sm:text-sm leading-relaxed">
                    You're about to begin the DAO creation process. For security best practices, we strongly 
                    recommend using a new, dedicated wallet created from a fresh seed phrase.
                  </p>
                  <p className="text-white/80 text-xs sm:text-sm leading-relaxed mt-2">
                    The wallet you use will become the DAO's treasury wallet and will be used to deploy your 
                    DAO token contract. To protect your main assets, avoid using your primary wallet for this process.
                  </p>
                </div>
              </div>
              
              <h3 className="text-md sm:text-lg font-medium mb-2 sm:mb-3 text-indigo-300">What to expect:</h3>
              <ul className="space-y-1 sm:space-y-2 text-white/80 text-xs sm:text-sm">
                <li className="flex items-start">
                  <ChevronRight size={16} className="text-indigo-400 shrink-0 mt-1 mr-2" />
                  <span>A step-by-step guided process to customize your DAO</span>
                </li>
                <li className="flex items-start">
                  <ChevronRight size={16} className="text-indigo-400 shrink-0 mt-1 mr-2" />
                  <span>Options to configure governance, token details, and membership</span>
                </li>
                <li className="flex items-start">
                  <ChevronRight size={16} className="text-indigo-400 shrink-0 mt-1 mr-2" />
                  <span>Smart contract deployment for your DAO token and governance structure</span>
                </li>
              </ul>
            </div>
            
            {/* Modal Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={() => {
                  clearOnboardingData();
                  navigate('/');
                }}
                className="w-full sm:w-auto px-4 py-2 bg-[#333] hover:bg-[#444] text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={startOnboarding}
                className={`w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg transition-all shadow-lg hover:shadow-indigo-500/25 font-medium ${!isWalletConnected ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={!isWalletConnected}
              >
                {isWalletConnected ? 'I Understand, Let\'s Begin' : 'Connect Wallet to Begin'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Main Onboarding Content */}
      {showOnboarding && (
        <div className={`min-h-screen bg-[#0a0a0a] text-white overflow-y-auto relative transition-opacity duration-1000 ease-in-out ${hasAnimatedIn ? 'opacity-100' : 'opacity-0'}`}>
          {/* Aurora background effects */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-[-20%] right-[-10%] w-[90%] h-[80%] bg-gradient-to-br from-indigo-600/20 via-purple-600/15 to-pink-600/10 rounded-full blur-[120px] animate-pulse-slow"></div>
            <div className="absolute bottom-[-30%] left-[-20%] w-[80%] h-[70%] bg-gradient-to-tr from-teal-600/20 via-cyan-600/15 to-blue-600/10 rounded-full blur-[120px] animate-pulse-slow-delayed"></div>
            <div className="absolute top-[30%] left-[10%] w-[40%] h-[30%] bg-gradient-to-r from-amber-600/10 to-orange-600/5 rounded-full blur-[80px] animate-float"></div>
            <div className="absolute bottom-[20%] right-[15%] w-[35%] h-[25%] bg-gradient-to-l from-emerald-600/10 to-green-600/5 rounded-full blur-[80px] animate-float-delayed"></div>
          </div>
          
          {/* Back button */}
          <button 
            onClick={handleExitClick}
            className={`fixed top-4 left-4 z-50 bg-[#222] p-2 rounded-full hover:bg-[#333] transition-all duration-700 ${hasAnimatedIn ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}
            aria-label="Go back"
          >
            <X size={20} className="text-white" />
          </button>
          
          {/* Main content layout */}
          <div className="container mx-auto min-h-screen flex flex-col py-4">
            {/* Video section - Top */}
            <div className="flex-none pt-12 flex items-center justify-center mb-0">
              <div className={`w-[350px] h-[350px] overflow-hidden transition-all duration-1000 ease-out ${showVideoAndQuestion ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                <video 
                  autoPlay 
                  loop 
                  muted 
                  playsInline
                  className="w-full h-full object-cover rounded-3xl"
                >
                  <source src="/assets/video_agent.webm" type="video/webm" />
                </video>
              </div>
            </div>

            {/* Question and Answer Container */}
            <div className="flex-grow flex flex-col px-4 pb-12 self-start w-full">
              {/* Question section with persistent container */}
              <div className="flex justify-center">
                <div className="w-full max-w-2xl">
                  <div className={`bg-gradient-to-r from-indigo-600/10 to-purple-600/10 backdrop-blur-sm border border-indigo-500/20 rounded-2xl p-6 shadow-xl min-h-[80px] relative transition-all duration-1000 ease-out ${showVideoAndQuestion ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                    {/* Loading animation with bouncing dots */}
                    {isTyping && (
                      <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0a]/30 rounded-2xl backdrop-blur-sm transition-all duration-500">
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                          <div className="loader"></div>
                        </div>
                      </div>
                    )}
                    
                    {/* Message content with fade and scale transition */}
                    <div className={`transition-all duration-500 ${
                      isTyping 
                        ? 'opacity-0 scale-95' 
                        : 'opacity-100 scale-100'
                    }`}>
                      {lastMessage && lastMessage.sender === 'babywen' && (
                        <div className="text-lg text-white text-center flex flex-col items-center justify-center whitespace-pre-wrap">
                          {lastMessage.text}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Answer section with scale/fade animation */}
              <div className="flex justify-center mt-6 mb-8">
                <div className="w-full max-w-2xl">
                  {/* Dynamic input component with fade and scale transition */}
                  <div className={`transition-all duration-1000 transform ${
                    showInput 
                      ? 'opacity-100 scale-100' 
                      : 'opacity-0 scale-95 pointer-events-none'
                  } ${showInputContainer ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'}`}>
                    {showInput && renderInputComponent()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Wallet change error dialog */}
          {showWalletChangeError && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] backdrop-blur-md">
              <div className="bg-gradient-to-r from-[#1a1a1a] to-[#222] rounded-2xl p-6 max-w-md border border-red-500/30 shadow-xl">
                <div className="flex items-center mb-4 text-red-500">
                  <AlertTriangle size={24} className="mr-2" />
                  <h3 className="text-xl font-medium">Wallet Change Detected</h3>
                </div>
                <p className="text-gray-300 mb-6">
                  Your wallet connection has changed during the DAO creation process. 
                  For security reasons, you must restart the process with a single wallet.
                </p>
                <div className="flex justify-end">
                  <button 
                    onClick={() => navigate('/')}
                    className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg transition-colors"
                  >
                    Return to Home
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Exit confirmation dialog */}
          {showExitConfirmation && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] backdrop-blur-sm">
              <div className="bg-gradient-to-r from-[#1a1a1a] to-[#222] rounded-2xl p-6 max-w-md border border-indigo-500/20">
                <h3 className="text-xl font-medium mb-4">Exit Confirmation</h3>
                <p className="text-gray-300 mb-6">Are you sure you want to leave? Your progress will be lost.</p>
                <div className="flex justify-end gap-4">
                  <button
                    onClick={cancelExit}
                    className="px-4 py-2 bg-[#333] hover:bg-[#444] text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={confirmExit}
                    className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg transition-colors"
                  >
                    Exit Anyway
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Update the loader styles
const globalStyles = `
  .loader, .loader:before, .loader:after {
    border-radius: 50%;
    width: 2.5em;
    height: 2.5em;
    animation-fill-mode: both;
    animation: bblFadInOut 1.8s infinite ease-in-out;
  }
  .loader {
    color: #FFF;
    font-size: 5px;
    position: absolute;
    text-indent: -9999em;
    transform: translate(-50%, -50%);
    top: 50%;
    left: 50%;
  }
  .loader:before,
  .loader:after {
    content: '';
    position: absolute;
    top: 0;
  }
  .loader:before {
    left: -3.5em;
    animation-delay: -0.32s;
  }
  .loader:after {
    left: 3.5em;
  }

  @keyframes bblFadInOut {
    0%, 80%, 100% { box-shadow: 0 2.5em 0 -1.3em }
    40% { box-shadow: 0 2.5em 0 0 }
  }
  
  /* Animation keyframes for the UI elements */
  @keyframes fadeInScale {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  /* Modal animations */
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes scaleIn {
    from { 
      opacity: 0;
      transform: scale(0.95);
    }
    to { 
      opacity: 1;
      transform: scale(1);
    }
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.3s ease-out forwards;
  }
  
  .animate-scaleIn {
    animation: scaleIn 0.4s ease-out forwards;
  }
`;

// Add the styles to the document
const styleSheet = document.createElement("style");
styleSheet.textContent = globalStyles;
document.head.appendChild(styleSheet);

export default BabyWenOnboarding; 