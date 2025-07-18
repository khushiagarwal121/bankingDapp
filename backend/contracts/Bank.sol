// This specific contract is meant to act like a digital wallet or vault where users can deposit, check, and later withdraw Ether (ETH).
// SPDX-License-Identifier: UNLICENSED
// The ^ symbol means "up to the next major version", so it's compatible with any 0.8.x.

pragma solidity ^0.8.28;
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
// we inherit from ReentrancyGuard
// This means the Bank contract is inheriting from the ReentrancyGuard contract provided by OpenZeppelin.

// So now, our Bank contract has access to everything in ReentrancyGuard, especially the:

// modifier nonReentrant
contract Bank is ReentrancyGuard {
    // private means: is not directly visible to users or other contracts — only the functions in this contract can see it.
    // 🔸 address => uint
    // The key is an Ethereum wallet address (like 0x123...).
    // The value is a uint, which means "unsigned integer" (a number ≥ 0).\
    // address: the Ethereum address (like the user ID).
    // uint: the amount of Ether (or tokens) that user has in the bank.
    // This is an access modifier.
    // It means that this variable:
    // Cannot be accessed directly from outside the contract.
    // Can only be accessed by functions inside the same contract.
    // balances - This is the name of the mapping.
    // its a mapping
    mapping(address => uint) private balances;
    mapping(address => uint256) private depositTimeStamps;
    event Deposited(address indexed user, uint amount, uint256 timestamp);
    event Withdrawn(address indexed user, uint amount, uint256 timestamp);

    // This function allows a user to send ETH to the contract.
    // payable → It can receive ETH when it’s called.
    function deposit() public payable {
        balances[msg.sender] += msg.value;
        // Set timestamp only on first deposit (or first after withdrawal)
        if (depositTimeStamps[msg.sender] == 0) {
            depositTimeStamps[msg.sender] = block.timestamp;
        }
        emit Deposited(msg.sender, msg.value, block.timestamp);
    }
    // to let users take out ETH from their balance.
// As soon as withdraw is called, the nonReentrant modifier blocks any reentrant calls.
// Even if the attacker tries to call back into withdraw in the same transaction, it fails.
    function withdraw(uint amount) public nonReentrant {
        require(
            block.timestamp >= depositTimeStamps[msg.sender] + 1 days,
            "Withdrawals allowed after one day"
        );
        // This line checks if the sender (the person calling the function) has enough ETH stored in the contract.
        // msg.sender is a built-in global variable.
        // It stores the address of the caller of the function (usually an EOA like MetaMask or another contract).
        // require and revert are error-handling statements built into Solidity.
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        // If you call the function from MetaMask, msg.sender is your wallet address.
        // with payable the address of the caller, now treated as someone you can send ETH to.
        // .transfer(amount) - This sends Ether from the contract to the address.
        // payable(msg.sender).transfer(amount);
        // "" is empty data:
        // We're not calling a function, just transferring ETH.
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Transfer failed");
        emit Withdrawn(msg.sender, amount, block.timestamp);
    }
    //  view → It only reads, doesn’t change anything
    function getBalance() public view returns (uint) {
        return balances[msg.sender];
    }
    // since view so doesnt change blockchain state

    function timeUntilWithdraw() public view returns (uint256) {
        uint256 unlockTime = depositTimeStamps[msg.sender] + 1 days;
        if (block.timestamp > unlockTime) {
            return 0;
        }
        return unlockTime - block.timestamp;
    }
}
