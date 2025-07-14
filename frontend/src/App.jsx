import { useEffect, useState } from "react";
import { depositEther, withdrawEther, getMyBalance } from "./utils/bank";
import { Toaster, toast } from "react-hot-toast";
import { parseEther } from "ethers";
import Header from "./components/Header/Header";

function App() {
  const [wallet, setWallet] = useState(null);
  const [balance, setBalance] = useState("0");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    async function load() {
      if (window.ethereum) {
        // .request(...): Standardized JSON-RPC call
        const [addr] = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setWallet(addr);
        console.log("🔐 Connected Wallet Address:", addr);

        const bal = await getMyBalance();
        setBalance(bal);
      }
    }
    load();
  }, []);
  function isValidAmount(value) {
    // parseFloat() is a built-in JavaScript function that converts a string to a floating-point number (i.e., a decimal number).
    const parsed = parseFloat(value.trim());
    // isNaN() stands for "is Not a Number".
    return !isNaN(parsed) && parsed > 0;
  }
  async function handleDeposit() {
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
      const etherscanUrl = `https://sepolia.etherscan.io/tx/${tx.hash}`;
      toast.success(
        <span>
          Deposit successful<br></br>
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
  }

  async function handleWithdraw() {
    console.log("💡 Withdraw amount:", amount);
    console.log("✅ Withdraw in Wei:", parseEther(amount));

    if (!isValidAmount(amount)) {
      toast.error("please enter a valid amount greater than 0");
      return;
    }
    setIsLoading(true);
    const toastId = toast.loading("processing withdrawal..");
    try {
      const tx = await withdrawEther(amount);
      const etherscanUrl = `https://sepolia.etherscan.io/tx/${tx.hash}`;
      const bal = await getMyBalance(); // in ETH (string)
      console.log("💳 Wallet balance (ETH):", bal);
      console.log("💸 Amount to withdraw (ETH):", amount);
      console.log("💡 Raw balance in Wei:", parseEther(bal));
      console.log("💡 Raw amount to withdraw in Wei:", parseEther(amount));

      setBalance(bal);
      setAmount("");
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
  }

  function shortenAddress(address) {
    if (!address) return "";
    return `${address.slice(0, 4)}...${address.slice(-3)}`;
  }

  async function connectWallet() {
    const [addr] = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setWallet(addr);
    const bal = await getMyBalance();
    setBalance(bal);
  }

  return (
    <>
      <Toaster position="bottom-right" />
      <Header
        wallet={wallet}
        onConnect={connectWallet}
        onDisconnect={() => {
          setWallet(null);
          setBalance("0");
          toast("👋 Wallet disconnected");
        }}
      />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-100">
        <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center text-blue-800 animate-fadeIn">
            🚀 Welcome to Banking DApp
          </h1>

          <div className="mb-4 text-center">
            {" "}
            <p className="text-base text-gray-600">
              {" "}
              Wallet:{" "}
              <span className="font-mono text-gray-900">
                {shortenAddress(wallet)}
              </span>
            </p>
            <p className="text-base text-gray-600">
              Balance:{" "}
              <span className="font-semibold text-green-600">
                {balance} ETH
              </span>
            </p>
          </div>

          {/* onChange - It triggers every time the user types or changes the input field. */}
          {/* e contains information about the DOM event — what element changed, what value was type */}
          {/* e.target is the HTML element that triggered the event. */}
          {/* e.target.value - This gets the current text inside the input box. */}
          {/* setAmount(e.target.value) - This calls the React state updater. */}
          <input
            type="number"
            placeholder="Amount (ETH)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleDeposit}
              disabled={isLoading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition disabled:opacity-50"
            >
              Deposit
            </button>
            <button
              onClick={handleWithdraw}
              disabled={isLoading}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition disabled:opacity-50"
            >
              Withdraw
            </button>
          </div>

          {isLoading && (
            <p className="mt-4 text-center text-blue-600 font-medium">
              ⏳ Processing transaction...
            </p>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
