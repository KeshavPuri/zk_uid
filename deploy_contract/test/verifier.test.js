// test/verifier.test.js (CommonJS / 'require' style - Hardhat v2)

const { expect } = require("chai");
const { ethers } = require("hardhat"); // 'hardhat' se ethers import karna
const fs = require("fs");
const path = require("path");

describe("Groth16 Verifier Contract Test", () => {
    let verifier;
    let proof;
    let publicSignals;

    before(async () => {
        // 1. Contract ko deploy karo
     const Verifier = await ethers.getContractFactory("Groth16Verifier");
        verifier = await Verifier.deploy();
        await verifier.deployed(); // Hardhat v2 (Ethers v5) syntax

        // 2. Apne ZK files (build folder se) ko load karo
        // Hum 'test' folder mein hain, isliye build folder '..' (ek level upar) hai
        const proofPath = path.join(__dirname, "../build/proof.json");
        const publicPath = path.join(__dirname, "../build/public.json");

        proof = JSON.parse(fs.readFileSync(proofPath, "utf8"));
        publicSignals = JSON.parse(fs.readFileSync(publicPath, "utf8"));
    });

    // Test Case 1: Happy Path
    it("✅ Sahi proof aur sahi public input ko 'true' return karna chahiye", async () => {
        const result = await verifier.verifyProof(
            proof.pi_a,
            proof.pi_b,
            proof.pi_c,
            publicSignals
        );
        expect(result).to.be.true;
    });

    // Test Case 2: Bad Path (Galat Public Input)
    it("❌ Sahi proof lekin GALAT public input ko 'false' return karna chahiye", async () => {
        const badPublicSignals = ["0"]; // Galat public hash
        const result = await verifier.verifyProof(
            proof.pi_a,
            proof.pi_b,
            proof.pi_c,
            badPublicSignals
        );
        expect(result).to.be.false;
    });

    // Test Case 3: Bad Path (Galat Proof)
    it("❌ GALAT proof aur sahi public input ko 'false' return karna chahiye", async () => {
        let bad_pi_a = [...proof.pi_a]; // Proof ki copy
        bad_pi_a[0] = "0x0000000000000000000000000000000000000000000000000000000000000001"; // Proof badal diya

        const result = await verifier.verifyProof(
            bad_pi_a, // Galat 'a' component
            proof.pi_b,
            proof.pi_c,
            publicSignals
        );

        expect(result).to.be.false;
    });
});