# 🚀 ZK-Event-Pass — Privacy-Preserving Event Verification with Zero-Knowledge Proofs  

> **Prove your identity, not your data.**  
> ZK-Event-Pass enables secure event participation and verification using **ZK-SNARKs**, allowing users to validate their identity **without revealing personal information** — bringing privacy and trust to real-world and Web3 events.

---

## 🏗️ Project Architecture

ZK-Event-Pass integrates **four key layers** to provide a full-stack, privacy-preserving verification pipeline.

### 🖥️ Frontend — `zk-frontend/`
- Built with **React + Vite**
- Generates **client-side ZK proofs** using **SnarkJS**
- Intuitive UI for:
  - Identity registration (Passport creation)
  - One-click event verification
- Uses **Poseidon Hash** for anonymous ZK-ID generation

### ⚙️ Backend — `block_backend/`
- **Express.js** server managing user registration & verification
- **MongoDB** for secure encrypted storage of PII
- Integrates **ethers.js** for blockchain communication
- API endpoints for proof submission and registry management

### ⛓️ Smart Contracts — `deploy_contract/`
- Written in **Solidity** and deployed using **Hardhat**
- Implements **on-chain proof verification**
- Includes **User Registry** and **Verifier Contracts**
- Deployed on **Ethereum Sepolia Testnet**

### 🔐 ZK Circuits — `zk_rollup/`
- Built using **Circom**
- Defines the ZK logic for identity hashing and verification
- Generates `.wasm`, `.zkey`, and verifier key files
- Ensures secure and deterministic proof generation

---

## ✨ Key Features

| Feature | Description |
|----------|-------------|
| 🔒 **Zero-Knowledge Proofs** | Users verify identity without exposing private details |
| 🌐 **On-Chain Verification** | Smart contracts validate proofs on Ethereum (Sepolia) |
| ⚡ **Client-Side Proof Generation** | ZK proofs generated entirely in browser via SnarkJS |
| 💾 **Secure Off-Chain Storage** | Encrypted personal data stored safely in MongoDB |
| 🎫 **One-Click Verification** | Instantly validate event access with your ZK-ID |
| 🔑 **Poseidon Hashing** | Cryptographic ID linking for secure anonymity |

---

## 🧰 Tech Stack

| Layer | Technologies |
|-------|---------------|
| **Frontend** | React, Vite, TailwindCSS, SnarkJS |
| **Backend** | Node.js, Express.js, MongoDB, ethers.js |
| **Blockchain** | Ethereum, Solidity, Hardhat |
| **ZK Technology** | Circom, SnarkJS, Groth16, Poseidon Hash |
| **DevOps** | Node.js, Git |

---

## ⚙️ Setup Instructions

### 🔧 Prerequisites
- Node.js ≥ 16  
- MongoDB instance (local or Atlas)  
- Ethereum wallet with **Sepolia ETH**  
- Git installed

---

### 🖥️ Frontend Setup
```bash
cd zk-frontend
npm install
npm run dev
Ensure public/snarkjs.min.js, circuit.wasm, and circuit_final.zkey exist in the public/ folder.

🧩 Backend Setup
bash
Copy code
cd block_backend
npm install
# Configure .env with MongoDB URI and Ethereum credentials
npm start
🔗 Smart Contract Deployment
bash
Copy code
cd deploy_contract
npm install
# Configure .env with private key and RPC URL
npx hardhat run scripts/deploy.js --network sepolia
🧠 ZK Circuit Compilation
bash
Copy code
cd zk_rollup
npm install
# Follow setup steps in zk_rollup/README.md
🔑 Environment Variables
📦 Backend .env
bash
Copy code
MONGODB_URI=your_mongodb_uri
PRIVATE_KEY=your_ethereum_private_key
SEPOLIA_RPC_URL=your_sepolia_rpc_url
VERIFIER_ADDRESS=deployed_verifier_contract_address
REGISTRY_ADDRESS=deployed_registry_contract_address
🌐 Frontend .env
bash
Copy code
VITE_API_BASE_URL=http://localhost:3001/api
🗂️ Project Structure
pgsql
Copy code
ZK-Event-Pass/
├── zk-frontend/        # React + SnarkJS frontend
├── block_backend/      # Express.js + MongoDB backend
├── deploy_contract/    # Solidity + Hardhat contracts
└── zk_rollup/          # Circom circuits and trusted setup
🛡️ Security Model
🔐 Encrypted Data – All PII stored securely off-chain in MongoDB

🧠 ZK-SNARK Privacy – Proofs reveal nothing about private data

⚙️ Minimal On-Chain Logic – Only cryptographic hashes verified on-chain

🧱 Environment Isolation – Sensitive credentials hidden via .env

🌍 CORS + HTTPS – Secure communication between client and server

🧾 License
MIT License — free to use, modify, and distribute.

🤝 Contributing
Fork this repository

Create a new branch (git checkout -b feature/your-feature)

Commit changes (git commit -m "Add new feature")

Push the branch (git push origin feature/your-feature)

Submit a Pull Request 🚀

🧩 Future Roadmap
✅ ZK-Proof Aggregation for multi-event verification

✅ PLONK migration for gas-optimized proof verification

✅ Encrypted QR-based event access

✅ Mobile-first UI redesign

💬 Support
For queries or contributions, open an Issue
or connect via GitHub Discussions.

❤️ Built with Zero-Knowledge, not Zero Privacy.
yaml
Copy code

---

Would you like me to generate a **shorter, visually optimized hackathon version** (with badges, emojis, one-li