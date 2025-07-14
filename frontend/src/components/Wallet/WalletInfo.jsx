import { shortenAddress } from "../../utils/format.js";
function WalletInfo({ wallet, balance }) {
  return (
    <>
      <div className="mb-4 text-center">
        {" "}
        <p className="text-base text-gray-600">
          Wallet:{" "}
          <span className="font-mono text-gray-900">
            {shortenAddress(wallet)}
          </span>
        </p>
        <p className="text-base text-gray-600">
          Balance:{" "}
          <span className="font-semibold text-green-600">{balance} ETH</span>
        </p>
      </div>
    </>
  );
}
export default WalletInfo;
