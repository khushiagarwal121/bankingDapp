import { BrowserProvider, Contract, parseEther, formatEther } from "ethers";
import BankABI from "./BankABI.json";

const CONTRACT_ADDRESS = "0xc68d5A96171A9B2cBFBFFD00F290ccCaE8c99De5";
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
// can be in hook
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

  try {
    const valueInWei = parseEther(amountInEth);
    console.log("Parsed amount:", valueInWei);

    const tx = await contract.deposit({
      value: valueInWei,
    });

    console.log("Tx sent. Waiting...");
    await tx.wait();
    console.log("✅ Transaction successful:", tx.hash);

    return tx;
  } catch (err) {
    console.error("❌ Deposit failed");
    console.error("Message:", err.message);
    console.error("Code:", err.code);
    console.error("Reason:", err.reason);
    console.error("Stack:", err.stack);
    throw err; // rethrow to see in UI
  }
}

export async function withdrawEther(amountInEth) {
  const contract = await getBankContract();
  console.log("amoutn", amountInEth);
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
  // console.log("💰 Formatted ETH:", formatEther(balance));

  // console.log("balance", balance, formatEther(balance));
  // formatEther() is an Ethers.js utility function that converts wei → human-readable ETH string
  return formatEther(balance);
}

export async function getTimeUntilWithdraw() {
  const contract = await getBankContract();
  // get result in big int
  const secondsLeft = await contract.timeUntilWithdraw();
  return Number(secondsLeft);
}
