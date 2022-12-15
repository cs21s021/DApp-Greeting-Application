const main = async () => {
  const greetContractFactory = await hre.ethers.getContractFactory("Greetme");
  const greetContract = await greetContractFactory.deploy({
    value: hre.ethers.utils.parseEther("0.001"),
  });

  await greetContract.deployed();

  console.log("Greetme Space address: ", greetContract.address);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runMain();