// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title ReputationRegistry
 * @dev Anchors reputation hashes on-chain for CHOICE iD.
 * Allows users to commit to a specific state of their reputation without revealing the details.
 */
contract ReputationRegistry is Ownable, Pausable {
    
    // Mapping from user address to their latest reputation hash
    mapping(address => bytes32) public reputationHashes;
    
    // Mapping from user address to the timestamp of their last update
    mapping(address => uint256) public lastUpdated;

    /**
     * @dev Emitted when a user updates their reputation anchor.
     * @param user The address of the user.
     * @param hash The new reputation hash (Hash(Score + Address + Salt)).
     * @param timestamp The block timestamp of the update.
     */
    event ReputationUpdated(address indexed user, bytes32 hash, uint256 timestamp);

    constructor() Ownable(msg.sender) {}

    /**
     * @dev Anchors a reputation hash on-chain.
     * @param hash The cryptographic hash representing the user's reputation state.
     */
    function anchorReputation(bytes32 hash) external whenNotPaused {
        reputationHashes[msg.sender] = hash;
        lastUpdated[msg.sender] = block.timestamp;
        
        emit ReputationUpdated(msg.sender, hash, block.timestamp);
    }

    /**
     * @dev Verifies if a claimed hash matches the on-chain anchor for a user.
     * @param user The address of the user to verify.
     * @param claimedHash The hash provided by the user for verification.
     * @return bool True if the hashes match, false otherwise.
     */
    function verifyReputation(address user, bytes32 claimedHash) external view returns (bool) {
        return reputationHashes[user] == claimedHash;
    }

    /**
     * @dev Emergency pause for the contract.
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @dev Unpause the contract.
     */
    function unpause() external onlyOwner {
        _unpause();
    }
}
