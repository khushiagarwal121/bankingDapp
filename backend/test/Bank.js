const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Bank Contract", function () {
  let bank;
  let owner, user;

  beforeEach(async function () {
    [owner, user] = await ethers.getSigners();

    const Bank = await ethers.getContractFactory("Bank");
    bank = await Bank.deploy();
    await bank.waitForDeployment();
  });

  it("should allow deposit and emit Deposited event", async function () {
    const depositAmount = ethers.parseEther("1");

    await expect(bank.connect(user).deposit({ value: depositAmount }))
      .to.emit(bank, "Deposited")
      .withArgs(user.address, depositAmount);

    const balance = await bank.balances(user.address);
    expect(balance).to.equal(depositAmount);
  });

  it("should return timeUntilWithdraw correctly", async function () {
    await bank.connect(user).deposit({ value: ethers.parseEther("1") });

    const timeLeft = await bank.timeUntilWithdraw(user.address);
    expect(timeLeft).to.be.gt(0);
  });

  it("should not allow early withdrawal", async function () {
    await bank.connect(user).deposit({ value: ethers.parseEther("1") });

    await expect(bank.connect(user).withdraw()).to.be.revertedWith(
      "Withdrawal locked for 1 day"
    );
  });

  it("should allow withdrawal after 1 day", async function () {
    const depositAmount = ethers.parseEther("1");
    await bank.connect(user).deposit({ value: depositAmount });

    // move time forward by 1 day
    await ethers.provider.send("evm_increaseTime", [86400]); // 1 day
    await ethers.provider.send("evm_mine");

    const initialBalance = await ethers.provider.getBalance(user.address);

    const tx = await bank.connect(user).withdraw();
    const receipt = await tx.wait();

    const finalBalance = await ethers.provider.getBalance(user.address);

    const gasUsed = receipt.gasUsed * receipt.gasPrice;
    expect(finalBalance).to.be.gt(initialBalance - gasUsed);
  });
});
