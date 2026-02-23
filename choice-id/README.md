# CHOICE iD - MVP

A privacy-first, self-sovereign identity and reputation application.

## 🏗 Architecture Overview

This MVP demonstrates a "Backend-Light" architecture where user data resides primarily on the client (Local Storage / Secure Enclave) and only cryptographic proofs are anchored on-chain.

### Core Components

1.  **Identity (DID)**: Generated deterministically from the Ethereum wallet address (`did:ethr`).
2.  **Credentials (VC)**: W3C-compliant JSON objects issued locally (mocked) or by authorities, stored in local storage, and anchored to IPFS (mocked).
3.  **Reputation Engine**:
    *   Runs entirely client-side.
    *   Formula: `Base Score (10) + (Credentials * 20)`.
    *   Privacy: The raw score is never sent to the chain.
4.  **On-Chain Anchoring**:
    *   Contract: `ReputationRegistry.sol` (Arbitrum).
    *   Data: `Hash(Score + Address)`. This allows the user to prove their score to a verifier off-chain without revealing it to the public ledger.

## 🚀 Tech Stack

*   **Frontend**: React, TypeScript, Tailwind CSS
*   **Blockchain**: Solidity (OpenZeppelin), simulated connection via Mock Hooks.
*   **Storage**: Browser LocalStorage (Simulating Secure Enclave), IPFS (Simulated).

## 🔒 Privacy & Security

*   **No PII on Backend**: We do not maintain a centralized database of users.
*   **Client-Side Computation**: Scores are calculated on the device.
*   **Zero-Knowledge Principles**: Only hashes are public.

## 📂 Project Structure

*   `/components`: Reusable UI elements (Cards, Buttons, Layout).
*   `/pages`: Main application views.
*   `/services`: Logic for crypto, storage, and identity management.
*   `/contracts`: Solidity smart contracts.

## 🏃‍♂️ How to Run

1.  Clone repository.
2.  `npm install`
3.  `npm start`

## 🔮 Next Milestones

1.  **ZK-Proofs**: Replace simple Hashing with ZK-SNARKs (using Circom) to prove "Score > 50" without revealing exact score.
2.  **Real IPFS**: Integrate Web3.Storage for actual VC pinning.
3.  **Graph Protocol**: Build a subgraph to index reputation updates for faster querying.
4.  **Mobile Port**: Migrate React code to React Native (Expo) for the actual mobile app.
