import { toast } from "react-hot-toast";
import { useState, useEffect, useContext } from "react";
import {
  getMyBalance,
  depositEther,
  withdrawEther,
  getTimeUntilWithdraw,
} from "../utils/bank";
import { formatTime } from "../utils/format";
import { BankingContext } from "../context/BankingContext";
export function useBanking() {
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 🔥 Use global context
  const {
    wallet,
    setWallet,
    balance,
    setBalance,
    transactions,
    setTransactions,
  } = useContext(BankingContext);
  const [timeLeft, setTimeLeft] = useState(null);
  useEffect(() => {
    if (window.ethereum) connectWallet();
  }, []);

  useEffect(() => {
    async function fetchTimeLeft() {
      if (!wallet) return;
      const seconds = await getTimeUntilWithdraw();
      setTimeLeft(seconds);
    }
    fetchTimeLeft();
  }, [wallet, transactions]);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) {
      return;
    }
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // When only 1 second or less is left, it:

          // Stops the timer using clearInterval,

          // Returns 0 to finish the countdown.
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const connectWallet = async () => {
    const [addr] = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setWallet(addr);
    const bal = await getMyBalance();
    setBalance(bal);
  };

  const disconnectWallet = () => {
    setWallet(null);
    setBalance(0);
    toast("Wallet disconnected");
  };

  const isValidAmount = (value) => {
    // parseFloat() is a built-in JavaScript function that converts a string to a floating-point number (i.e., a decimal number).
    const parsed = parseFloat(value.trim());
    // isNaN() stands for "is Not a Number".
    return !isNaN(parsed) && parsed > 0;
  };

  const handleDeposit = async () => {
    if (!isValidAmount(amount)) {
      // alert("please enter a valid amount greater than 0");
      toast.error("❗ Please enter a valid amount greater than 0");
      return;
    }
    setIsLoading(true); // 🔄 Start loading
    const toastId = toast.loading("⏳ Processing deposit...");
    try {
      const tx = await depositEther(amount);
      const bal = await getMyBalance();
      setBalance(bal);
      setAmount("");
      // Record this transaction
      setTransactions((prev) => [
        {
          type: "Deposit",
          amount,
          hash: tx.hash,
          timestamp: new Date().toISOString(),
        },
        ...prev,
      ]);
      const etherscanUrl = `https://sepolia.etherscan.io/tx/${tx.hash}`;
      toast.success(
        <span>
          Deposit successful
          <br />
          <a
            href={etherscanUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-blue-500"
          >
            view on ethereum
          </a>
        </span>,
        { id: toastId, duration: 8000 }
      );
    } catch (err) {
      toast.error("❌ Deposit failed", { id: toastId });
    }
    setIsLoading(false); // ✅ Done
  };

  const handleWithdraw = async () => {
    if (!isValidAmount(amount)) {
      toast.error("please enter a valid amount greater than 0");
      return;
    }

    const timeLeft = await getTimeUntilWithdraw();
    if (timeLeft > 0) {
      toast.error(`you can withdraw in ${formatTime(timeLeft)}`);
      return;
    }
    setIsLoading(true);
    const toastId = toast.loading("processing withdrawal..");
    try {
      const tx = await withdrawEther(amount);
      const etherscanUrl = `https://sepolia.etherscan.io/tx/${tx.hash}`;
      const bal = await getMyBalance(); // in ETH (string)

      setBalance(bal);
      setAmount("");
      setTransactions((prev) => [
        {
          type: "Withdraw",
          amount,
          hash: tx.hash,
          timestamp: new Date().toISOString(),
        },
        ...prev,
      ]);
      toast.success(
        <span>
          Withdrawal successfull
          <br />
          <a
            href={etherscanUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-blue-500"
          >
            view on ethereum
          </a>
        </span>,
        { id: toastId }
      );
    } catch (err) {
      toast.error("❌ Withdrawal failed", { id: toastId, duration: 8000 });
    }
    setIsLoading(false);
  };

  return {
    wallet,
    balance,
    amount,
    isLoading,
    setAmount,
    connectWallet,
    disconnectWallet,
    handleDeposit,
    handleWithdraw,
    transactions,
    timeLeft,
  };
}
