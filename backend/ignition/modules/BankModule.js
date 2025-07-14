// This code creates a declarative deployment script using Hardhat Ignition — a newer way to deploy contracts safely and cleanly.
// Imports buildModule() from Hardhat Ignition.

// buildModule is a helper function to define what contract(s) should be deployed, and how.
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
// You're creating a deployment module named "BankModule".
// The second argument is a function that receives an object m (the deployment context).
module.exports = buildModule("BankModule", (m) => {
  // This line tells Hardhat to deploy the Bank contract.
  // [] is the array of constructor arguments — your Bank contract doesn’t have a constructor, so it’s empty.
  const bank = m.contract("Bank", []);
  // You're returning the deployed contract instance (bank) so other modules or scripts can use it (if needed).
  return { bank };
});
