// Define message variations for onboarding steps
// Each step has an array of alternative messages with the same meaning

export type MessageVariations = {
  [key: string]: string[];
};

export const onboardingMessages: MessageVariations = {
  // DAO Name step messages
  'dao-name': [
    "Helloooo! BabyWen here! Ready to help you build your DAO!\nFirst mission: pick a name!",
    "Hi there! BabyWen at your service! Let's create your DAO together!\nStep one: choose a name!",
    "Greetings! It's BabyWen! I'm here to guide you through building your DAO!\nLet's start by naming it!",
    "Welcome! BabyWen reporting for duty! Time to build your DAO!\nFirst up: what will you call it?",
    "Hey friend! BabyWen here to assist with your DAO creation!\nFirst thing we need: a catchy name!"
  ],
  
  // DAO Description step messages
  'dao-description': [
    "Now, let's give your DAO a description!",
    "Great! Next step: describe what your DAO is all about!",
    "Excellent! Now tell me what your DAO's purpose is!",
    "Perfect! Now, what's the mission of your DAO?",
    "Awesome! Let's add a description for your DAO!",
    "Cool name! Now, what's the purpose of your DAO?\nGive me the juicy details"
  ],
  
  // DAO Logo step messages
  'dao-logo': [
    "Let's make your DAO look professional! Enter the URL of your DAO's logo",
    "Every great DAO needs a logo! What's yours going to be?",
    "Time to give your DAO a visual identity! Enter your logo URL",
    "What logo will represent your DAO? Enter the URL here!",
    "A DAO without a logo is like a meme without an image! Let's add one!"
  ],
  
  // DAO Social step messages
  'dao-social': [
    "Let's connect your DAO with the world! Add your social media links",
    "Time to get social! Add links to help people find your DAO online",
    "Help people connect with your DAO by adding your social media accounts",
    "Your DAO needs an online presence! Add your social links here",
    "Want to spread the word about your DAO? Add your social media links now!"
  ],
  
  // Governance Model step messages
  'dao-governance-model': [
    "How do you want your DAO to make decisions?",
    "Let's think about how your DAO will govern itself. Which model do you prefer?",
    "Decision time! How will your DAO members vote on proposals?",
    "Governance is crucial for DAOs. Which model fits your community best?",
    "Time to choose your governance structure! How should your DAO make decisions?"
  ],
  
  // Idea Rights step messages
  'dao-idea-rights': [
    "Who can submit ideas or proposals in your DAO?",
    "Let's determine who can propose new ideas in your DAO.",
    "Who should have the power to submit proposals to your community?",
    "Time to decide who can bring new ideas to your DAO!",
    "Every DAO needs new ideas. Who should be able to propose them?"
  ],
  
  // Vote Rights step messages
  'dao-vote-rights': [
    "Who can vote on proposals in your DAO?",
    "Let's decide who gets voting rights in your DAO",
    "Who should have the power to vote on proposals?",
    "Time to determine your DAO's voting rights!",
    "Who gets a say when it's time to vote in your DAO?"
  ],
  
  // Survalidation step messages
  'dao-survalidation': [
    "Is there someone who has to survalidate the decisions (giving the final \"yes\")?",
    "Should certain members have final approval power over decisions?",
    "Does your DAO need a final approval step after voting?",
    "Who gets the final say on executed decisions in your DAO?",
    "Should your DAO have additional validation after voting?"
  ],
  
  // Voting Power step messages
  'dao-voting-power': [
    "Alright, let's talk power!\nHow do you want to distribute voting power in your DAO?",
    "How should voting power be allocated in your DAO?",
    "What determines how much influence each member has in votes?",
    "Let's decide how voting power works in your DAO!",
    "What's the fairest way to distribute voting power for your community?"
  ],
  
  // Vote Delegation step messages
  'dao-vote-delegation': [
    "Can members hand over their vote to someone they trust?",
    "Should members be able to delegate their voting power to others?",
    "Do you want to allow vote delegation in your DAO?",
    "Can members appoint representatives to vote on their behalf?",
    "Should your DAO support delegation of voting power?"
  ],
  
  // Token Existence step messages
  'dao-token-existence': [
    "Does your DAO have its own token?",
    "Will your DAO use its own token for governance or rewards?",
    "Have you already created a token for your DAO?",
    "Does your organization have an existing token?",
    "Is your DAO powered by its own token?"
  ],
  
  // Token Address step messages
  'dao-token-address': [
    "What's the contract address of your existing token?",
    "Please enter the address of your token contract",
    "Where is your token deployed? Enter the contract address",
    "I'll need your token's contract address to connect it to your DAO",
    "Enter your token's blockchain address to continue"
  ],
  
  // Token Name step messages
  'dao-token-name': [
    "What's the official name of your token?",
    "What would you like to name your DAO's token?",
    "Choose a name for your governance token",
    "Your token needs a name! What will it be?",
    "What should we call your DAO's token?"
  ],
  
  // Token Ticker step messages
  'dao-token-ticker': [
    "What's the ticker symbol for your token?",
    "Choose a short ticker symbol for your token (like BTC or ETH).",
    "Your token needs a ticker symbol. What will it be?",
    "What short symbol will represent your token on exchanges?",
    "Pick a ticker symbol for your DAO's token."
  ],
  
  // Membership Conditions step messages
  'dao-membership-conditions': [
    "How can people join your DAO?",
    "What requirements should new members meet to join your DAO?",
    "What's your DAO's membership policy?",
    "How exclusive should your DAO membership be?",
    "Who can become a member of your DAO and how?"
  ],
  
  // Token Threshold step messages
  'dao-token-threshold': [
    "How many tokens should someone hold to be a member?",
    "What's the minimum token requirement for membership?",
    "Set a token threshold for DAO membership:",
    "How many tokens grants membership in your DAO?",
    "What token balance should qualify someone for membership?"
  ],
  
  // Application Approval step messages
  'dao-application-approval': [
    "Who approves new membership applications?",
    "How should new member applications be reviewed?",
    "Who gets to decide on new membership requests?",
    "What's your process for approving new members?",
    "How will your DAO evaluate membership applications?"
  ],
  
  // Add more step messages as needed
};

// Helper function to get a random message for a specific step
export function getRandomMessage(stepId: string): string {
  const messages = onboardingMessages[stepId];
  if (!messages || messages.length === 0) {
    throw new Error(`No messages found for step: ${stepId}`);
  }
  
  const randomIndex = Math.floor(Math.random() * messages.length);
  return messages[randomIndex];
} 