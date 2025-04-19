import { 
  Connection, 
  PublicKey, 
  Transaction, 
  SystemProgram, 
  TransactionInstruction,
  sendAndConfirmTransaction,
  Keypair
} from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { DAO_PROGRAM_ID, TRANSACTION_TIMEOUT } from '../config/solana';
import * as borsh from 'borsh';

// Use the DAO program ID from the configuration
const DAO_PROGRAM_PUBLIC_KEY = new PublicKey(DAO_PROGRAM_ID);

// Define instruction enum values to match Rust program
const INSTRUCTION_CREATE_PROPOSAL = 0;
const INSTRUCTION_VOTE = 1;
const INSTRUCTION_FINALIZE_PROPOSAL = 2;
const INSTRUCTION_CREATE_DAO = 3;

// Define instruction classes for Borsh serialization
class CreateProposalArgs {
  title: string;
  description: string;
  voting_period: bigint;

  constructor(args: { title: string, description: string, voting_period: bigint }) {
    this.title = args.title;
    this.description = args.description;
    this.voting_period = args.voting_period;
  }
}

class VoteArgs {
  approve: boolean;

  constructor(args: { approve: boolean }) {
    this.approve = args.approve;
  }
}

class FinalizeProposalArgs {
  constructor() {}
}

// New class for DAO creation arguments
class CreateDaoArgs {
  name: string;
  description: string;
  discord_server: string;
  twitter: string;
  website: string;
  telegram: string;
  instagram: string;
  tiktok: string;

  constructor(args: {
    name: string;
    description: string;
    discord_server?: string;
    twitter?: string;
    website?: string;
    telegram?: string;
    instagram?: string;
    tiktok?: string;
  }) {
    this.name = args.name;
    this.description = args.description;
    this.discord_server = args.discord_server || '';
    this.twitter = args.twitter || '';
    this.website = args.website || '';
    this.telegram = args.telegram || '';
    this.instagram = args.instagram || '';
    this.tiktok = args.tiktok || '';
  }
}

// Define the serialization schemas correctly for Borsh
const createProposalSchema = {
  struct: {
    title: 'string',
    description: 'string',
    voting_period: 'u64',
  }
};

const voteSchema = {
  struct: {
    approve: 'bool',
  }
};

const finalizeProposalSchema = {
  struct: {}
};

// Schema for DAO creation
const createDaoSchema = {
  struct: {
    name: 'string',
    description: 'string',
    discord_server: 'string',
    twitter: 'string',
    website: 'string',
    telegram: 'string',
    instagram: 'string',
    tiktok: 'string',
  }
};

/**
 * Serializes instruction data for a Solana program
 * @param schema Borsh schema
 * @param instruction Instruction enum value
 * @param args Arguments to serialize
 * @returns Buffer containing instruction data
 */
function serializeInstructionData(schema: any, instruction: number, args: any): Buffer {
  try {
    // Create a buffer for the instruction tag (first byte)
    const instructionBuffer = Buffer.alloc(1);
    instructionBuffer.writeUInt8(instruction, 0);
    
    // Serialize the arguments using borsh
    let dataBuffer;
    if (Object.keys(schema.struct).length === 0) {
      // For instructions with no arguments (like FinalizeProposal)
      dataBuffer = Buffer.alloc(0);
    } else {
      // Use borsh to serialize the arguments with the schema
      dataBuffer = Buffer.from(borsh.serialize(schema, args));
    }
    
    // Combine the instruction tag and serialized arguments
    return Buffer.concat([instructionBuffer, dataBuffer]);
  } catch (error) {
    console.error('Error serializing instruction data:', error);
    throw error;
  }
}

/**
 * Creates a proposal creation transaction
 * @param connection Solana connection
 * @param wallet User's wallet
 * @param daoId DAO identifier (not a PublicKey)
 * @param proposalData Proposal data (title, description, etc.)
 * @returns Transaction for creating a proposal
 */
export const createProposalTransaction = async (
  connection: Connection,
  walletPubkey: PublicKey,
  daoId: string,
  proposalData: {
    title: string;
    description: string;
    startTime: Date;
    endTime: Date;
    actions?: any[];
  }
) => {
  try {
    // Create a new account for the proposal
    const proposalAccount = Keypair.generate();
    
    // Calculate voting period in seconds
    const votingPeriodSeconds = BigInt(
      Math.floor((proposalData.endTime.getTime() - proposalData.startTime.getTime()) / 1000)
    );
    
    // Create proposal arguments that matches the Rust program's expectation
    const args = {
      title: proposalData.title,
      description: proposalData.description,
      voting_period: votingPeriodSeconds,
    };
    
    // Serialize the instruction data using our schema and tag
    const data = serializeInstructionData(
      createProposalSchema, 
      INSTRUCTION_CREATE_PROPOSAL, 
      args
    );
    
    // Calculate size needed for the proposal data
    // Title and description as strings + u64 for dates + space for votes and voters
    const proposalSize = 1000; // Allocate enough space for the proposal data
    
    // Get minimum lamports needed for rent exemption
    const lamports = await connection.getMinimumBalanceForRentExemption(proposalSize);
    
    // Create the instruction to create the new account
    const createAccountInstruction = SystemProgram.createAccount({
      fromPubkey: walletPubkey,
      newAccountPubkey: proposalAccount.publicKey,
      lamports,
      space: proposalSize,
      programId: DAO_PROGRAM_PUBLIC_KEY,
    });
    
    // Create the instruction to initialize the proposal
    const createProposalInstruction = new TransactionInstruction({
      keys: [
        { pubkey: walletPubkey, isSigner: true, isWritable: true }, // User wallet
        { pubkey: proposalAccount.publicKey, isSigner: true, isWritable: true }, // New proposal account (signer because it's new)
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }, // System program
      ],
      programId: DAO_PROGRAM_PUBLIC_KEY,
      data
    });
    
    // Create a transaction with both instructions
    const transaction = new Transaction();
    transaction.add(createAccountInstruction);
    transaction.add(createProposalInstruction);
    
    // Get the latest blockhash
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = walletPubkey;
    
    // Sign with the proposal account
    transaction.partialSign(proposalAccount);
    
    console.log('Transaction created with instructions:', transaction.instructions.length);
    
    return {
      transaction,
      proposalAccount,
    };
  } catch (error) {
    console.error('Error creating proposal transaction:', error);
    throw error;
  }
};

/**
 * Creates a vote transaction for a proposal
 * @param connection Solana connection
 * @param wallet User's wallet
 * @param daoId DAO identifier (not a PublicKey)
 * @param proposalId Proposal identifier (not a PublicKey)
 * @param vote Vote choice ('for', 'against', 'abstain')
 * @returns Transaction for voting on a proposal
 */
export const createVoteTransaction = async (
  connection: Connection,
  walletPubkey: PublicKey,
  daoId: string,
  proposalId: string,
  vote: 'for' | 'against' | 'abstain'
) => {
  try {
    // Create a new account for the vote record
    const voteAccount = Keypair.generate();
    
    // Convert vote choice to boolean (true for 'for', false for 'against')
    // For now, treat 'abstain' as 'against'
    const approve = vote === 'for';
    
    // Create vote args that match the Borsh schema
    const voteArgs = {
      approve: approve
    };
    
    // Serialize the vote data with Borsh
    const data = serializeInstructionData(
      voteSchema,
      INSTRUCTION_VOTE,
      voteArgs
    );
    
    // Calculate the size needed for the vote data
    const voteSize = 32 + 1 + 8; // PublicKey + bool + padding
    
    // Minimum lamports needed for rent exemption
    const lamports = await connection.getMinimumBalanceForRentExemption(voteSize);
    
    // Create a transaction with two instructions:
    // 1. Create vote account instruction
    const createAccountInstruction = SystemProgram.createAccount({
      fromPubkey: walletPubkey,
      newAccountPubkey: voteAccount.publicKey,
      lamports,
      space: voteSize,
      programId: DAO_PROGRAM_PUBLIC_KEY,
    });
    
    // 2. Vote instruction
    const voteInstruction = new TransactionInstruction({
      keys: [
        { pubkey: walletPubkey, isSigner: true, isWritable: true }, // Voter
        { pubkey: voteAccount.publicKey, isSigner: true, isWritable: true }, // Vote record account
      ],
      programId: DAO_PROGRAM_PUBLIC_KEY,
      data,
    });
    
    // Create a new transaction and add both instructions
    const transaction = new Transaction()
      .add(createAccountInstruction)
      .add(voteInstruction);
    
    // Get the latest blockhash
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = walletPubkey;
    
    // Partial sign with the vote account
    transaction.partialSign(voteAccount);
    
    return { 
      transaction,
      voteAccount 
    };
  } catch (error) {
    console.error('Error creating vote transaction:', error);
    throw error;
  }
};

/**
 * Creates a transaction for creating a new DAO
 * @param connection Solana connection
 * @param walletPubkey User's wallet public key
 * @param daoData DAO information
 * @returns Transaction for creating a DAO
 */
export const createDaoTransaction = async (
  connection: Connection,
  walletPubkey: PublicKey,
  daoData: {
    name: string;
    description: string;
    discord_server?: string;
    twitter?: string;
    website?: string;
    telegram?: string;
    instagram?: string;
    tiktok?: string;
    profile_picture?: string;
    admins?: PublicKey[];
  }
) => {
  try {
    console.log('Creating DAO account on Solana with program ID:', DAO_PROGRAM_ID);
    
    // Create a new account for the DAO
    const daoAccount = Keypair.generate();
    
    // Calculate size needed for the DAO data
    const daoSize = 128; // Small size just for proof of concept
    
    // Get minimum lamports needed for rent exemption
    const lamports = await connection.getMinimumBalanceForRentExemption(daoSize);
    
    // Create account instruction that transfers ownership to the program
    // This simply creates an account owned by the DAO program without calling any program instructions
    const createAccountInstruction = SystemProgram.createAccount({
      fromPubkey: walletPubkey,
      newAccountPubkey: daoAccount.publicKey,
      lamports,
      space: daoSize,
      programId: DAO_PROGRAM_PUBLIC_KEY,
    });
    
    // Create transaction with just the account creation
    const transaction = new Transaction();
    transaction.add(createAccountInstruction);
    
    // Get the latest blockhash
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = walletPubkey;
    
    // Sign with the DAO account
    transaction.partialSign(daoAccount);
    
    console.log('DAO account created with address:', daoAccount.publicKey.toString());
    
    return {
      transaction,
      daoAccount,
    };
  } catch (error) {
    console.error('Error creating DAO transaction:', error);
    throw error;
  }
};

/**
 * Sends a transaction using the wallet adapter
 * @param wallet User's wallet from wallet adapter
 * @param connection Solana connection
 * @param transaction Transaction to send
 * @returns Transaction signature
 */
export const signAndSendTransaction = async (
  wallet: any, // This should be properly typed with WalletContextState
  connection: Connection,
  transaction: Transaction
) => {
  try {
    if (!wallet.signTransaction) {
      throw new Error('Wallet does not support signing transactions');
    }
    
    // Sign the transaction
    const signedTransaction = await wallet.signTransaction(transaction);
    
    // Send the signed transaction to the network
    const signature = await connection.sendRawTransaction(signedTransaction.serialize());
    
    // Wait for confirmation with a timeout
    const confirmation = await Promise.race([
      connection.confirmTransaction(signature, 'confirmed'),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Transaction confirmation timeout')), TRANSACTION_TIMEOUT)
      )
    ]);
    
    if ((confirmation as any).value?.err) {
      throw new Error(`Transaction failed: ${(confirmation as any).value.err.toString()}`);
    }
    
    return signature;
  } catch (error) {
    console.error('Error sending transaction:', error);
    throw error;
  }
}; 