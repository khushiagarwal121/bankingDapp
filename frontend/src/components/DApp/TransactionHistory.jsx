import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contract } from "../utils/bank"; // Import your initialized ethers Contract instance

function TransactionHistory({ wallet }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!wallet) return;

    async function fetchHistory() {
      setLoading(true);
      try {
        const depositEvents = await contract.queryFilter(
          contract.filters.Deposit(wallet)
        );
        const withdrawEvents = await contract.queryFilter(
          contract.filters.Withdraw(wallet)
        );

        const combined = [
          ...depositEvents.map((e) => ({
            type: "Deposit",
            amount: ethers.utils.formatEther(e.args.amount),
            timestamp: new Date(e.args.timestamp.toNumber() * 1000).toLocaleString(),
            hash: e.transactionHash,
          })),
          ...withdrawEvents.map((e) => ({
            type: "Withdraw",
            amount: ethers.utils.formatEther(e.args.amount),
            timestamp: new Date(e.args.timestamp.toNumber() * 1000).toLocaleString(),
            hash: e.transactionHash,
          })),
        ];

        setHistory(
          combined.sort(
            (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
          )
        );
      } catch (err) {
        console.error("❌ Failed to fetch history:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, [wallet]);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg max-w-3xl mx-auto mt-10">
      <h2 className="text-xl font-semibold mb-4 text-blue-700">
        📜 Transaction History
      </h2>

      {loading ? (
        <p className="text-gray-500 text-sm">Loading transactions...</p>
      ) : history.length === 0 ? (
        <p className="text-gray-500 text-sm text-center">
          No transactions yet.
        </p>
      ) : (
        <ul className="space-y-3 max-h-80 overflow-y-auto">
          {history.map((tx, i) => (
            <li
              key={i}
              className="p-3 border border-gray-200 rounded-lg shadow-sm"
            >
              <div className="flex justify-between text-sm">
                <span
                  className={`font-semibold ${
                    tx.type === "Deposit" ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {tx.type}
                </span>
                <span>{tx.amount} ETH</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {tx.timestamp}
                <br />
                <a
                  href={`https://sepolia.etherscan.io/tx/${tx.hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  View on Etherscan
                </a>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TransactionHistory;
