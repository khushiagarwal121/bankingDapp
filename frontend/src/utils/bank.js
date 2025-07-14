import { BrowserProvider, Contract, parseEther, formatEther } from "ethers";
import BankABI from "./BankABI.json";

const CONTRACT_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
// Reuse across all functions
let contractInstance = null;
export async function getBankContract() {
  if (contractInstance) return contractInstance;

  if (!window.ethereum) {
    throw new Error("metamask not installed");
  }
  const provider = new BrowserProvider(window.ethereum);

  const signer = await provider.getSigner();
  contractInstance = new Contract(CONTRACT_ADDRESS, BankABI.abi, signer);
  setupEventListeners(contractInstance);

  return contractInstance;
}

function setupEventListeners(contract) {
  // ✅ This is the correct way to reference events in Ethers v6
  // "Look inside this contract’s ABI and find the event called Withdrawn."
  contract.on(contract.getEvent("Deposited"), (user, amount) => {
    console.log("📥 Deposited Event:", user, formatEther(amount), "ETH");
  });

  contract.on(contract.getEvent("Withdrawn"), (user, amount) => {
    console.log("📤 Withdrawn Event:", user, formatEther(amount), "ETH");
  });
}
export async function depositEther(amountInEth) {
  const contract = await getBankContract();
  console.log("contract returned ", contract);
  // We are calling the deposit() function of your deployed Bank smart contract, and we’re sending ETH along with the function call.
  //   value: ... is a special key in Ethers.js that says:
  // "Along with calling this function, send this amount of ETH.

  const tx = await contract.deposit({
    value: parseEther(amountInEth),
  });
  await tx.wait(); //tx mined here
  return tx; // ✅ return transaction
}

export async function withdrawEther(amountInEth) {
  const contract = await getBankContract();
  const tx = await contract.withdraw(parseEther(amountInEth));
  // const receipt = await tx.wait(); // this is the mined receipt
  // return receipt; // ✅ return this if needed
  await tx.wait(); //tx mined here
  return tx; // ✅ return transaction
}

export async function getMyBalance() {
  const contract = await getBankContract();
  // Returns the balance in wei
  const balance = await contract.getBalance();
  console.log("📊 Raw Wei balance:", balance); // BigInt
  console.log("💰 Formatted ETH:", formatEther(balance));

  console.log("balance", balance, formatEther(balance));
  // formatEther() is an Ethers.js utility function that converts wei → human-readable ETH string
  return formatEther(balance);
}
