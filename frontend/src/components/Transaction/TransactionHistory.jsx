function TransactionHistory({ transactions }) {
  if (transactions.length === 0) {
    return <p className="text-gray-500 mt-4">No transactions yet</p>;
  }
  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">
        Transaction History
      </h2>
      <ul className="space-y2 max-h-60 overflow-auto">
        {transactions.map((tx, index) => (
          <li
            key={index}
            className="p-3 border border-gray-300 rounded-lg bg-gray mb-2"
          >
            <p>
              <strong>{tx.type}</strong>of{" "}
              <span className="text-blue-600">{tx.amount} ETH</span>
            </p>
            <p className="text-sm text-gray-600">
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
