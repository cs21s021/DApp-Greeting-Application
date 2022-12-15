const main = async () => {
    const greetContractFactory = await hre.ethers.getContractFactory("Greetme");
    const greetContract = await greetContractFactory.deploy({
      value: hre.ethers.utils.parseEther("0.1"),
    });
    await greetContract.deployed();
    console.log("Contract addy:", greetContract.address);
  
    let contractBalance = await hre.ethers.provider.getBalance(
      greetContract.address
    );
    console.log(
      "Contract balance:",
      hre.ethers.utils.formatEther(contractBalance)
    );
  
    /*
     * Let's try two greetings now
     */
    const greetTxn1= await greetContract.greet("Hello! Greeting #1");
    await greetTxn1.wait();
  
    const greetTxn2 = await greetContract.greet("Hello! Greeting #2");
    await greetTxn2.wait();
  
    contractBalance = await hre.ethers.provider.getBalance(greetContract.address);
    console.log(
      "Contract balance:",
      hre.ethers.utils.formatEther(contractBalance)
    );
  
    let allGreetings = await greetContract.getAllGreetings();
    console.log(allGreetings);
  };
  
  const runMain = async () => {
    try {
      await main();
      process.exit(0);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  };
  
  runMain();