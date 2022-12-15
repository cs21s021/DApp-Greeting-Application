import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./App.css";
import abi from "./utils/Greetme.json";


const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const contractAddress = "0x94474DeCD3942C03BF6AD5815Ed3158519D8a00b";

  const contractABI = abi.abi;
  const [allGreet, setAllGreet] = useState([]);
  const [message, setMessage] = useState('');



  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
        getAllGreetings();
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
  * Implement your connectWallet method here
  */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }

  /*
   * Create a method that gets all greetings from your contract
   */
const getAllGreetings = async () => {
  const { ethereum } = window;

  try {
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const greetingsContract = new ethers.Contract(contractAddress, contractABI, signer);
      const greetings = await greetingsContract.getAllGreetings();

      const greetingsCleaned = greetings.map(greet => {
        return {
          address: greet.greeter,
          timestamp: new Date(greet.timestamp * 1000),
          message: greet.message,
        };
      });

      setAllGreet(greetingsCleaned);
    } else {
      console.log("Ethereum object doesn't exist!");
    }
  } catch (error) {
    console.log(error);
  }
};

/**
 * Listen in for emitter events!
 */
useEffect(() => {
  let greetingsContract;

  const onNewGreeting = (from, timestamp, message) => {
    console.log("NewGreet", from, timestamp, message);
    setAllGreet(prevState => [
      ...prevState,
      {
        address: from,
        timestamp: new Date(timestamp * 1000),
        message: message,
      },
    ]);
  };

  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    greetingsContract = new ethers.Contract(contractAddress, contractABI, signer);
    greetingsContract.on("NewGreet", onNewGreeting);
  }

  return () => {
    if (greetingsContract) {
      greetingsContract.off("NewGreet", onNewGreeting);
    }
  };
}, []);

  const greet = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const greetingsContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await greetingsContract.getTotalGreetings();
        console.log("Retrieved total greet count...", count.toNumber());
        document.getElementById("greetCount").innerHTML = count.toNumber()
        /*
        * Execute the actual greetings from your smart contract
        */

        console.log("--->", message)
        const greetTxn = await 
          greetingsContract.greet(message, { gasLimit: 300000 });
        document.getElementById("greetTxnhash").innerHTML = "Mining .." + greetTxn.hash;

        console.log("Mining...", greetTxn.hash);

        await greetTxn.wait();
        document.getElementById("greetTxnhash").innerHTML = "Mined .." + greetTxn.hash;
        console.log("Mined -- ", greetTxn.hash);

        count = await greetingsContract.getTotalGreetings();
        document.getElementById("greetingsCount").innerHTML = count.toNumber()
        console.log("Retrieved total greet count...", count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }

    useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
         💎 Welcome to E-Greet space!💎
        </div>

        <div className="bio">
          It's festival time!!! 🥳🤩 Connect your Ethereum wallet and share your greetings with me!
        </div>
        <div className="mining">
          
        </div>

        <div class="content">
          <h3 class="animate-charcter"> Status</h3>  👉🏼<span id="greetTxnhash"></span>
        </div>
  
        <div className="mining">
          <h3 class="animate-charcter"> Greetings Count</h3>  👉🏼 <span id="greetCount"></span>

        </div>
        <input type="text" name="name" placeholder="Type your wishes here..." class="question" id="nme" required autocomplete="off" value={message} onChange={e => setMessage(e.target.value)} />
        
        <button class="greetButton" role="button" onClick={greet} > Greet Me</button>
        {!currentAccount && (
          <button className="greetButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
      
        <div class="container">
        {allGreet.map((greet, index) => {
          return (
            
            <div className="msgs" key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "9px" }}>
              <div>Address: {greet.address.substring(0,8)}...{greet.address.substring(38,)}</div>
              <div>Time: {greet.timestamp.toString()}</div>
              <div>Message: {greet.message}</div>
            </div>
            )
        })}
        </div>
      </div>
    </div>
  );
}

export default App