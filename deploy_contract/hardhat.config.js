require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config(); // .env file load karega

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24", // Yahan Verifier.sol ka version daalna

  // Yahan hum network set kar rahe hain
  networks: {
    sepolia: { // 'amoy' ki jagah 'sepolia'
      url: process.env.SEPOLIA_RPC_URL, // .env file se Sepolia URL lega
      accounts: [process.env.PRIVATE_KEY] // .env file se Private Key lega
    }
  }
};