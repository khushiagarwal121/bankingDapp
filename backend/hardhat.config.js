require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ignition"); // required for Ignition

module.exports = {
  solidity: "0.8.28",
  defaultNetwork: "ganache", // optional but good to have
  networks: {
    ganache: {
      url: "http://127.0.0.1:8545",
      accounts: [
        "0x74b1851ca5991bf8d4b52f77c134ceed36ff588f6c7669d8f3aa49a306a10ce7"
        // 👆 Replace this with a private key from Ganache
      ]
    },
  },
};
