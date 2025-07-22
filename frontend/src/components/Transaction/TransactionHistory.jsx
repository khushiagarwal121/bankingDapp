import { useBanking } from "../../hooks/useBanking";
import { useNavigate } from "react-router-dom";
function TransactionHistory() {
  const { transactions } = useBanking();
  if (!transactions || transactions.length === 0) {
    return <p className="text-gray-500 mt-4">No transactions yet</p>;
  }
  return (
    // mt -6 is margin top 6
    <div className="mt-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-2 text-center">
        Transaction History
      </h2>
      <ul className="space-y2">
        {transactions.map((tx, index) => (
          <li
            key={index}
            className="p-3 border border-gray-300 rounded-lg bg-gray mb-2 mx-3 flex justify-between text-lg py-5"
          >
            <p>
              <strong>{tx.type}</strong> of{" "}
              <span className="text-blue-600">{tx.amount} ETH</span>
            </p>
            <p className="text-lg text-gray-600">
              {new Date(tx.timestamp).toLocaleString()}
            </p>
            {/* <a
              href={`https://sepolia.etherscan.io/tx/${tx.hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline text-sm"
            >
              view on etherscan
            </a> */}
          </li>
        ))}
      </ul>
    </div>
  );
}
export default TransactionHistory;
