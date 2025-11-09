// test/registry.test.js (Hardhat v2 / CJS style)
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("UserRegistry Contract Test", () => {

    let UserRegistry; // Contract ka blueprint
    let registry;     // Deploy kiya hua contract
    let owner;        // Yeh aap (admin) honge
    let addr1;        // Yeh ek random, non-admin user hoga

    // Hum in dummy hash par test karenge
    const testHash1 = "0x0000000000000000000000000000000000000000000000000000000000000001";
    const testHash2 = "0x0000000000000000000000000000000000000000000000000000000000000002";

    // Har test se pehle, naya contract deploy karo (taaki test saaf ho)
    beforeEach(async () => {
        // Signers (users) nikaalo
        [owner, addr1] = await ethers.getSigners();

        // Contract factory lo
        UserRegistry = await ethers.getContractFactory("UserRegistry");

        // 'owner' (admin) se contract deploy karo
        registry = await UserRegistry.deploy();
        await registry.deployed();
    });

    // Test 1: Check karo ki deploy karne wala hi owner hai
    it("✅ Deployer ko 'owner' set karna chahiye", async () => {
        expect(await registry.owner()).to.equal(owner.address);
    });

    // Test 2: Check karo ki naya hash shuru mein 'false' (not registered) hai
    it("✅ 'checkUser' ko shuru mein 'false' return karna chahiye", async () => {
        expect(await registry.checkUser(testHash1)).to.equal(false);
    });

    // Test 3: Check karo ki Admin register kar pa raha hai
    it("✅ Admin (owner) ko user register kar paana chahiye", async () => {
        // Admin (owner) ne 'testHash1' ko register kiya
        await registry.connect(owner).registerUser(testHash1);

        // Ab check karo
        expect(await registry.checkUser(testHash1)).to.equal(true);
    });

    // Test 4: Check karo ki Non-Admin register NAHI kar pa raha
    it("❌ Non-Admin ko user register NAHI kar paana chahiye", async () => {
        // Non-admin (addr1) register karne ki koshish karega
        // Hum expect karte hain ki yeh transaction REVERT (fail) ho jayega
        await expect(
            registry.connect(addr1).registerUser(testHash1)
        ).to.be.revertedWith("Sirf admin hi register kar sakta hai");
    });

    // Test 5: Check karo ki Admin delete kar pa raha hai
    it("✅ Admin ko user delete kar paana chahiye", async () => {
        // 1. Pehle register karo
        await registry.connect(owner).registerUser(testHash1);
        expect(await registry.checkUser(testHash1)).to.equal(true); // Check 1: Register ho gaya

        // 2. Ab delete karo
        await registry.connect(owner).deleteUser(testHash1);
        expect(await registry.checkUser(testHash1)).to.equal(false); // Check 2: Delete ho gaya
    });
});