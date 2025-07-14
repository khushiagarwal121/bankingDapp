import { useBanking } from "./hooks/useBanking";
import { Toaster } from "react-hot-toast";
import Header from "./components/Header/Header";
import TransactionForm from "./components/Transaction/TransactionForm";
import WalletInfo from "./components/Wallet/WalletInfo";

function App() {
  const {
    wallet,
    balance,
    amount,
    isLoading,
    setAmount,
    connectWallet,
    disconnectWallet,
    handleDeposit,
    handleWithdraw,
  } = useBanking();
  // const [wallet, setWallet] = useState(null);
  // const [balance, setBalance] = useState("0");
  // const [amount, setAmount] = useState("");
  // const [isLoading, setIsLoading] = useState(false);
  // useEffect(() => {
  //   async function load() {
  //     if (window.ethereum) {
  //       // .request(...): Standardized JSON-RPC call
  //       const [addr] = await window.ethereum.request({
  //         method: "eth_requestAccounts",
  //       });
  //       setWallet(addr);
  //       console.log("🔐 Connected Wallet Address:", addr);

  //       const bal = await getMyBalance();
  //       setBalance(bal);
  //     }
  //   }
  //   load();
  // }, []);
  // function isValidAmount(value) {
  //   // parseFloat() is a built-in JavaScript function that converts a string to a floating-point number (i.e., a decimal number).
  //   const parsed = parseFloat(value.trim());
  //   // isNaN() stands for "is Not a Number".
  //   return !isNaN(parsed) && parsed > 0;
  // }
  // async function handleDeposit() {
  //   if (!isValidAmount(amount)) {
  //     // alert("please enter a valid amount greater than 0");
  //     toast.error("❗ Please enter a valid amount greater than 0");
  //     return;
  //   }
  //   setIsLoading(true); // 🔄 Start loading
  //   const toastId = toast.loading("⏳ Processing deposit...");
  //   try {
  //     const tx = await depositEther(amount);
  //     const bal = await getMyBalance();
  //     setBalance(bal);
  //     setAmount("");
  //     const etherscanUrl = `https://sepolia.etherscan.io/tx/${tx.hash}`;
  //     toast.success(
  //       <span>
  //         Deposit successful<br></br>
  //         <a
  //           href={etherscanUrl}
  //           target="_blank"
  //           rel="noopener noreferrer"
  //           className="underline text-blue-500"
  //         >
  //           view on ethereum
  //         </a>
  //       </span>,
  //       { id: toastId, duration: 8000 }
  //     );
  //   } catch (err) {
  //     toast.error("❌ Deposit failed", { id: toastId });
  //   }
  //   setIsLoading(false); // ✅ Done
  // }

  // async function handleWithdraw() {
  //   console.log("💡 Withdraw amount:", amount);
  //   console.log("✅ Withdraw in Wei:", parseEther(amount));

  //   if (!isValidAmount(amount)) {
  //     toast.error("please enter a valid amount greater than 0");
  //     return;
  //   }
  //   setIsLoading(true);
  //   const toastId = toast.loading("processing withdrawal..");
  //   try {
  //     const tx = await withdrawEther(amount);
  //     const etherscanUrl = `https://sepolia.etherscan.io/tx/${tx.hash}`;
  //     const bal = await getMyBalance(); // in ETH (string)
  //     console.log("💳 Wallet balance (ETH):", bal);
  //     console.log("💸 Amount to withdraw (ETH):", amount);
  //     console.log("💡 Raw balance in Wei:", parseEther(bal));
  //     console.log("💡 Raw amount to withdraw in Wei:", parseEther(amount));

  //     setBalance(bal);
  //     setAmount("");
  //     toast.success(
  //       <span>
  //         Withdrawal successfull
  //         <br />
  //         <a
  //           href={etherscanUrl}
  //           target="_blank"
  //           rel="noopener noreferrer"
  //           className="underline text-blue-500"
  //         >
  //           view on ethereum
  //         </a>
  //       </span>,
  //       { id: toastId }
  //     );
  //   } catch (err) {
  //     toast.error("❌ Withdrawal failed", { id: toastId, duration: 8000 });
  //   }
  //   setIsLoading(false);
  // }

  // async function connectWallet() {
  //   const [addr] = await window.ethereum.request({
  //     method: "eth_requestAccounts",
  //   });
  //   setWallet(addr);
  //   const bal = await getMyBalance();
  //   setBalance(bal);
  // }

  return (
    <>
      <Toaster position="bottom-right" />
      <Header
        wallet={wallet}
        onConnect={connectWallet}
        onDisconnect={disconnectWallet}
      />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-100">
        <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center text-blue-800 animate-fadeIn">
            🚀 Welcome to Banking DApp
          </h1>

          <WalletInfo wallet={wallet} balance={balance} />
          <TransactionForm
            amount={amount}
            setAmount={setAmount}
            handleDeposit={handleDeposit}
            handleWithdraw={handleWithdraw}
            isLoading={isLoading}
          />

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
