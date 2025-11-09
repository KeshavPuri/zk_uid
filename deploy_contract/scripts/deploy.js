// scripts/deploy.js (CJS / require style)
const hre = require("hardhat");

async function main() {
  console.log("Deployment script shuru ho raha hai...");
const Verifier = await hre.ethers.getContractFactory("Groth16Verifier");

  console.log("Verifier.sol ko deploy kiya ja raha hai...");
  const verifier = await Verifier.deploy();
  await verifier.deployed(); // Deploy hone ka wait karo

  console.log("✅ Contract safalta se deploy ho gaya!");
  console.log(`Contract Address (Etherscan par check karne ke liye): ${verifier.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment FAILED:", error);
    process.exit(1);
  });