import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { typography, ui, containers } from '../styles/theme';
import { X } from 'lucide-react';

// Import components for the onboarding experience
import OnboardingBackground from './BabyWenOnboarding/components/OnboardingBackground';
import OnboardingHeader from './BabyWenOnboarding/components/OnboardingHeader';
import OnboardingSidebar from './BabyWenOnboarding/components/OnboardingSidebar';
import ChatBubble from './BabyWenOnboarding/components/ChatBubble';
import ChatInput from './BabyWenOnboarding/components/ChatInput';
import MultiChoiceInput from './BabyWenOnboarding/components/MultiChoiceInput';
import FormInput, { FormField } from './BabyWenOnboarding/components/FormInput';
import ButtonAction from './BabyWenOnboarding/components/ButtonAction';
import MultiSelect from './BabyWenOnboarding/components/MultiSelect';

// Import the step definitions
import WelcomeStep from './BabyWenOnboarding/examples/WelcomeStep';
import NameStep from './BabyWenOnboarding/examples/NameStep';
import FavoriteColorStep from './BabyWenOnboarding/examples/FavoriteColorStep';
import FormStep from './BabyWenOnboarding/examples/FormStep';
import ButtonStep from './BabyWenOnboarding/examples/ButtonStep';
import MultiSelectStep from './BabyWenOnboarding/examples/MultiSelectStep';

// Types for the onboarding flow
export type StepId = 'welcome' | 'name' | 'favorite-color' | 'form' | 'button' | 'multi-select';

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
  onResponse: (response: string) => {
    responseMessage?: string;
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
  
  // Active section for sidebar highlight
  const [activeSection, setActiveSection] = React.useState<string>('dashboard');
  
  // UI States
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [currentStep, setCurrentStep] = React.useState<StepId>('welcome');
  const [userInput, setUserInput] = React.useState<string>('');
  const [isTyping, setIsTyping] = React.useState<boolean>(false);
  const [showExitConfirmation, setShowExitConfirmation] = React.useState<boolean>(false);
  const [showInput, setShowInput] = React.useState<boolean>(true);
  const [inputType, setInputType] = React.useState<'text' | 'multiChoice' | 'form' | 'button' | 'multiSelect'>('text');
  
  // Create an object that maps step IDs to step objects
  const steps: Record<StepId, OnboardingStep> = {
    welcome: WelcomeStep,
    name: NameStep,
    'favorite-color': FavoriteColorStep,
    form: FormStep,
    button: ButtonStep,
    'multi-select': MultiSelectStep
  };

  // Initialize with first step message
  React.useEffect(() => {
    // Get the first message of the welcome step
    const firstMessage = steps['welcome'].messages[0];
    
    // Add the first message to the chat
    setMessages([
      {
        sender: 'babywen',
        text: firstMessage.content,
        options: firstMessage.options
      }
    ]);
    
    // Determine the input type based on the step
    determineInputType(steps['welcome']);
  }, []);

  // Function to determine the input type based on the step
  const determineInputType = (step: OnboardingStep) => {
    if (step.formFields) {
      setInputType('form');
    } else if (step.buttonAction) {
      setInputType('button');
    } else if (step.multiSelectOptions) {
      setInputType('multiSelect');
    } else if (step.messages[0].options) {
      setInputType('multiChoice');
    } else {
      setInputType('text');
    }
  };

  // Handle sending a message
  const handleSendMessage = () => {
    if (userInput.trim() === '') return;
    
    // Add user message to chat
    const newUserMessage = { sender: 'user' as const, text: userInput.trim() };
    setMessages(prev => [...prev, newUserMessage]);
    setUserInput('');
    
    // Process user input based on current step
    processUserResponse(userInput.trim());
  };
  
  // Process user response based on current step
  const processUserResponse = (response: string) => {
    // Get the current step
    const step = steps[currentStep as keyof typeof steps];
    
    // Get the response message from the step
    const result = step.onResponse(response);
    
    // If there's a response message, simulate BabyWen typing
    if (result.responseMessage) {
      simulateBabyWenTyping(result.responseMessage);
    }
    
    // Define the flow order centrally
    const determineNextStep = () => {
      // Define the sequence of steps
      const flowOrder: StepId[] = [
        'welcome', 
        'name',
        'form',
        'button',
        'multi-select'
      ];
      
      // Find current step index
      const currentIndex = flowOrder.indexOf(currentStep as StepId);
      
      // If we're at the end of the flow, go back to the beginning
      if (currentIndex === flowOrder.length - 1) {
        return flowOrder[0];
      }
      
      // Otherwise go to the next step
      return flowOrder[currentIndex + 1];
    };
    
    // Get the next step based on the flow
    const nextStepId = determineNextStep();
    const nextStep = steps[nextStepId as keyof typeof steps];
    
    // Set the next step
    setCurrentStep(nextStepId);
    
    // After a delay, show the next step's first message
    if (nextStep) {
      setTimeout(() => {
        const nextMessage = nextStep.messages[0];
        simulateBabyWenTyping(nextMessage.content, nextMessage.options);
        determineInputType(nextStep);
      }, result.responseMessage ? 2000 : 500);
    }
  };
  
  // Handle option click for multi-choice responses
  const handleOptionClick = (option: string) => {
    // Add user message with the selected option
    setMessages(prev => [...prev, { sender: 'user' as const, text: option }]);
    
    // Process the response
    processUserResponse(option);
  };

  // Handle form submission
  const handleFormSubmit = (formData: Record<string, string>) => {
    // Convert form data to JSON string for processing
    const formDataString = JSON.stringify(formData);
    
    // Show a summary of the submitted data
    const formSummary = Object.entries(formData)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');
    
    // Add user message with form summary
    setMessages(prev => [...prev, { sender: 'user' as const, text: `Submitted: ${formSummary}` }]);
    
    // Process the form data
    processUserResponse(formDataString);
  };

  // Handle button action
  const handleButtonAction = () => {
    const step = steps[currentStep as keyof typeof steps];
    
    if (step.buttonAction?.action === 'showAlert') {
      alert('Hello World! This is a special message just for you!');
    }
    
    // Add user message indicating button was clicked
    setMessages(prev => [...prev, { 
      sender: 'user' as const, 
      text: `Clicked: ${step.buttonAction?.label}` 
    }]);
    
    // Process the button action
    processUserResponse('button_clicked');
  };

  // Handle multi-select submission
  const handleMultiSelectSubmit = (selectedOptions: string[]) => {
    // Convert selected options to JSON string for processing
    const optionsString = JSON.stringify(selectedOptions);
    
    // Show selected options
    const optionsSummary = selectedOptions.join(', ');
    
    // Add user message with selections
    setMessages(prev => [...prev, { 
      sender: 'user' as const, 
      text: `Selected: ${optionsSummary}` 
    }]);
    
    // Process the selected options
    processUserResponse(optionsString);
  };
  
  // Simulate BabyWen typing
  const simulateBabyWenTyping = async (message: string, options?: string[]) => {
    setIsTyping(true);
    setShowInput(false);
    
    // Simulate typing delay (1-2 seconds based on message length)
    const typingDelay = Math.min(1000 + message.length * 10, 2000);
    await new Promise(resolve => setTimeout(resolve, typingDelay));
    
    setMessages(prev => [...prev, { sender: 'babywen' as const, text: message, options }]);
    setIsTyping(false);
    setShowInput(true);
  };
  
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
  
  // Get the most recent messages for display
  const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;
  const secondLastMessage = messages.length > 1 ? messages[messages.length - 2] : null;
  
  // Get the current step
  const currentStepObj = steps[currentStep as keyof typeof steps];
  
  // Render appropriate input component based on input type
  const renderInputComponent = () => {
    if (!showInput) return null;
    
    switch (inputType) {
      case 'text':
        return (
          <ChatInput
            value={userInput}
            onChange={setUserInput}
            onSend={handleSendMessage}
          />
        );
      case 'multiChoice':
        return (
          <MultiChoiceInput
            options={lastMessage?.options || []}
            onSelect={handleOptionClick}
          />
        );
      case 'form':
        return (
          <FormInput
            fields={currentStepObj.formFields || []}
            onSubmit={handleFormSubmit}
          />
        );
      case 'button':
        return (
          <ButtonAction
            label={currentStepObj.buttonAction?.label || 'Click Me'}
            onClick={handleButtonAction}
            variant={currentStepObj.buttonAction?.variant as ButtonVariant || 'primary'}
          />
        );
      case 'multiSelect':
        return (
          <MultiSelect
            options={currentStepObj.multiSelectOptions || []}
            onSubmit={handleMultiSelectSubmit}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* App Background with split design */}
      <OnboardingBackground />
      
      {/* Back button - Has confirmation dialog */}
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
            <p className="text-gray-300 mb-6">Are you sure you want to leave? Your progress will be lost.</p>
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
        {/* Left Sidebar */}
        <OnboardingSidebar 
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          daoName=""
          daoLogo={null}
          showDaoInfo={false}
        />
        
        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden z-10 relative">
          {/* Header */}
          <OnboardingHeader activeSection={activeSection} />
          
          {/* Main content area */}
          <div className="flex-1 overflow-y-auto">
            <div className="transition-opacity duration-300 opacity-100 my-10">
              <div className="p-6">
                <div className="flex justify-between items-center mb-5">
                  <h1 className={typography.h1}>Creation</h1>
                </div>
                
                {/* Dashboard content - Empty initially */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="col-span-3 lg:col-span-2">
                    {/* Placeholder for dynamic content */}
                    <div className={`${containers.card} opacity-30`}>
                      <h2 className={typography.h3}>DAO Overview</h2>
                      <div className="h-48 flex items-center justify-center">
                        <p className="text-gray-500">Content will appear here as you complete the onboarding</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-span-3 lg:col-span-1">
                    {/* Placeholder for profile */}
                    <div className={`${containers.card} opacity-30`}>
                      <h2 className={typography.h3}>DAO Profile</h2>
                      <div className="h-32 flex items-center justify-center">
                        <p className="text-gray-500">Profile will appear here</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* BabyWen and Chat Interface - Floating overlaid - CLICKABLE */}
      <div className="absolute bottom-0 left-0 right-0 z-50 pointer-events-auto">
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

            {/* Latest BabyWen Message */}
            {lastMessage && lastMessage.sender === 'babywen' && (
              <ChatBubble
                message={lastMessage.text}
                options={lastMessage.options}
                onOptionClick={handleOptionClick}
              />
            )}
          </div>

          {/* User Reply Bubble */}
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
          
          {/* Dynamic Input Area based on the current step type */}
          {renderInputComponent()}
        </div>
      </div>
    </div>
  );
};

export default BabyWenOnboarding; 