export interface GovernanceModelType {
  id: number;
  name: string;
  description: string;
}

// These match the Python enum values
export const GOVERNANCE_MODELS: GovernanceModelType[] = [
  {
    id: 1,
    name: "Enlightened Dictatorship",
    description: "Single leader making decisions"
  },
  {
    id: 2,
    name: "Assisted Dictatorship",
    description: "Leader with advisors"
  },
  {
    id: 3,
    name: "Hybrid Enterprise",
    description: "Mixed leadership with token holders"
  },
  {
    id: 4,
    name: "Listed Company",
    description: "Traditional company structure" 
  },
  {
    id: 5,
    name: "Social Enterprise",
    description: "Mission-driven organization"
  },
  {
    id: 6,
    name: "Association",
    description: "Member-based organization"
  },
  {
    id: 7,
    name: "Semi-decentralized Organization",
    description: "Partial decentralization"
  },
  {
    id: 8,
    name: "Decentralized Pure",
    description: "Fully decentralized governance"
  }
];

export const getGovernanceModelById = (id: number): GovernanceModelType | undefined => {
  return GOVERNANCE_MODELS.find(model => model.id === id);
};

export const getGovernanceModelByName = (name: string): GovernanceModelType | undefined => {
  return GOVERNANCE_MODELS.find(model => model.name === name);
};

// Voting power systems - matching the Python enum
export enum VotingPowerSystem {
  DEFINED = "Defined",
  TOKEN = "Token",
  ONE_ONE = "OneOne",
  QUADRATIC = "Quadratic"
}

// Entry conditions - matching the Python enum
export enum EntryCondition {
  ELECTION = "Election",
  TOKEN = "Token",
  CLOSED = "Closed",
  OPEN = "Open",
  CANDIDATURE = "Candidature"
} 