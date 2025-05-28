import { 
  Connection, 
  Keypair, 
  PublicKey, 
  SystemProgram, 
  Transaction, 
  TransactionInstruction 
} from '@solana/web3.js';
import BN from 'bn.js';
import { DAO_PROGRAM_ID, TRANSACTION_TIMEOUT, TREASURY_ADDRESS } from '../config/solana';

// Program ID from config
const PROGRAM_ID = new PublicKey(DAO_PROGRAM_ID);

// Fee recipient address - should be configurable in a real app
const FEE_ADDRESS = new PublicKey(TREASURY_ADDRESS);

// Helper function for string serialization
function serializeString(str: string): Buffer {
  const buf = Buffer.alloc(4 + str.length);
  buf.writeUInt32LE(str.length, 0);
  buf.write(str, 4);
  return buf;
}

// Serialize DAO creation instruction data
export function serializeCreateDaoInstruction(
  name: string, 
  description: string, 
  discordServer: string, 
  twitter: string, 
  telegram: string, 
  instagram: string, 
  tiktok: string, 
  website: string, 
  treasury: string, 
  profile: string,
  tokenAddress: string,
  solPriceUsd: number
): Buffer {
  // Instruction index (0 for CreateDao)
  const instructionBuf = Buffer.alloc(1);
  instructionBuf.writeUInt8(0, 0);
  
  // Serialize all strings
  const nameBuf = serializeString(name);
  const descriptionBuf = serializeString(description);
  const discordServerBuf = serializeString(discordServer);
  const twitterBuf = serializeString(twitter);
  const telegramBuf = serializeString(telegram);
  const instagramBuf = serializeString(instagram);
  const tiktokBuf = serializeString(tiktok);
  const websiteBuf = serializeString(website);
  const treasuryBuf = serializeString(treasury);
  const profileBuf = serializeString(profile);
  const tokenAddressBuf = serializeString(tokenAddress);
  
  // Serialize u64 sol price (8 bytes, little-endian)
  const solPriceBuf = Buffer.alloc(8);
  
  // Convert to u64 (BN)
  const solPriceBN = new BN(solPriceUsd.toString());
  solPriceBN.toArray('le', 8).forEach((byte: number, index: number) => {
    solPriceBuf[index] = byte;
  });
  
  // Concat all buffers
  return Buffer.concat([
    instructionBuf,
    nameBuf,
    descriptionBuf,
    discordServerBuf,
    twitterBuf,
    telegramBuf,
    instagramBuf,
    tiktokBuf,
    websiteBuf,
    treasuryBuf,
    profileBuf,
    tokenAddressBuf,
    solPriceBuf
  ]);
}

// Serialize proposal creation instruction data
export function serializeCreateProposalInstruction(
  name: string,
  description: string,
  daoId: string,
  podId: string,
  startTime: number,
  endTime: number
): Buffer {
  // Instruction index (1 for CreateProposal)
  const instructionBuf = Buffer.alloc(1);
  instructionBuf.writeUInt8(1, 0);
  
  // Serialize all strings
  const nameBuf = serializeString(name);
  const descriptionBuf = serializeString(description);
  const daoIdBuf = serializeString(daoId);
  const podIdBuf = serializeString(podId);
  
  // Serialize i64 timestamps (8 bytes each, little-endian)
  const startTimeBuf = Buffer.alloc(8);
  const endTimeBuf = Buffer.alloc(8);
  
  const startTimeBN = new BN(startTime.toString());
  const endTimeBN = new BN(endTime.toString());
  
  startTimeBN.toArray('le', 8).forEach((byte: number, index: number) => {
    startTimeBuf[index] = byte;
  });
  
  endTimeBN.toArray('le', 8).forEach((byte: number, index: number) => {
    endTimeBuf[index] = byte;
  });
  
  // Concat all buffers
  return Buffer.concat([
    instructionBuf,
    nameBuf,
    descriptionBuf,
    daoIdBuf,
    podIdBuf,
    startTimeBuf,
    endTimeBuf
  ]);
}

// Serialize vote instruction data
export function serializeVoteInstruction(
  voteValue: string,
  proposalId: string
): Buffer {
  // Instruction index (2 for Vote)
  const instructionBuf = Buffer.alloc(1);
  instructionBuf.writeUInt8(2, 0);
  
  // Serialize strings
  const voteBuf = serializeString(voteValue);
  const proposalIdBuf = serializeString(proposalId);
  
  // Concat all buffers
  return Buffer.concat([
    instructionBuf,
    voteBuf,
    proposalIdBuf
  ]);
}

// Fetch current SOL price from an API
export async function getSolPrice(): Promise<number> {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
    const data = await response.json();
    const solPriceUsd = data.solana.usd;
    
    // Convert to cents and return as integer (e.g., $100.50 => 10050)
    return Math.round(solPriceUsd * 100);
  } catch (error) {
    console.error('Error fetching SOL price:', error);
    throw new Error('Failed to fetch SOL price. Please try again.');
  }
}

// Create a new DAO transaction
export async function createDaoTransaction(
  connection: Connection,
  wallet: { publicKey: PublicKey },
  name: string,
  description: string,
  discordServer: string = '',
  twitter: string = '',
  telegram: string = '',
  instagram: string = '',
  tiktok: string = '',
  website: string = '',
  treasury: string = '',
  profile: string = '',
  tokenAddress: string = '',
  solPriceUsd?: number // Optional - will fetch current price if not provided
): Promise<{ transaction: Transaction, daoAccount: Keypair }> {
  if (!wallet.publicKey) throw new Error("Wallet not connected");
  
  // Get current SOL price if not provided
  if (!solPriceUsd) {
    solPriceUsd = await getSolPrice();
  }
  
  // Generate a new keypair for the DAO
  const daoAccount = Keypair.generate();
  
  // Serialize instruction data
  const data = serializeCreateDaoInstruction(
    name,
    description,
    discordServer,
    twitter,
    telegram,
    instagram,
    tiktok,
    website,
    treasury,
    profile,
    tokenAddress,
    solPriceUsd
  );
  
  // Create instruction
  const instruction = new TransactionInstruction({
    keys: [
      { pubkey: wallet.publicKey, isSigner: true, isWritable: true },
      { pubkey: daoAccount.publicKey, isSigner: true, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      { pubkey: FEE_ADDRESS, isSigner: false, isWritable: true },
    ],
    programId: PROGRAM_ID,
    data,
  });
  
  // Create transaction
  const transaction = new Transaction().add(instruction);
  
  // Set recent blockhash
  transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
  transaction.feePayer = wallet.publicKey;
  
  // Partially sign with the DAO account
  transaction.partialSign(daoAccount);
  
  return { transaction, daoAccount };
}

// Create a new proposal transaction
export async function createProposalTransaction(
  connection: Connection,
  wallet: { publicKey: PublicKey },
  name: string,
  description: string,
  daoId: string,
  podId: string = '', // Making this optional with default empty string
  startTime: number,
  endTime: number
): Promise<{ transaction: Transaction, proposalAccount: Keypair }> {
  if (!wallet.publicKey) throw new Error("Wallet not connected");
  
  // Generate a new keypair for the proposal
  const proposalAccount = Keypair.generate();
  
  // Serialize instruction data
  const data = serializeCreateProposalInstruction(
    name,
    description,
    daoId,
    podId,
    startTime,
    endTime
  );
  
  // Create instruction
  const instruction = new TransactionInstruction({
    keys: [
      { pubkey: wallet.publicKey, isSigner: true, isWritable: true },
      { pubkey: proposalAccount.publicKey, isSigner: true, isWritable: true },
      { pubkey: new PublicKey(daoId), isSigner: false, isWritable: false },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      { pubkey: FEE_ADDRESS, isSigner: false, isWritable: true },
    ],
    programId: PROGRAM_ID,
    data,
  });
  
  // Create transaction
  const transaction = new Transaction().add(instruction);
  
  // Set recent blockhash
  transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
  transaction.feePayer = wallet.publicKey;
  
  // Partially sign with the proposal account
  transaction.partialSign(proposalAccount);
  
  return { transaction, proposalAccount };
}

// Create a vote transaction
export async function createVoteTransaction(
  connection: Connection,
  wallet: { publicKey: PublicKey },
  voteValue: string, // 'for' or 'against'
  proposalId: string
): Promise<{ transaction: Transaction, voteAccount: Keypair }> {
  if (!wallet.publicKey) throw new Error("Wallet not connected");
  
  // Generate a new keypair for the vote
  const voteAccount = Keypair.generate();
  
  // Serialize instruction data
  const data = serializeVoteInstruction(
    voteValue,
    proposalId
  );
  
  // Create instruction
  const instruction = new TransactionInstruction({
    keys: [
      { pubkey: wallet.publicKey, isSigner: true, isWritable: true },
      { pubkey: voteAccount.publicKey, isSigner: true, isWritable: true },
      { pubkey: new PublicKey(proposalId), isSigner: false, isWritable: false },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      { pubkey: FEE_ADDRESS, isSigner: false, isWritable: true },
    ],
    programId: PROGRAM_ID,
    data,
  });
  
  // Create transaction
  const transaction = new Transaction().add(instruction);
  
  // Set recent blockhash
  transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
  transaction.feePayer = wallet.publicKey;
  
  // Partially sign with the vote account
  transaction.partialSign(voteAccount);
  
  return { transaction, voteAccount };
}

// Serialize featured instruction data
export function serializeFeaturedInstruction(
  daoId: string,
  solPriceUsd: number
): Buffer {
  // Instruction index (3 for Featured)
  const instructionBuf = Buffer.alloc(1);
  instructionBuf.writeUInt8(3, 0);
  
  // Serialize string
  const daoIdBuf = serializeString(daoId);
  
  // Serialize u64 sol price (8 bytes, little-endian)
  const solPriceBuf = Buffer.alloc(8);
  
  // Convert to u64 (BN)
  const solPriceBN = new BN(solPriceUsd.toString());
  solPriceBN.toArray('le', 8).forEach((byte: number, index: number) => {
    solPriceBuf[index] = byte;
  });
  
  // Concat all buffers
  return Buffer.concat([
    instructionBuf,
    daoIdBuf,
    solPriceBuf
  ]);
}

// Serialize modules instruction data
export function serializeModulesInstruction(
  daoId: string,
  moduleType: string,
  solPriceUsd: number
): Buffer {
  // Instruction index (4 for Module)
  const instructionBuf = Buffer.alloc(1);
  instructionBuf.writeUInt8(4, 0);
  
  // Serialize strings
  const daoIdBuf = serializeString(daoId);
  const moduleTypeBuf = serializeString(moduleType);
  
  // Serialize u64 sol price (8 bytes, little-endian)
  const solPriceBuf = Buffer.alloc(8);
  
  // Convert to u64 (BN)
  const solPriceBN = new BN(solPriceUsd.toString());
  solPriceBN.toArray('le', 8).forEach((byte: number, index: number) => {
    solPriceBuf[index] = byte;
  });
  
  // Concat all buffers
  return Buffer.concat([
    instructionBuf,
    daoIdBuf,
    moduleTypeBuf,
    solPriceBuf
  ]);
}

// Create a featured transaction
export async function createFeaturedTransaction(
  connection: Connection,
  wallet: { publicKey: PublicKey },
  daoId: string,
  solPriceUsd?: number // Optional - will fetch current price if not provided
): Promise<{ transaction: Transaction, featuredAccount: Keypair }> {
  if (!wallet.publicKey) throw new Error("Wallet not connected");
  
  // Get current SOL price if not provided
  if (!solPriceUsd) {
    solPriceUsd = await getSolPrice();
  }
  
  // Generate a new keypair for the featured entry
  const featuredAccount = Keypair.generate();
  
  // Get the DAO's public key
  try {
    // You might need to import the daosService here
    const daosService = new (await import('../services/DaosService')).DaosService();
    const daoDetails = await daosService.getDaoById(daoId);
    
    if (!daoDetails || !daoDetails.pubkey) {
      throw new Error("DAO public key not found");
    }
    
    const daoPubkey = new PublicKey(daoDetails.pubkey);
    
    // Serialize instruction data
    const data = serializeFeaturedInstruction(
      daoId,
      solPriceUsd
    );
    
    // Create instruction
    const instruction = new TransactionInstruction({
      keys: [
        { pubkey: wallet.publicKey, isSigner: true, isWritable: true },
        { pubkey: featuredAccount.publicKey, isSigner: true, isWritable: true },
        { pubkey: daoPubkey, isSigner: false, isWritable: false },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
        { pubkey: FEE_ADDRESS, isSigner: false, isWritable: true },
      ],
      programId: PROGRAM_ID,
      data,
    });
    
    // Create transaction
    const transaction = new Transaction().add(instruction);
    
    // Set recent blockhash
    transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    transaction.feePayer = wallet.publicKey;
    
    // Partially sign with the featured account
    transaction.partialSign(featuredAccount);
    
    return { transaction, featuredAccount };
  } catch (error) {
    console.error("Error creating featured transaction:", error);
    throw error;
  }
}

// Create a module activation transaction
export async function createModuleTransaction(
  connection: Connection,
  wallet: { publicKey: PublicKey },
  daoId: string,
  moduleType: string, // "PODS" or "Proof Of Love"
  solPriceUsd?: number // Optional - will fetch current price if not provided
): Promise<{ transaction: Transaction, moduleAccount: Keypair }> {
  if (!wallet.publicKey) throw new Error("Wallet not connected");
  
  // Validate module type
  if (moduleType !== "PODS" && moduleType !== "PROOF_OF_LOVE") {
    throw new Error('Invalid module type. Must be either "PODS" or "Proof Of Love".');
  }
  
  // Get current SOL price if not provided
  if (!solPriceUsd) {
    solPriceUsd = await getSolPrice();
  }
  
  // Generate a new keypair for the module
  const moduleAccount = Keypair.generate();
  
  // Get the DAO's public key
  try {
    // You might need to import the daosService here
    const daosService = new (await import('../services/DaosService')).DaosService();
    const daoDetails = await daosService.getDaoById(daoId);
    
    if (!daoDetails || !daoDetails.pubkey) {
      throw new Error("DAO public key not found");
    }
    
    const daoPubkey = new PublicKey(daoDetails.pubkey);
    
    // Serialize instruction data
    const data = serializeModulesInstruction(
      daoId,
      moduleType,
      solPriceUsd
    );
    
    // Create instruction
    const instruction = new TransactionInstruction({
      keys: [
        { pubkey: wallet.publicKey, isSigner: true, isWritable: true },
        { pubkey: moduleAccount.publicKey, isSigner: true, isWritable: true },
        { pubkey: daoPubkey, isSigner: false, isWritable: false },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
        { pubkey: FEE_ADDRESS, isSigner: false, isWritable: true },
      ],
      programId: PROGRAM_ID,
      data,
    });
    
    // Create transaction
    const transaction = new Transaction().add(instruction);
    
    // Set recent blockhash
    transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    transaction.feePayer = wallet.publicKey;
    
    // Partially sign with the module account
    transaction.partialSign(moduleAccount);
    
    return { transaction, moduleAccount };
  } catch (error) {
    console.error("Error creating module transaction:", error);
    throw error;
  }
}

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
): Promise<string> => {
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
    
    // Wait 10 seconds for the transaction to be indexed by APIs
    console.log('Transaction confirmed, waiting 30 seconds for indexing...');
    await new Promise(resolve => setTimeout(resolve, 30000));
    
    return signature;
  } catch (error) {
    console.error('Error sending transaction:', error);
    throw error;
  }
};