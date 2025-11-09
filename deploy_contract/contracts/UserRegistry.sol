// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24; // Hum 0.8.24 use kar rahe hain (aap config se match kar lena)

/**
 * @title UserRegistry
 * @dev Yeh contract ZK-ID (publicHashes) ka status store karta hai.
 * Status: true = Active, false = Deleted/Non-Existent
 */
contract UserRegistry {

    // address book jo store karega ki kaun-kaun se hash registered hain
    mapping(uint256 => bool) public isRegistered;

    // Sirf admin (aap) hi naye user add/delete kar sakta hai
    address public owner;

    // Event jab koi naya user add hota hai
    event UserRegistered(uint256 indexed publicHash);

    // Event jab koi user delete hota hai
    event UserDeleted(uint256 indexed publicHash);

    constructor() {
        owner = msg.sender; // Jo deploy karega, woh maalik ban jayega
    }

    /**
     * @dev Naye user (hash) ko register karne ke liye (Admin ka kaam)
     * Ismein GAS FEE lagegi (yeh 'write' operation hai).
     */
    function registerUser(uint256 publicHash) public {
        // Check karta hai ki sirf maalik (owner) hi yeh function chala sake
        require(msg.sender == owner, "Sirf admin hi register kar sakta hai");

        // Hash ko 'true' (ACTIVE) set kar deta hai
        isRegistered[publicHash] = true;

        // Ek event bhejta hai (blockchain par log karne ke liye)
        emit UserRegistered(publicHash);
    }

    /**
     * @dev User ko delete karne ke liye (Admin ka kaam)
     * Ismein GAS FEE lagegi (yeh 'write' operation hai).
     */
    function deleteUser(uint256 publicHash) public {
        require(msg.sender == owner, "Sirf admin hi delete kar sakta hai");

        // Hash ko 'false' (DELETED) set kar deta hai
        isRegistered[publicHash] = false;

        // Ek event bhejta hai
        emit UserDeleted(publicHash);
    }

    /**
     * @dev Check karne ke liye ki hash registered hai ya nahi
     * Yeh ek 'view' function hai, iski KOI GAS FEE nahi lagti.
     */
    function checkUser(uint256 publicHash) public view returns (bool) {
        return isRegistered[publicHash];
    }
}