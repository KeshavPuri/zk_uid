
# 🚀 ZK-Event-Pass: Privacy-Preserving Event Verification

> **Prove your identity, not your data.**
>
> ZK-Event-Pass is a full-stack solution for secure event participation using **ZK-SNARKs**. It allows users to validate their identity **without revealing any personal information**, bringing verifiable privacy and trust to both real-world and Web3 events.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Solidity](https://img.shields.io/badge/Solidity-0.8.19-green.svg)
![Node.js](https://img.shields.io/badge/Node.js-16+-green.svg)
![React](https://img.shields.io/badge/React-18+-blue.svg)

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| 🔒 **Zero-Knowledge Proofs** | Users verify their identity without exposing any private details (e.g., prove age > 18 without revealing DOB) |
| 🌐 **On-Chain Verification** | Smart contracts validate cryptographic proofs on the Ethereum (Sepolia) testnet |
| ⚡ **Client-Side Proof Generation** | ZK proofs are generated entirely in the user's browser via SnarkJS - no private data leaves the device |
| 💾 **Secure Off-Chain Storage** | All sensitive personal data is encrypted and stored securely off-chain in MongoDB |
| 🎫 **One-Click Verification** | Instantly validate event access with a pre-generated ZK-ID |
| 🔑 **Poseidon Hashing** | Uses ZK-friendly Poseidon hashing for cryptographically linking anonymous IDs |

## 🏗️ Project Architecture

ZK-Event-Pass integrates four key layers to provide a robust, privacy-preserving verification pipeline.

### 🖥️ Frontend (`zk-frontend/`)
- **Tech:** React + Vite, TailwindCSS
- **Core Logic:** Generates **client-side ZK proofs** in the browser using **SnarkJS**
- **Features:** Intuitive UI for "ZK Passport" creation and one-click event verification
- **Crypto:** Uses **Poseidon Hash** for anonymous ZK-ID generation

### ⚙️ Backend (`block_backend/`)
- **Tech:** Node.js + Express.js
- **Database:** **MongoDB** for secure, encrypted storage of PII
- **Blockchain Interop:** Integrates **ethers.js** for all smart contract communication
- **API:** Manages proof submission, user registration, and registry management

### ⛓️ Smart Contracts (`deploy_contract/`)
- **Tech:** Solidity + Hardhat
- **Core Logic:** Implements **on-chain proof verification**
- **Contracts:** `Verifier.sol` (auto-generated from Circom) and `UserRegistry.sol`
- **Network:** Deployed on **Ethereum Sepolia Testnet**

### 🔐 ZK Circuits (`zk_rollup/`)
- **Tech:** Circom
- **Core Logic:** Defines the ZK-SNARK logic for identity hashing and verification
- **Process:** Generates `.wasm` (witness generation) and `.zkey` (proof generation) files, plus `Verifier.sol` contract

## 🧰 Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | React, Vite, TailwindCSS, SnarkJS (client) |
| **Backend** | Node.js, Express.js, MongoDB, ethers.js |
| **Blockchain** | Ethereum (Sepolia), Solidity, Hardhat |
| **ZK Technology** | Circom, SnarkJS, Groth16 (Protocol), Poseidon Hash |
| **DevOps** | Git, Node.js |

## 🗂️ Project Structure

```bash
ZK-Event-Pass/
├── zk-frontend/      # React + SnarkJS frontend
│   ├── public/       # Must contain circuit.wasm & circuit_final.zkey
│   └── src/
├── block_backend/    # Express.js + MongoDB backend
│   ├── models/
│   ├── routes/
│   └── server.js
├── deploy_contract/  # Solidity + Hardhat contracts
│   ├── contracts/    # Verifier.sol, Registry.sol
│   └── scripts/
└── zk_rollup/        # Circom circuits and trusted setup
    ├── circuits/     # circuit.circom
    └── setup_scripts/
```

## ⚙️ Setup and Installation

### 🔧 Prerequisites
- Node.js (v16 or higher)
- MongoDB instance (local or a free Atlas cluster)
- Ethereum wallet with Sepolia ETH (for deployment)
- Git

### 🔑 Environment Variables

#### Backend (`block_backend/.env`)
```bash
# MongoDB Connection String
MONGODB_URI=your_mongodb_uri

# Ethereum Wallet Private Key (for sending transactions)
PRIVATE_KEY=your_ethereum_private_key

# RPC URL for Sepolia
SEPOLIA_RPC_URL=your_sepolia_rpc_url

# Deployed Contract Addresses (get these after Step 3)
VERIFIER_ADDRESS=deployed_verifier_contract_address
REGISTRY_ADDRESS=deployed_registry_contract_address
```

#### Smart Contracts (`deploy_contract/.env`)
```bash
# RPC URL for Sepolia
SEPOLIA_RPC_URL=your_sepolia_rpc_url

# Wallet Private Key
PRIVATE_KEY=your_ethereum_private_key
```

#### Frontend (`zk-frontend/.env`)
```bash
# URL for your running backend
VITE_API_BASE_URL=http://localhost:3001/api
```

### 🏁 Step-by-Step Installation

#### Step 1: Clone the Repository
```bash
git clone https://github.com/your-username/ZK-Event-Pass.git
cd ZK-Event-Pass
```

#### Step 2: ZK Circuit Setup
```bash
cd zk_rollup
npm install

# Run the full setup script (compiles, trusted setup)
bash ./setup_scripts/full_setup.sh

# --- IMPORTANT ---
# 1. Copy the generated Verifier.sol to deploy_contract/contracts/
# 2. Copy circuit.wasm and circuit_final.zkey to zk-frontend/public/
```

#### Step 3: Deploy Smart Contracts
```bash
cd deploy_contract
npm install

# Deploy to Sepolia (ensure .env is set)
npx hardhat run scripts/deploy.js --network sepolia

# Copy the deployed contract addresses and paste into block_backend/.env
```

#### Step 4: Start the Backend
```bash
cd block_backend
npm install

# Ensure .env is set with DB and contract addresses
npm start
# Server runs on http://localhost:3001
```

#### Step 5: Start the Frontend
```bash
cd zk-frontend
npm install

# Ensure .env is set
npm run dev
# App runs on http://localhost:5173
```

## 🛡️ Security Model

- **🔐 Encrypted Data:** All sensitive PII is encrypted before being stored off-chain in MongoDB
- **🧠 ZK-SNARK Privacy:** Proofs cryptographically guarantee identity without revealing underlying private data
- **⚙️ Minimal On-Chain Logic:** Only cryptographic verifier and public hashes are stored on-chain
- **🧱 Environment Isolation:** Sensitive keys isolated in `.env` files, never hard-coded
- **🌍 CORS:** Backend implements strict CORS policy for designated frontend URLs only

## 🧩 Future Roadmap

- [ ] **ZK-Proof Aggregation:** Implement proof aggregation for multi-event verification
- [ ] **PLONK Migration:** Migrate from Groth16 to PLONK for universal trusted setup
- [ ] **Encrypted QR Access:** Generate encrypted QR codes for real-world event access
- [ ] **Mobile-First Redesign:** Optimize UI/UX for mobile-native experience

## 🤝 Contributing

Contributions are what make the open-source community amazing. We welcome any contributions!

1. Fork this repository
2. Create a new branch (`git checkout -b feature/YourAmazingFeature`)
3. Commit your changes (`git commit -m 'Add YourAmazingFeature'`)
4. Push to the branch (`git push origin feature/YourAmazingFeature`)
5. Open a Pull Request

## 🧾 License

This project is distributed under the **MIT License**. See `LICENSE.txt` for more information.

---

> ❤️ Built with Zero-Knowledge, not Zero Privacy.
