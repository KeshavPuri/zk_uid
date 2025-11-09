import axios from 'axios';

// FIX: Har function mein check karo ki snarkjs loaded hai ya nahi.
const getSnarkjs = () => {
    // FIX: Yeh check karega ki library loaded hai ya nahi.
    if (!window.snarkjs || !window.snarkjs.crypto) {
        // Agar load nahi hui, toh error dega jisse App.jsx catch kar lega.
        throw new Error("ZK Engine not loaded. Please Hard Reload the browser.");
    }
    return window.snarkjs;
};

// Poseidon Hash: PIN to ZK-ID
export const calculateHash = async (pin) => {
    try {
        const snarkjs = getSnarkjs(); // Safe check
        
        // Hash ko BigInt string mein convert karte hain (safer for ethers.js/Solidity)
        const poseidonHash = await snarkjs.crypto.poseidon([pin]);
        return poseidonHash.toString(); 
    } catch (error) {
        console.error("Poseidon Hash Error:", error);
        throw new Error(error.message || "Failed to calculate hash.");
    }
};

// Proof Generation: PIN to ZK-Proof
export const generateProof = async (pin) => {
    try {
        const snarkjs = getSnarkjs(); // Safe check
        const input = { secret: pin };
        
        // Full Prove call
        const { proof, publicSignals } = await snarkjs.groth16.fullProve(
            input,
            // Assets /public folder se uthenge:
            "/circuit.wasm", 
            "/circuit_final.zkey"
        );
        
        return { proof, publicHash: publicSignals[0] };
    } catch (error) {
        console.error("Proof Generation Failed:", error);
        throw new Error("Proof generation failed. Check ZK assets in /public folder.");
    }
};

// Data Fetching: Simple wrapper
export const API_BASE_URL = 'http://localhost:3001/api';

export const registerUser = async (data) => {
    const hash = await calculateHash(data.pin);
    return axios.post(`${API_BASE_URL}/register-id`, {
        name: data.name,
        email: data.email,
        college: data.college,
        zk_id_hash: hash
    });
};

export const verifyEventRegistration = async (pin, storedZkId) => {
    // Pehle Proof generate karo
    const { proof, publicHash } = await generateProof(pin);

    // Frontend Check: ZK-ID match hona chahiye
    if (publicHash !== storedZkId) {
        throw new Error('PIN is incorrect or does not match your registered ZK-ID.');
    }

    // Backend Verification Call
    const response = await axios.post(`${API_BASE_URL}/register-for-event`, {
        proof: proof,
        publicHash: publicHash
    });
    
    return response.data;
};