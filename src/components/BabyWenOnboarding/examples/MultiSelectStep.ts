import { OnboardingStep } from '../../BabyWenOnboarding';

const MultiSelectStep: OnboardingStep = {
  id: 'multi-select',
  messages: [
    {
      content: "Select all the topics you're interested in:"
    }
  ],
  multiSelectOptions: [
    'Blockchain Technology',
    'Decentralized Finance',
    'DAOs',
    'NFTs',
    'Crypto Trading',
    'Web3 Development',
    'Privacy & Security',
    'Tokenomics'
  ],
  onResponse: (response: string) => {
    // The response will be a JSON string of the selected options array
    const selectedOptions = JSON.parse(response) as string[];
    
    return {
      responseMessage: `You selected ${selectedOptions.length} topics! I'll make sure to keep those in mind.`
    };
  }
};

export default MultiSelectStep; 