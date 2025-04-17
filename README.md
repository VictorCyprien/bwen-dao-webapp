# DAO Web Application

A decentralized autonomous organization (DAO) web application built with React and Solana blockchain.

[Edit in StackBlitz next generation editor ⚡️](https://stackblitz.com/~/github.com/Ojajajajaja/dao-webapp)

## Architecture Overview

This application consists of two main components:
1. **Frontend**: React application with TypeScript
2. **Blockchain**: Solana program (smart contract) written in Rust

## Blockchain Transaction Implementation Guide

### General Transaction Flow

All blockchain transactions in this application follow a similar pattern:

1. **Client-side Preparation**:
   - Create transaction object
   - Add necessary instructions
   - Set fee payer and signers

2. **User Approval**:
   - Present transaction to user via wallet adapter
   - User reviews and approves transaction

3. **Blockchain Execution**:
   - Send transaction to Solana network
   - Wait for confirmation
   - Handle success/error response

4. **API Update** (optional):
   - Update backend database with transaction results

### Transaction Implementation Examples

#### Creating a Proposal

To create a proposal, we need to:

1. **Create a new account** for storing proposal data
2. **Initialize** this account with proposal information
3. **Submit the transaction** to the blockchain

```typescript
// src/utils/solanaTransactions.ts
export async function createProposalTransaction(
  daoId: string,
  payer: PublicKey,
  proposalData: ProposalData
): Promise<TransactionWithAccount<Keypair> | null> {
  try {
    // Generate a new keypair for the proposal account
    const proposalAccount = Keypair.generate();
    
    // Calculate space needed for the proposal data
    const dataSize = 1000; // Space for proposal data
    
    // Get minimum rent exemption amount
    const rentExemption = await connection.getMinimumBalanceForRentExemption(dataSize);
    
    // Create transaction
    const transaction = new Transaction();
    
    // Add instruction to create new account
    transaction.add(
      SystemProgram.createAccount({
        fromPubkey: payer,
        newAccountPubkey: proposalAccount.publicKey,
        lamports: rentExemption,
        space: dataSize,
        programId: PROGRAM_ID
      })
    );
    
    // Serialize proposal data
    const data = Buffer.from(serializeProposal(daoId, proposalData));
    
    // Add instruction to initialize proposal
    transaction.add(
      new TransactionInstruction({
        keys: [
          { pubkey: payer, isSigner: true, isWritable: true },
          { pubkey: proposalAccount.publicKey, isSigner: true, isWritable: true },
        ],
        programId: PROGRAM_ID,
        data: data
      })
    );
    
    return { transaction, proposalAccount };
  } catch (error) {
    console.error('Error creating proposal transaction:', error);
    return null;
  }
}
```

#### Voting on a Proposal

To vote on a proposal, we need to:

1. **Create a new account** for storing vote data
2. **Initialize** this account with vote information
3. **Submit the transaction** to the blockchain

```typescript
// src/utils/solanaTransactions.ts
export async function createVoteTransaction(
  daoId: string,
  proposalId: string,
  voter: PublicKey,
  vote: 'for' | 'against' | 'abstain'
): Promise<TransactionWithAccount<Keypair> | null> {
  try {
    // Generate a new keypair for the vote account
    const voteAccount = Keypair.generate();
    
    // Calculate space needed for vote data
    const dataSize = 33; // 32 bytes for voter pubkey + 1 byte for vote value
    
    // Get minimum rent exemption amount
    const rentExemption = await connection.getMinimumBalanceForRentExemption(dataSize);
    
    // Create transaction
    const transaction = new Transaction();
    
    // Add instruction to create new account
    transaction.add(
      SystemProgram.createAccount({
        fromPubkey: voter,
        newAccountPubkey: voteAccount.publicKey,
        lamports: rentExemption,
        space: dataSize,
        programId: PROGRAM_ID
      })
    );
    
    // Serialize vote data (simple encoding for illustration)
    const voteValue = vote === 'for' ? 1 : (vote === 'against' ? 0 : 2);
    const data = Buffer.from([
      ...Buffer.from("vote"), // Instruction identifier
      voteValue // Vote value (1 byte)
    ]);
    
    // Add instruction to record vote
    transaction.add(
      new TransactionInstruction({
        keys: [
          { pubkey: voter, isSigner: true, isWritable: true },
          { pubkey: voteAccount.publicKey, isSigner: true, isWritable: true },
        ],
        programId: PROGRAM_ID,
        data: data
      })
    );
    
    return { transaction, voteAccount };
  } catch (error) {
    console.error('Error creating vote transaction:', error);
    return null;
  }
}
```

### Frontend Integration

In the React components, we use the transaction creation functions:

```typescript
// Component example (simplified)
const handleVoteTransaction = async (proposalId: string, vote: 'for' | 'against' | 'abstain') => {
  try {
    // Create the vote transaction
    const result = await proposalService.createVoteTransaction(
      daoId,
      proposalId,
      publicKey,
      vote
    );

    if (!result) {
      throw new Error('Failed to create vote transaction');
    }
    
    // Extract transaction and vote account
    const { transaction, voteAccount } = result;
    
    // Send the transaction
    const signature = await wallet.sendTransaction(transaction, connection);
    
    // Wait for confirmation
    const confirmation = await connection.confirmTransaction(signature, 'confirmed');
    
    if (confirmation.value.err) {
      throw new Error(`Transaction failed: ${confirmation.value.err.toString()}`);
    }
    
    // Update API if needed
    await proposalService.voteOnProposal(daoId, proposalId, vote, signature);
    
    // Refresh UI
    fetchProposals();
  } catch (error) {
    console.error("Error voting on proposal:", error);
    alert(`Failed to vote: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
```

## Solana Program (Smart Contract) Implementation

The Rust program handles these instructions on the blockchain side:

```rust
// solana-dao-program/src/processor.rs (simplified example)
fn process_vote(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    approve: bool,
) -> ProgramResult {
    // Get accounts
    let voter_info = next_account_info(account_info_iter)?;
    let vote_account_info = next_account_info(account_info_iter)?;
    
    // Verify signers and ownership
    if !voter_info.is_signer || !vote_account_info.is_signer {
        return Err(DaoError::ExpectedSigner.into());
    }
    
    if vote_account_info.owner != program_id {
        return Err(ProgramError::IncorrectProgramId);
    }
    
    // Store vote data
    let mut data = vote_account_info.data.borrow_mut();
    data[0..32].copy_from_slice(&voter_info.key.to_bytes());
    data[32] = if approve { 1 } else { 0 };
    
    Ok(())
}
```

## Key Components

1. **solanaTransactions.ts**: Utility functions to create transactions
2. **ProposalService.ts**: Service that handles both blockchain and API interactions
3. **Governance.tsx**: React component that provides the user interface
4. **processor.rs**: Solana program that processes the transaction instructions

## Development Workflow

1. **Define Instruction**: Update instruction.rs to define new instruction type
2. **Implement Processor**: Update processor.rs to handle new instruction
3. **Create Transaction**: Add function in solanaTransactions.ts to create transaction
4. **Add Service Method**: Update ProposalService.ts with method for the new transaction
5. **Connect UI**: Update React components to call service methods and handle UI flow

## Common Issues and Solutions

1. **Account Creation**: Ensure accounts are properly created with enough space
2. **Serialization**: Use consistent serialization formats between client and program
3. **Signers**: Make sure all required accounts are set as signers
4. **Error Handling**: Provide clear error messages to help debugging

## AI-Powered Features

This project uses the Replicate API to power AI features such as improving DAO descriptions. To enable these features:

1. Sign up for a Replicate account at [replicate.com](https://replicate.com) if you don't already have one
2. Go to your account settings and obtain an API token
3. Create a `.env` file at the root of the project (or copy from `.env.example`)
4. Add your Replicate API token:
   ```
   REPLICATE_API_TOKEN=r8_your_token_here
   ```
5. Restart the development server for the changes to take effect

The AI-powered features that require this token include:
- "Improve with AI" button on the DAO description step