function TransactionForm({
  amount,
  setAmount,
  handleDeposit,
  handleWithdraw,
  isLoading,
}) {
  return (
    <>
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
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
    </>
  );
}
export default TransactionForm;
