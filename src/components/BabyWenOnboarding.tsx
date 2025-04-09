import React, { useState, useEffect, useRef } from 'react';
import { daosService } from '../services/DaosService';
import { userService } from '../services/UserService';
import { useWallet } from '@solana/wallet-adapter-react';
import { useEffectOnce } from '../hooks/useEffectOnce';
import Button from './common/Button';
import { useNavigate } from 'react-router-dom';
import { typography, ui } from '../styles/theme';
import { 
  ArrowRight, 
  Check, 
  Loader, 
  Send,
  X,
  Twitter,
  Globe,
  Instagram,
  CircleDollarSign,
  Users,
  Vote,
  Home,
  Building2, 
  Layers, 
  Wallet,
  ArrowLeft
} from 'lucide-react';
import useApiAndWallet from '../hooks/useApiAndWallet';
import ApiAuthStatus from './common/ApiAuthStatus';

// Define onboarding steps
type OnboardingStep = 
  | 'welcome'
  | 'name'
  | 'description'
  | 'logo'
  | 'socials'
  | 'confirmation'
  | 'processing'
  | 'complete';

// Message types for the dialogue
interface Message {
  sender: 'user' | 'babywen';
  text: string;
  options?: string[];
}

// Composants internes spécifiques à l'onboarding
// Header interne pour l'onboarding
const OnboardingHeader = ({ 
  activeSection 
}: { 
  activeSection: string
}) => {
  const { apiStatus, userDisplayInfo } = useApiAndWallet();
  
  const getSectionDisplayName = () => {
    switch (activeSection) {
      case 'governance':
        return 'Governance';
      case 'pods':
        return 'Pods';
      case 'members':
        return 'Members';
      case 'profile':
        return 'My Profile';
      default:
        return 'Home';
    }
  };

  return (
    <header className={ui.header}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-surface-500 select-none ml-2">DAO</span>
          <span className="mx-2 text-surface-500">/</span>
          <span className="text-text select-none min-w-[100px]">{getSectionDisplayName()}</span>
        </div>
        
        <div className="flex items-center gap-4">
          <ApiAuthStatus 
            apiStatus={apiStatus} 
            userDisplayInfo={userDisplayInfo}
          />
        </div>
      </div>
    </header>
  );
};

// Sidebar interne pour l'onboarding
const OnboardingSidebar = ({ 
  activeSection, 
  setActiveSection, 
  daoName, 
  daoLogo, 
  showDaoInfo 
}: { 
  activeSection: string, 
  setActiveSection: (section: string) => void,
  daoName: string,
  daoLogo: string | null,
  showDaoInfo: boolean
}) => {
  const navigate = useNavigate();

  // Handle return to landing page
  const handleReturnToLanding = () => {
    navigate('/');
  };

  const navItems = [
    {
      section: 'DAO',
      items: [
        { id: 'dashboard', label: 'Home', icon: <Home size={18} /> },
        { id: 'governance', label: 'Governance', icon: <Building2 size={18} /> },
        { id: 'pods', label: 'Pods', icon: <Layers size={18} /> },
        { id: 'treasury', label: 'Treasury', icon: <Wallet size={18} /> },
        { id: 'members', label: 'Members', icon: <Users size={18} /> }
      ]
    }
  ];

  return (
    <div className={`w-64 text-text flex flex-col ${ui.sidebar} font-normal relative z-10`}>
      {/* Back to landing page button - now invisible and unusable */}
      <div className="p-4 text-center invisible pointer-events-none">
        <button 
          className="flex items-center text-surface-500 hover:text-text transition-colors mx-auto"
          title="Return to landing page"
        >
          <ArrowLeft size={16} className="mr-2" />
          <span className="text-sm">Back to Homepage</span>
        </button>
      </div>
      
      {/* DAO Profile */}
      <div className="p-4 flex flex-col items-center">
        <div className="w-20 h-20 rounded-full bg-primary mb-2 overflow-hidden">
          {showDaoInfo && daoLogo ? (
            <img 
              src={daoLogo}
              alt="DAO Logo" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-indigo-600/30 to-purple-600/30 flex items-center justify-center">
              <Users size={40} className="text-gray-400" />
            </div>
          )}
        </div>
        <div className="text-center">
          <p className="text-sm text-text font-normal">
            {showDaoInfo && daoName ? daoName : <span className="text-gray-500">New DAO</span>}
          </p>
        </div>
      </div>
      
      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        {navItems.map((section) => (
          <React.Fragment key={section.section}>
            <div className="px-3 py-2 text-xs text-surface-500 font-normal">{section.section}</div>
            <nav>
              {section.items
                .filter(item => item.id === 'dashboard')
                .map((item) => (
                  <button 
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`flex items-center px-5 py-3 my-1 mx-[5%] w-[90%] text-left rounded-[12px] font-normal ${activeSection === item.id ? 'bg-surface-300' : 'hover:bg-surface-200'}`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span className="font-normal">{item.label}</span>
                  </button>
                ))}
            </nav>
          </React.Fragment>
        ))}
      </div>
      
      {/* DAO Logo */}
      <div className="p-4">
        <div className="w-32 mx-auto">
          <img 
            src="https://i.imgur.com/OZCrF4z.png" 
            alt="DAO Logo" 
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    </div>
  );
};

const BabyWenOnboarding: React.FC = () => {
  // User input states
  const [daoName, setDaoName] = useState<string>('');
  const [daoDescription, setDaoDescription] = useState<string>('');
  const [daoLogo, setDaoLogo] = useState<File | null>(null);
  const [daoLogoPreview, setDaoLogoPreview] = useState<string | null>(null);
  const [socialLinks, setSocialLinks] = useState({
    twitter: '',
    instagram: '',
    website: '',
    telegram: '',
    tiktok: ''
  });
  
  // UI states
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showInput, setShowInput] = useState<boolean>(true);
  
  // For Header and Sidebar components
  const [activeSection, setActiveSection] = useState<string>('dashboard');
  
  // Confirmation state for exit
  const [showExitConfirmation, setShowExitConfirmation] = useState<boolean>(false);
  
  // References
  const userInputRef = useRef<HTMLInputElement>(null);
  const { publicKey } = useWallet();
  const navigate = useNavigate();
  
  // Additional states for controlling component visibility
  const [showDaoProfile, setShowDaoProfile] = useState<boolean>(false);
  const [showOverallStats, setShowOverallStats] = useState<boolean>(false);
  const [showDaoTasks, setShowDaoTasks] = useState<boolean>(false);
  const [showProposals, setShowProposals] = useState<boolean>(false);
  const [showMemberDistribution, setShowMemberDistribution] = useState<boolean>(false);
  const [showDaoToken, setShowDaoToken] = useState<boolean>(false);
  const [showSidebarDaoInfo, setShowSidebarDaoInfo] = useState<boolean>(false);
  
  // Initialize with welcome message
  useEffect(() => {
    setMessages([
      {
        sender: 'babywen' as const,
        text: "Hello there! I'm BabyWen, your AI assistant. I'll help you create an amazing DAO in just a few steps. Ready to get started?",
        options: ['Yes, let\'s go!', 'Tell me more about DAOs']
      }
    ]);
  }, []);
  
  // Focus input when available
  useEffect(() => {
    if (!isTyping && userInputRef.current && showInput) {
      userInputRef.current.focus();
    }
  }, [isTyping, showInput]);
  
  // Handle exit confirmation dialog
  const handleExitClick = () => {
    setShowExitConfirmation(true);
  };
  
  const confirmExit = () => {
    navigate('/');
  };
  
  const cancelExit = () => {
    setShowExitConfirmation(false);
  };
  
  // Simulate BabyWen typing response
  const simulateBabyWenTyping = async (message: string, options?: string[]) => {
    setIsTyping(true);
    setShowInput(false);
    
    // Simulate typing delay (1.5-2.5 seconds based on message length)
    const typingDelay = Math.min(1500 + message.length * 15, 2500);
    await new Promise(resolve => setTimeout(resolve, typingDelay));
    
    setMessages(prev => [...prev, { sender: 'babywen' as const, text: message, options }]);
    setIsTyping(false);
    setShowInput(true);
  };
  
  // Handle user message submission
  const handleSendMessage = () => {
    if (userInput.trim() === '' && !isProcessing) return;
    
    // Add user message to chat
    const newUserMessage = { sender: 'user' as const, text: userInput.trim() };
    setMessages(prev => [...prev, newUserMessage]);
    setUserInput('');
    
    // Process based on current step
    processUserInput(userInput.trim());
  };
  
  // Handle social media links input
  const handleSocialInput = (input: string) => {
    const lowerInput = input.toLowerCase();
    
    // If input is "skip" or "skip this step", move to confirmation
    if (lowerInput.includes('skip') || lowerInput === 'skip this step') {
      setCurrentStep('confirmation');
      simulateBabyWenTyping(`Perfect! Here's a summary of your DAO:\n\nName: ${daoName}\nDescription: ${daoDescription}\n\nDoes everything look good? Type 'yes' to confirm or let me know what you'd like to change.`);
      return;
    }
    
    // If input is "continue", move to confirmation
    if (lowerInput === 'continue') {
      setCurrentStep('confirmation');
      
      // Create a summary of social links for the confirmation message
      const socialSummary = Object.entries(socialLinks)
        .filter(([_, value]) => value)
        .map(([key, value]) => `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`)
        .join('\n');
      
      simulateBabyWenTyping(
        `Perfect! Here's a summary of your DAO:\n\nName: ${daoName}\nDescription: ${daoDescription}\n${socialSummary ? '\nSocial Links:\n' + socialSummary : ''}\n\nDoes everything look good? Type 'yes' to confirm or let me know what you'd like to change.`
      );
      return;
    }
    
    // Default - show the social links form
    simulateBabyWenTyping("Let me know your social links. You can skip any or all of them.", 
      ['Continue', 'Skip this step']);
  };
  
  // Handle social links form submission
  const handleSocialLinksUpdate = (links: typeof socialLinks) => {
    setSocialLinks(links);
    
    // Add a user message to indicate links have been provided
    setMessages(prev => [...prev, { 
      sender: 'user' as const, 
      text: "I've added my social links" 
    }]);
    
    // Move to confirmation step
    setCurrentStep('confirmation');
    
    // Create a summary of social links for the confirmation message
    const socialSummary = Object.entries(links)
      .filter(([_, value]) => value)
      .map(([key, value]) => `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`)
      .join('\n');
    
    simulateBabyWenTyping(
      `Perfect! Here's a summary of your DAO:\n\nName: ${daoName}\nDescription: ${daoDescription}\n${socialSummary ? '\nSocial Links:\n' + socialSummary : ''}\n\nDoes everything look good? Type 'yes' to confirm or let me know what you'd like to change.`
    );
  };
  
  // Social Links Form component
  const SocialLinksForm = ({ 
    onUpdate, 
    onSkip 
  }: { 
    onUpdate: (links: typeof socialLinks) => void, 
    onSkip: () => void 
  }) => {
    const [formLinks, setFormLinks] = useState({...socialLinks});
    
    const handleChange = (key: keyof typeof socialLinks, value: string) => {
      setFormLinks(prev => ({ ...prev, [key]: value }));
    };
    
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onUpdate(formLinks);
    };
    
    return (
      <form onSubmit={handleSubmit} className="px-4 py-4 bg-[#151515] border border-gray-700 rounded-xl mx-4 mb-4 shadow-lg">
        <h3 className="text-white text-lg mb-3">Social Links</h3>
        <div className="space-y-3">
          <div className="flex flex-col">
            <label className="text-gray-400 text-sm mb-1">Twitter Username:</label>
            <input
              type="text"
              value={formLinks.twitter}
              onChange={(e) => handleChange('twitter', e.target.value)}
              placeholder="@username or full URL"
              className="bg-[#222] border border-gray-700 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
            />
          </div>
          
          <div className="flex flex-col">
            <label className="text-gray-400 text-sm mb-1">Website URL:</label>
            <input
              type="text"
              value={formLinks.website}
              onChange={(e) => handleChange('website', e.target.value)}
              placeholder="https://example.com"
              className="bg-[#222] border border-gray-700 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
            />
          </div>
          
          <div className="flex flex-col">
            <label className="text-gray-400 text-sm mb-1">Instagram:</label>
            <input
              type="text"
              value={formLinks.instagram}
              onChange={(e) => handleChange('instagram', e.target.value)}
              placeholder="@username or full URL"
              className="bg-[#222] border border-gray-700 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
            />
          </div>
          
          <div className="flex flex-col">
            <label className="text-gray-400 text-sm mb-1">Telegram:</label>
            <input
              type="text"
              value={formLinks.telegram}
              onChange={(e) => handleChange('telegram', e.target.value)}
              placeholder="@username or full URL"
              className="bg-[#222] border border-gray-700 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
            />
          </div>
          
          <div className="flex flex-col">
            <label className="text-gray-400 text-sm mb-1">TikTok:</label>
            <input
              type="text"
              value={formLinks.tiktok}
              onChange={(e) => handleChange('tiktok', e.target.value)}
              placeholder="@username or full URL"
              className="bg-[#222] border border-gray-700 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>
        
        <div className="flex justify-between mt-4">
          <button
            type="button"
            onClick={onSkip}
            className="px-4 py-2 bg-[#333] hover:bg-[#444] text-gray-200 rounded-lg transition-colors"
          >
            Skip
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg"
          >
            Continue
          </button>
        </div>
      </form>
    );
  };
  
  // Process user input based on current step
  const processUserInput = (input: string) => {
    switch (currentStep) {
      case 'welcome':
        // For options clicks or first input, move to name step
        setCurrentStep('name');
        simulateBabyWenTyping("Great! Let's start by giving your DAO a name. What would you like to call it?");
        break;
        
      case 'name':
        // Save DAO name
        setDaoName(input);
        setCurrentStep('description');
        simulateBabyWenTyping(`"${input}" is a fantastic name! Now, let's add a short description for your DAO. What's it all about?`);
        break;
        
      case 'description':
        // Save description
        setDaoDescription(input);
        
        // Pass to logo step
        setCurrentStep('logo');
        simulateBabyWenTyping(
          "Great description! Now, let's add a logo for your DAO. You can upload an image file from your computer.",
          ['Upload Logo', 'Skip for now']
        );
        break;
        
      case 'logo':
        // This step is mainly handled by handleOptionClick or handleFileUpload
        if (input.toLowerCase().includes('skip')) {
          // If user skips this step
          setShowDaoProfile(true);
          setShowOverallStats(true);
          setShowDaoTasks(true);
          
          setCurrentStep('socials');
          simulateBabyWenTyping(
            "No problem! I'm updating your DAO preview. Now, let's add some social links (optional). You can skip any or all of them."
          );
        }
        break;
        
      case 'socials':
        // Handle socials based on the specific input or selection
        handleSocialInput(input);
        break;
        
      case 'confirmation':
        if (input.toLowerCase().includes('yes') || input.toLowerCase().includes('confirm')) {
          setCurrentStep('processing');
          createDAO();
        } else {
          simulateBabyWenTyping("No problem! Let's review the details again. Is there anything specific you'd like to change?", 
            ['Name', 'Description', 'Social Links', 'All looks good!']);
        }
        break;
        
      default:
        // Handle any other case
        simulateBabyWenTyping("I'm not sure how to proceed. Let's go back to the beginning.");
        setCurrentStep('welcome');
    }
  };
  
  // Handle file upload for DAO logo
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file type
    if (!file.type.match('image.*')) {
      simulateBabyWenTyping("The file you selected is not an image. Please upload an image file (JPEG, PNG, etc.).");
      return;
    }
    
    // Check size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      simulateBabyWenTyping("The image is too large. Please upload an image smaller than 5MB.");
      return;
    }
    
    setDaoLogo(file);
    
    // Create a preview of the logo
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setDaoLogoPreview(result);
      
      // Add user message to indicate that the logo has been uploaded
      setMessages(prev => [...prev, { sender: 'user' as const, text: "I've uploaded a logo" }]);
      
      // Show DAO preview components
      setShowDaoProfile(true);
      setShowOverallStats(true);
      setShowDaoTasks(true);
      setShowSidebarDaoInfo(true);
      
      // Continue to social links step
      setCurrentStep('socials');
      simulateBabyWenTyping(
        "Perfect! Your logo looks great. I'm updating your DAO preview. Now, let's add some social links (optional). You can skip any or all of them."
      );
    };
    reader.readAsDataURL(file);
  };
  
  // Handle option selection (clickable chat options)
  const handleOptionClick = (option: string) => {
    // Add user message with the selected option
    setMessages(prev => [...prev, { sender: 'user' as const, text: option }]);
    
    // If option is "Upload Logo", trigger file selector
    if (option === 'Upload Logo' && currentStep === 'logo') {
      // Use hidden input type and trigger it
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/*';
      fileInput.onchange = handleFileUpload as any;
      fileInput.click();
      return;
    }
    
    // If option is "Skip for now" at logo step
    if (option === 'Skip for now' && currentStep === 'logo') {
      // Show components
      setShowOverallStats(true);
      setShowDaoProfile(true);
      setShowDaoTasks(true);
      setShowSidebarDaoInfo(true);
      
      setCurrentStep('socials');
      simulateBabyWenTyping(
        "No problem! Let's move on. Now, let's add some social links (optional). You can skip any or all of them."
      );
      return;
    }
    
    // Process the selected option for other cases
    processUserInput(option);
  };

  // Get the most recent message
  const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;
  const secondLastMessage = messages.length > 1 ? messages[messages.length - 2] : null;
  
  // Create the actual DAO
  const createDAO = async () => {
    setIsProcessing(true);
    setError(null);
    
    try {
      // Show a message about creation process
      simulateBabyWenTyping("Creating your DAO now, this will just take a moment...");
      
      // Get current user ID
      const userData = await userService.getMe();
      const userId = userData?.userId;
      
      if (!userId) {
        throw new Error("Failed to get user ID. Please try again or use the manual form.");
      }
      
      // Create DAO with gathered information
      const result = await daosService.createDao({
        name: daoName,
        description: daoDescription,
        userId,
        twitter: socialLinks.twitter || undefined,
        instagram: socialLinks.instagram || undefined,
        website: socialLinks.website || undefined,
        telegram: socialLinks.telegram || undefined,
        tiktok: socialLinks.tiktok || undefined,
        profilePicture: daoLogo || undefined,
      });
      
      if (result && result.daoId) {
        setCurrentStep('complete');
        simulateBabyWenTyping(`🎉 Congratulations! Your DAO "${daoName}" has been created successfully. You can now explore and manage it from the dashboard.`);
        
        // Navigate to the new DAO's dashboard after a delay
        setTimeout(() => {
          navigate(`/daos/${result.daoId?.toString()}`);
        }, 3000);
      } else {
        throw new Error("Failed to create DAO. Please try again or use the manual form.");
      }
      
    } catch (err) {
      console.error("Error creating DAO:", err);
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
      simulateBabyWenTyping(`I'm sorry, but there was an error creating your DAO: ${err instanceof Error ? err.message : "Unknown error"}. Would you like to try again?`, ['Try Again', 'Use Manual Form']);
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <div className="flex h-screen overflow-hidden">
      {/* App Background with split design - from App.tsx */}
      <div className="fixed inset-0 z-0">
        {/* Banner - 20% viewport height */}
        <div className="h-[20vh] w-full bg-[url('https://applescoop.org/image/wallpapers/mac/pink-blue-purple-abstract-gradient-08-10-2024-1728440099-hd-wallpaper.jpg')] bg-cover bg-center bg-no-repeat"></div>
        {/* Main background - dark grey for remaining 80% */}
        <div className="h-[80vh] w-full bg-background"></div>
      </div>
      
      {/* Back button - Now has confirmation dialog */}
      <button 
        onClick={handleExitClick}
        className="absolute top-4 left-4 z-50 bg-[#222] p-2 rounded-full hover:bg-[#333] transition-colors pointer-events-auto"
        aria-label="Go back"
      >
        <X size={20} className="text-white" />
      </button>
      
      {/* Exit confirmation dialog */}
      {showExitConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
          <div className="bg-surface-100 rounded-xl p-6 max-w-md">
            <h3 className="text-xl font-medium text-text mb-4">Exit Confirmation</h3>
            <p className="text-gray-300 mb-6">Are you sure you want to leave? Your DAO creation progress will be lost.</p>
            <div className="flex justify-end gap-4">
              <button 
                onClick={cancelExit}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg"
              >
                Cancel
              </button>
              <button 
                onClick={confirmExit}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
              >
                Exit Anyway
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Dashboard Structure - All elements are non-clickable */}
      <div className="flex h-screen w-full z-10 pointer-events-none">
        {/* Left Sidebar - Using internal component */}
        <OnboardingSidebar 
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          daoName={daoName}
          daoLogo={daoLogoPreview}
          showDaoInfo={showSidebarDaoInfo}
        />
        
        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden z-10 relative">
          {/* Header - Using internal component */}
          <OnboardingHeader 
            activeSection={activeSection}
          />
          
          {/* Main content area - Modified to match App.tsx layout exactly */}
          <div className="flex-1 overflow-y-auto">
            <div className="transition-opacity duration-300 opacity-100 my-10">
              <div className="p-6">
                <div className="flex justify-between items-center mb-5">
                  <h1 className={typography.h1}>Creation</h1>
                  <div className="flex gap-4">
                    <Button 
                      variant="outline"
                      className="flex items-center gap-2 border-2 border-gray-800 hover:border-purple-500/50 bg-[#151515] h-10 invisible"
                    >
                      <span>Placeholder</span>
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column: DAO Portfolio + News + Proposals */}
                  <div className="col-span-2 space-y-4">
                    {/* Overall DAO Stats */}
                    <div className={`bg-[#111]/80 backdrop-blur-sm rounded-xl p-5 shadow-lg border border-gray-800/60 transform transition-all duration-700 ${showOverallStats ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                      <div className="mb-3">
                        <h2 className="text-xl font-medium text-white">Overall DAO Stats</h2>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex flex-col">
                          <div className="text-sm text-gray-400 flex items-center">
                            <span>DAO Balance</span>
                            <span className="ml-2 px-2 py-0.5 bg-primary/20 text-primary text-xs rounded-full">+24%</span>
                          </div>
                          <div className="text-2xl font-bold text-white mt-1">$0.00</div>
                        </div>
                        
                        <div className="flex flex-col">
                          <div className="text-sm text-gray-400 flex items-center">
                            <span>DAO Members</span>
                            <span className="ml-2 px-2 py-0.5 bg-indigo-500/20 text-indigo-400 text-xs rounded-full">+12 this week</span>
                          </div>
                          <div className="text-2xl font-bold text-white mt-1">0</div>
                        </div>
                        
                        <div className="flex flex-col">
                          <div className="text-sm text-gray-400 flex items-center">
                            <span>Active Proposals</span>
                            <span className="ml-2 px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded-full">0 closing soon</span>
                          </div>
                          <div className="text-2xl font-bold text-white mt-1">0</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* DAO Tasks */}
                    <div className={`bg-[#111]/80 backdrop-blur-sm rounded-xl p-5 shadow-lg border border-gray-800/60 transform transition-all duration-700 ${showDaoTasks ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium text-white">DAO Tasks</h3>
                        <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs">Latest updates</span>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="p-3 bg-[#1A1A1A]/70 rounded-lg border-l-4 border-l-indigo-500">
                          <div className="flex justify-between mb-1">
                            <span className="font-medium text-white">{daoName} Spawned</span>
                            <span className="text-xs text-gray-400">Done!</span>
                          </div>
                          <p className="text-gray-400 text-sm">A new challenger approaches!</p>
                        </div>
                        
                        <div className="p-3 bg-[#1A1A1A]/70 rounded-lg border-l-4 border-l-purple-500">
                          <div className="flex justify-between mb-1">
                            <span className="font-medium text-white">Governance to configure</span>
                            <span className="text-xs text-gray-400">Coming soon</span>
                          </div>
                          <p className="text-gray-400 text-sm">With great power comes great responsibility</p>
                        </div>
                        
                        <div className="p-3 bg-[#1A1A1A]/70 rounded-lg border-l-4 border-l-blue-500">
                          <div className="flex justify-between mb-1">
                            <span className="font-medium text-white">Invite members</span>
                            <span className="text-xs text-gray-400">Coming soon</span>
                          </div>
                          <p className="text-gray-400 text-sm">In every zombie movie, the lone guy dies first. Just sayin'.</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Proposals Activity */}
                    <div className={`bg-[#111]/80 backdrop-blur-sm rounded-xl p-5 shadow-lg border border-gray-800/60 transform transition-all duration-700 ${showProposals ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium text-white">Active Proposals</h3>
                        <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs">0 Active</span>
                      </div>
                      
                      <div className="flex items-center justify-center h-32 text-gray-400">
                        <p>No active proposals at the moment</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right Column: Share Holders + Token Distribution */}
                  <div className="space-y-4">
                    {/* DAO Socials/Profile - Moved to first position */}
                    <div className={`bg-[#111]/80 backdrop-blur-sm rounded-xl p-5 shadow-lg border border-gray-800/60 transform transition-all duration-700 ${showDaoProfile ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                      {/* DAO Profile Section */}
                      <div className="flex flex-row items-center mb-5 border-b border-gray-800 pb-5">
                        {/* Left column - Profile picture (30% width) */}
                        <div className="w-[30%] pr-3 flex justify-center items-center">
                          {daoLogoPreview ? (
                            <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-indigo-600/30 to-purple-600/30 border border-gray-700/50">
                              <img 
                                src={daoLogoPreview}
                                alt={`${daoName} logo`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-600/30 to-purple-600/30 flex items-center justify-center border border-gray-700/50">
                              <Users size={40} className="text-gray-400" />
                            </div>
                          )}
                        </div>
                        
                        {/* Right column - Name and description (70% width) */}
                        <div className="w-[70%] pl-2 flex flex-col justify-center">
                          <h4 className="text-lg font-medium text-white mb-1">{daoName || "New DAO"}</h4>
                          <p className="text-sm text-gray-400 text-left">
                            {daoDescription || "Your DAO description will appear here"}
                          </p>
                        </div>
                      </div>
                      
                      {Object.values(socialLinks).some(link => link) ? (
                        <div className="flex flex-wrap justify-center items-center gap-6 py-2">
                          {socialLinks.twitter && (
                            <a href="#" className="flex flex-col items-center gap-2 hover:opacity-80 transition-opacity">
                              <div className="w-12 h-12 bg-[#1A1A1A] rounded-full flex items-center justify-center hover:bg-[#1A1A1A]/80 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                                </svg>
                              </div>
                              <span className="text-xs text-gray-400">X</span>
                            </a>
                          )}
                          
                          {socialLinks.website && (
                            <a href="#" className="flex flex-col items-center gap-2 hover:opacity-80 transition-opacity">
                              <div className="w-12 h-12 bg-[#1A1A1A] rounded-full flex items-center justify-center hover:bg-[#1A1A1A]/80 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                                  <circle cx="12" cy="12" r="10"></circle>
                                  <line x1="2" y1="12" x2="22" y2="12"></line>
                                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                                </svg>
                              </div>
                              <span className="text-xs text-gray-400">Website</span>
                            </a>
                          )}
                          
                          {socialLinks.instagram && (
                            <a href="#" className="flex flex-col items-center gap-2 hover:opacity-80 transition-opacity">
                              <div className="w-12 h-12 bg-[#1A1A1A] rounded-full flex items-center justify-center hover:bg-[#1A1A1A]/80 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#fff">
                                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.072-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                                </svg>
                              </div>
                              <span className="text-xs text-gray-400">Instagram</span>
                            </a>
                          )}
                          
                          {socialLinks.telegram && (
                            <a href="#" className="flex flex-col items-center gap-2 hover:opacity-80 transition-opacity">
                              <div className="w-12 h-12 bg-[#1A1A1A] rounded-full flex items-center justify-center hover:bg-[#1A1A1A]/80 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#fff">
                                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                                </svg>
                              </div>
                              <span className="text-xs text-gray-400">Telegram</span>
                            </a>
                          )}
                          
                          {socialLinks.tiktok && (
                            <a href="#" className="flex flex-col items-center gap-2 hover:opacity-80 transition-opacity">
                              <div className="w-12 h-12 bg-[#1A1A1A] rounded-full flex items-center justify-center hover:bg-[#1A1A1A]/80 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#fff">
                                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                                </svg>
                              </div>
                              <span className="text-xs text-gray-400">TikTok</span>
                            </a>
                          )}
                        </div>
                      ) : (
                        <div className="py-1 text-center">
                          <p className="text-xs text-gray-500 mt-2">A DAO without community links? Bro, are you sure you're not just talking to your own reflection?</p>
                        </div>
                      )}
                    </div>
                    
                    {/* DAO Token - Moved to second position */}
                    <div className={`bg-[#111]/80 backdrop-blur-sm rounded-xl p-5 shadow-lg border border-gray-800/60 transform transition-all duration-700 ${showDaoToken ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-medium text-white">DAO Token</h3>
                        <span className="text-gray-400 text-sm">Not configured</span>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
                          <CircleDollarSign className="text-white" size={20} />
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-white">$0.00</div>
                          <div className="text-sm text-gray-400">Not yet issued</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Member Distribution */}
                    <div className={`bg-[#111]/80 backdrop-blur-sm rounded-xl p-5 shadow-lg border border-gray-800/60 transform transition-all duration-700 ${showMemberDistribution ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-medium text-white">Share Holders</h3>
                        <div className="text-xs text-gray-500">
                          Waiting for data
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-center h-32 text-gray-400">
                        <p>Member distribution will appear here</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* BabyWen and Dialog Bubbles - Floating overlaid - CLICKABLE */}
      <div className="absolute bottom-0 left-0 right-0 z-50 pointer-events-auto">
        {/* BabyWen Video & Dialog Bubble */}
        <div className="container mx-auto px-4 pb-4 relative">
          <div className="flex items-end">
            {/* BabyWen Video */}
            <div className="mb-4 ml-4 w-32 h-32 rounded-full overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600 border-4 border-[#222] shadow-2xl">
              <video 
                autoPlay 
                loop 
                muted 
                playsInline
                className="w-full h-full object-cover"
              >
                <source src="/assets/video_agent.webm" type="video/webm" />
                <source src="/assets/video_agent.mp4" type="video/mp4" />
              </video>
            </div>

            {/* Latest BabyWen Message as Speech Bubble */}
            {lastMessage && lastMessage.sender === 'babywen' && (
              <div className="mb-4 ml-4 max-w-2xl">
                <div className="bg-[#222] p-4 rounded-xl rounded-bl-none shadow-lg text-white">
                  {lastMessage.text}
                  
                  {/* Options */}
                  {lastMessage.options && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {lastMessage.options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleOptionClick(option)}
                          className="bg-[#333] hover:bg-[#444] text-gray-200 text-sm py-2 px-4 rounded-lg transition-colors"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Reply Bubble (if last message is from user) */}
          {secondLastMessage && lastMessage?.sender === 'user' && (
            <div className="flex justify-end mr-4 mb-4">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-3 rounded-xl rounded-br-none text-white max-w-md">
                {lastMessage.text}
              </div>
            </div>
          )}
          
          {/* Typing indicator */}
          {isTyping && (
            <div className="ml-40 mb-4">
              <div className="bg-[#222] inline-block p-3 rounded-xl">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          {/* Input or Action Area */}
          {currentStep !== 'processing' && currentStep !== 'complete' && showInput ? (
            currentStep === 'socials' ? (
              <SocialLinksForm 
                onUpdate={handleSocialLinksUpdate}
                onSkip={() => {
                  setMessages(prev => [...prev, { sender: 'user' as const, text: "Skip this step" }]);
                  handleSocialInput("skip this step");
                }}
              />
            ) : (
              <div className="px-4 py-3 bg-[#151515] border border-gray-700 rounded-xl mx-4 mb-4 flex shadow-lg">
                <input
                  ref={userInputRef}
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your response here..."
                  className="flex-1 bg-transparent border-none text-white focus:outline-none"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={userInput.trim() === ''}
                  className="ml-2 p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg disabled:opacity-50"
                >
                  <Send size={18} className="text-white" />
                </button>
              </div>
            )
          ) : currentStep === 'complete' ? (
            <div className="flex justify-center mx-4 mb-4">
              <Button
                onClick={() => navigate(`/daos/${daoName.toLowerCase().replace(/\s+/g, '-')}`)}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg shadow-lg"
              >
                <span>Go to Dashboard</span>
                <ArrowRight size={18} className="ml-2" />
              </Button>
            </div>
          ) : currentStep === 'processing' ? (
            <div className="flex justify-center items-center bg-[#151515] border border-gray-700 rounded-xl mx-4 mb-4 py-3 px-4">
              <Loader size={20} className="animate-spin text-purple-500 mr-2" />
              <span className="text-gray-300">Creating your DAO...</span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default BabyWenOnboarding; 