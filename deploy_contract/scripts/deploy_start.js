// scripts/deploy_registry.js (Hardhat v2 / CJS style)
const hre = require("hardhat");

async function main() {
  // Dimaag ko batao ki hum 'UserRegistry' contract se kaam kar rahe hain
  const Registry = await hre.ethers.getContractFactory("UserRegistry");

  console.log("Naya contract (UserRegistry.sol) Sepolia par deploy ho raha hai...");

  // Contract ko deploy karo
  const registry = await Registry.deploy();

  // Pakka karo ki woh deploy ho chuka hai
  await registry.deployed(); 

  console.log("✅ UserRegistry safalta se deploy ho gaya!");
  console.log(`Registry Contract Address: ${registry.address}`);
}

// Script chalaane ke liye
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Registry Deployment FAILED:", error);
    process.exit(1);
  });