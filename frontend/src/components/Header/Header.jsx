function Header({ wallet, onConnect, onDisconnect }) {
  return (
    // justify-between - It puts equal space between all inner items, but no space on the outer sides.
    <header className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-4 shadow-md flex justify-between items-center rounded-b-xl">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <span role="img" aria-label="bank">
          🏦{" "}
        </span>
        Banking DApp
      </h1>
      <div>{wallet?(<button onClick={onDisconnect}>Disconnect</button>):(<button onClick={onConnect} className="bg-white text-blue-600 font-semibold px-4 py-2 rounded-md hover:bg-gray transition">Connect</button>)}</div>
    </header>
  );
}
export default Header;
