/**
 * Proposal Service
 * Handles all API interactions related to Proposals
 */

import { createConfiguration, DaosApi, InputCreateProposal, ProposalsApi, Proposal as ApiProposal, ProposalVote, ProposalVoteVoteEnum } from '../core/modules/dao-api';
import { ServerConfiguration } from '../core/modules/dao-api/servers';
import { walletAuthService } from './WalletAuthService';
import { Connection, PublicKey, Transaction, Keypair } from '@solana/web3.js';
import { createProposalTransaction, createVoteTransaction } from '../utils/solanaTransactions';
import { daosService } from './DaosService';

// Default API endpoint - using the proxy URL
const DEFAULT_API_ENDPOINT = '/api';

// Export the SDK's Proposal type for use throughout the app
export type Proposal = ApiProposal;

interface VoteResult {
  forVotes: number;
  againstVotes: number;
}

/**
 * ProposalService handles proposal data operations
 */
export class ProposalService {
  private apiEndpoint: string;
  private proposalsApi: ProposalsApi;
  private daosApi: DaosApi;
  private connection: Connection | null = null;

  constructor(apiEndpoint: string = DEFAULT_API_ENDPOINT) {
    this.apiEndpoint = apiEndpoint;
    
    // Create configuration for the API with custom base URL
    const serverConfig = new ServerConfiguration(this.apiEndpoint, {});
    const configuration = createConfiguration({
      baseServer: serverConfig
    });
    
    // Initialize API clients
    this.proposalsApi = new ProposalsApi(configuration);
    this.daosApi = new DaosApi(configuration);
  }

  /**
   * Initialize Solana connection
   * @param endpoint Solana cluster endpoint
   */
  initializeSolanaConnection(endpoint: string): void {
    this.connection = new Connection(endpoint);
  }

  /**
   * Create an authenticated API client with the current token
   * @private
   */
  private createAuthenticatedApiClient(): { proposalsApi: ProposalsApi, daosApi: DaosApi } | null {
    const token = walletAuthService.getAccessToken();
    if (!token) {
      console.error('No authentication token available');
      return null;
    }

    // Create a custom configuration with the current token
    const serverConfig = new ServerConfiguration(this.apiEndpoint, {});
    const configuration = createConfiguration({
      baseServer: serverConfig,
      authMethods: {
        default: {
          getName: () => 'Bearer',
          applySecurityAuthentication: (context: any) => {
            context.setHeaderParam('Authorization', `Bearer ${token}`);
          }
        }
      }
    });

    // Return new API client instances with the token
    return {
      proposalsApi: new ProposalsApi(configuration),
      daosApi: new DaosApi(configuration)
    };
  }

  /**
   * Set the API endpoint and reinitialize API clients
   */
  setApiEndpoint(endpoint: string): void {
    this.apiEndpoint = endpoint;
    
    // Create new configuration with updated endpoint
    const serverConfig = new ServerConfiguration(this.apiEndpoint, {});
    const configuration = createConfiguration({
      baseServer: serverConfig
    });
    
    // Reinitialize API clients
    this.proposalsApi = new ProposalsApi(configuration);
    this.daosApi = new DaosApi(configuration);
  }

  /**
   * Get all proposals for a DAO
   */
  async getAllProposals(daoId: string): Promise<ApiProposal[]> {
    try {
      const apiClient = this.createAuthenticatedApiClient();
      if (!apiClient) return [];

      // Use the SDK to get all proposals for the DAO
      const response = await apiClient.proposalsApi.getProposalsByDAO(daoId);
      
      return response || [];
    } catch (error) {
      console.error(`Error getting proposals for DAO ${daoId}:`, error);
      return [];
    }
  }

  /**
   * Get a proposal by ID
   */
  async getProposalById(daoId: string, proposalId: string): Promise<ApiProposal | null> {
    try {
      const apiClient = this.createAuthenticatedApiClient();
      if (!apiClient) return null;

      // Use the SDK to get a proposal by ID
      const response = await apiClient.proposalsApi.getDAOProposalById(daoId, proposalId);
      
      return response || null;
    } catch (error) {
      console.error(`Error getting proposal ${proposalId} for DAO ${daoId}:`, error);
      return null;
    }
  }

  /**
   * Create a transaction for proposal creation
   * This is the first step of the two-step process - creating a Solana transaction
   */
  async createProposalTransaction(
    daoId: string,
    podId: string,
    walletPublicKey: PublicKey,
    proposalData: {
      title: string;
      description: string;
      startDate: Date;
      endDate: Date;
      actions?: any[];
    }
  ): Promise<{ transaction: Transaction, proposalAccount: Keypair } | null> {
    if (!this.connection) {
      console.error('Solana connection not initialized. Call initializeSolanaConnection first.');
      return null;
    }

    try {
      console.log(`Creating proposal transaction for DAO: ${daoId}`);
      
      // Get the blockchain address for the DAO
      const daoBlockchainAddress = await daosService.getDaoBlockchainAddress(daoId);
      
      if (!daoBlockchainAddress) {
        console.error(`Could not find blockchain address for DAO ${daoId}`);
        return null;
      }
      
      console.log(`Using blockchain address for DAO: ${daoBlockchainAddress}`);
      
      const result = await createProposalTransaction(
        this.connection,
        { publicKey: walletPublicKey },
        proposalData.title,
        proposalData.description,
        daoBlockchainAddress,
        podId,
        proposalData.startDate.getTime(),
        proposalData.endDate.getTime()
      );

      return result;
    } catch (error) {
      console.error('Error creating proposal transaction:', error);
      return null;
    }
  }

  /**
   * Create a new proposal
   * This is the second step - after the transaction is signed and confirmed,
   * we also update our API/database with the proposal details
   */
  async createProposal(
    daoId: string,
    proposalData: {
      title: string;
      description: string;
      startDate?: Date;
      endDate: Date;
      actions?: any[];
      transactionSignature: string;
      proposalAccount: string;
    }
  ): Promise<ApiProposal | null> {
    try {
      const apiClient = this.createAuthenticatedApiClient();
      if (!apiClient) return null;

      // Convert actions to the format expected by the API if needed
      const apiActions = proposalData.actions || [];

      // Create the request object for the API
      const proposalRequest: InputCreateProposal = {
        name: proposalData.title,
        description: proposalData.description,
        startTime: proposalData.startDate || new Date(),
        endTime: proposalData.endDate,
        daoId: daoId,
        actions: apiActions,
        pubkey: proposalData.proposalAccount,
        transaction: proposalData.transactionSignature
      };

      // Use the SDK to create a proposal
      const response = await apiClient.proposalsApi.createProposalForDAO(daoId, proposalRequest);
      
      return response?.proposal || null;
    } catch (error) {
      console.error(`Error creating proposal for DAO ${daoId}:`, error);
      return null;
    }
  }

  /**
   * Get a proposal's blockchain account pubkey
   */
  async getProposalPubkey(daoId: string, proposalId: string): Promise<string | null> {
    try {
      const proposal = await this.getProposalById(daoId, proposalId);
      if (!proposal || !proposal.pubkey) {
        console.error(`No pubkey found for proposal ${proposalId}`);
        return null;
      }
      return proposal.pubkey;
    } catch (error) {
      console.error(`Error getting proposal pubkey for ${proposalId}:`, error);
      return null;
    }
  }

  /**
   * Create a transaction for voting on a proposal
   * This is the first step of the two-step voting process
   */
  async createVoteTransaction(
    daoId: string,
    proposalId: string,
    walletPublicKey: PublicKey,
    vote: 'for' | 'against'
  ): Promise<{ transaction: Transaction, voteAccount: Keypair } | null> {
    if (!this.connection) {
      console.error('Solana connection not initialized. Call initializeSolanaConnection first.');
      return null;
    }

    try {
      console.log(`Creating vote transaction for proposal: ${proposalId} in DAO: ${daoId}`);
      
      // Get the proposal's blockchain account pubkey from the database
      const proposalPubkey = await this.getProposalPubkey(daoId, proposalId);
      if (!proposalPubkey) {
        throw new Error(`Could not find blockchain account for proposal ${proposalId}`);
      }

      console.log(`Using proposal pubkey: ${proposalPubkey}`);
      
      // Use the actual proposal account pubkey from the database
      const result = await createVoteTransaction(
        this.connection,
        { publicKey: walletPublicKey },
        vote, // 'for' or 'against'
        proposalPubkey
      );

      return result;
    } catch (error) {
      console.error('Error creating vote transaction:', error);
      return null;
    }
  }

  /**
   * Vote on a proposal
   * This is the second step - after the transaction is signed and confirmed,
   * we also update our API/database with the vote
   */
  async voteOnProposal(
    daoId: string, 
    proposalId: string, 
    vote: 'for' | 'against',
    transactionSignature: string,
    voteAccount: string
  ): Promise<boolean> {
    try {
      const apiClient = this.createAuthenticatedApiClient();
      if (!apiClient) return false;

      // Map our vote values to what the API expects
      const voteRequestVoteEnum = vote === 'for' 
        ? ProposalVoteVoteEnum.For 
        : ProposalVoteVoteEnum.Against;

      // Create vote request object with the correct enum value
      const voteDataInput: ProposalVote = {
        vote: voteRequestVoteEnum,
        pubkey: voteAccount,
        transaction: transactionSignature,
      }

      // Use the API client to vote on the proposal 
      await apiClient.proposalsApi.voteOnDAOProposal(daoId, proposalId, voteDataInput);
      return true;
    } catch (error) {
      console.error(`Error voting on proposal ${proposalId} for DAO ${daoId}:`, error);
      return false;
    }
  }

  /**
   * Vote on a proposal for a specific POD
   * This calls the specific POD proposal voting endpoint
   */
  async voteOnPODProposal(
    daoId: string, 
    podId: string,
    proposalId: string, 
    vote: 'for' | 'against',
    transactionSignature: string,
    voteAccount: string
  ): Promise<boolean> {
    try {
      const apiClient = this.createAuthenticatedApiClient();
      if (!apiClient) return false;

      // Map our vote values to what the API expects
      const voteRequestVoteEnum = vote === 'for' 
        ? ProposalVoteVoteEnum.For 
        : ProposalVoteVoteEnum.Against;

      // Create vote request object with the correct enum value
      const voteDataInput: ProposalVote = {
        vote: voteRequestVoteEnum,
        pubkey: voteAccount,
        transaction: transactionSignature,
      }

      // Use the API client to vote on the POD proposal 
      await apiClient.proposalsApi.voteOnPODProposal(daoId, podId, proposalId, voteDataInput);
      return true;
    } catch (error) {
      console.error(`Error voting on POD proposal ${proposalId} in POD ${podId}, DAO ${daoId}:`, error);
      return false;
    }
  }

  /**
   * Get votes for a proposal
   */
  async getProposalVotes(daoId: string, proposalId: string): Promise<VoteResult | null> {
    try {
      const apiClient = this.createAuthenticatedApiClient();
      if (!apiClient) return null;
      
      // Use the SDK to get votes
      const proposal = await this.getProposalById(daoId, proposalId);
      
      if (proposal) {
        // Extract vote information directly from the proposal
        return {
          forVotes: proposal.forVotesCount || 0,
          againstVotes: proposal.againstVotesCount || 0,
        };
      }
      
      return null;
    } catch (error) {
      console.error(`Error getting votes for proposal ${proposalId} in DAO ${daoId}:`, error);
      return null;
    }
  }

  /**
   * Create a new proposal for a specific POD
   * This creates a proposal within a specific POD in the DAO
   */
  async createProposalForPOD(
    daoId: string,
    podId: string,
    proposalData: {
      title: string;
      description: string;
      startDate?: Date;
      endDate: Date;
      transactionSignature: string;
      proposalAccount: string;
    }
  ): Promise<ApiProposal | null> {
    try {
      const apiClient = this.createAuthenticatedApiClient();
      if (!apiClient) return null;

      // Create the request object for the API
      const proposalRequest: InputCreateProposal = {
        name: proposalData.title,
        description: proposalData.description,
        startTime: proposalData.startDate || new Date(),
        endTime: proposalData.endDate,
        daoId: daoId,
        podId: podId, // Include the POD ID in the request
        actions: [], // No actions for POD proposals
        pubkey: proposalData.proposalAccount,
        transaction: proposalData.transactionSignature
      };

      // Use the SDK to create a proposal
      const response = await apiClient.proposalsApi.createProposalForDAO(daoId, proposalRequest);
      
      return response?.proposal || null;
    } catch (error) {
      console.error(`Error creating proposal for POD ${podId} in DAO ${daoId}:`, error);
      return null;
    }
  }

  /**
   * Get all proposals for a specific POD in a DAO
   */
  async getProposalsByPOD(daoId: string, podId: string): Promise<ApiProposal[]> {
    try {
      const apiClient = this.createAuthenticatedApiClient();
      if (!apiClient) return [];

      // Use the SDK to get all proposals for the specific POD
      const response = await apiClient.proposalsApi.getProposalsByPOD(daoId, podId);
      
      // Return the proposals array from the response or an empty array if not available
      return response?.proposals || [];
    } catch (error) {
      console.error(`Error getting proposals for POD ${podId} in DAO ${daoId}:`, error);
      return [];
    }
  }

  /**
   * Get a proposal by ID for a specific POD
   */
  async getPodProposalById(daoId: string, podId: string, proposalId: string): Promise<ApiProposal | null> {
    try {
      const apiClient = this.createAuthenticatedApiClient();
      if (!apiClient) return null;

      // Use the SDK to get a proposal by ID from a specific POD
      const response = await apiClient.proposalsApi.getPODProposalById(daoId, podId, proposalId);
      
      return response || null;
    } catch (error) {
      console.error(`Error getting proposal ${proposalId} for POD ${podId} in DAO ${daoId}:`, error);
      return null;
    }
  }
}

// Create a singleton instance
export const proposalService = new ProposalService();

// Export default for convenience
export default proposalService; 