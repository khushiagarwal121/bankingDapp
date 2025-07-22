// scripts/deploy.js
const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with:", deployer.address);

  const Bank = await hre.ethers.getContractFactory("Bank");
  const bank = await Bank.deploy();

  await bank.waitForDeployment(); // ✅ Use this instead of bank.deployed()
  console.log("Bank deployed at:", await bank.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
