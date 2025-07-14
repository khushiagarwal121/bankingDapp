import { useBanking } from "./hooks/useBanking";
import { Toaster } from "react-hot-toast";
import Header from "./components/Header/Header";
import TransactionForm from "./components/Transaction/TransactionForm";
import WalletInfo from "./components/Wallet/WalletInfo";
import TransactionHistory from "./components/Transaction/TransactionHistory";

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
    transactions,
  } = useBanking();

  return (
    <>
      <Toaster position="bottom-right" />
      <Header
        wallet={wallet}
        onConnect={connectWallet}
        onDisconnect={disconnectWallet}
      />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-100 px-4">
        <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md overflow-y-auto max-h-[90vh]">
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
          <TransactionHistory transactions={transactions} />
        </div>
      </div>
    </>
  );
}

export default App;
