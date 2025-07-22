require("@nomicfoundation/hardhat-toolbox");
// require("@nomicfoundation/hardhat-ignition"); // required for Ignition

module.exports = {
  solidity: "0.8.28",
  defaultNetwork: "ganache", // optional but good to have
  networks: {
    ganache: {
      url: "http://127.0.0.1:8545",
      accounts: [
        "0x9575ea61684cfb44db7a11cc2833c04e81d85a30be01fa4d76f8e886cd35b044"
        // 👆 Replace this with a private key from Ganache
      ]
    },
  },
};
