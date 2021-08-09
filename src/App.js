import React, { useEffect, useState } from "react";
import FinalTokenabi from "./contracts/FinalToken.json";
import Web3 from "web3";
import Navbar from "./Navbar";

const App = () => {

  

  const [refresh, setrefresh] = useState(0);

  let content;
  const [loading2, setloading2] = useState(false);

  const [account, setAccount] = useState("");
  const [loading, setLoading] = useState(true);
  const [FinalToken, setFinalToken] = useState({});

  const [TokenName, setTokenName] = useState ("");
  const [TokenSymbol, setTokenSymbol] = useState ("");
  const [TokenDecimal, setTokenDecimal] = useState ("");
  const [BalanceOfUser, setBalanceOfUser] = useState ("");
  const [DevTokenTransferInstance, setDevTokenTransferInstance] = useState({});
  const [inputFieldChange, setinputFieldChange] = useState(0);

  const loadWeb3 = async () => {
    if (window.ethereum) {
      await window.ethereum.enable();
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  };

  const loadBlockchainData = async () => {
    setLoading(true);
    if (
      typeof window.ethereum == "undefined" 
    ) {
      return;
    }
    const web3 = new Web3(window.ethereum);

    const accounts = await web3.eth.getAccounts();
    
    if (accounts.length === 0) {
      return;
    }
    setAccount(accounts[0]); 
    const networkId = await web3.eth.net.getId();
    const networkData = FinalTokenabi.networks[networkId];
    
    
    if (networkId === 42) {   

      const FinalToken = new web3.eth.Contract(FinalToken.abi,networkData.address);
      setFinalToken(FinalToken)
      //name
      const nameOfToken = await FinalToken.methods.name().call();
      setTokenName(nameOfToken)
      //decimal
      const decimalOfToken = await FinalToken.methods.decimal().call();
      setTokenDecimal(decimalOfToken)
      console.log(decimalOfToken)
      //symbol
      const symbolOfToken = await FinalToken.methods.symbol().call();
      setTokenSymbol(symbolOfToken)
      console.log(symbolOfToken)
      //totalSupply
      let totalSupplyOfToken = await FinalToken.methods.totalSupply().call();
      const totalSupplyOfTokenInDecimals = await web3.utils.fromWei(totalSupplyOfToken, 'ether');
      console.log(totalSupplyOfTokenInDecimals)
      console.log(totalSupplyOfToken)
      console.log(nameOfToken)
      console.log(FinalToken)

      const balanceOfUser = await FinalToken.methods.balanceOf(accounts[0]);
      setBalanceOfUser(BalanceOfUser)
      const balanceOfUserInWei = await web3.utils.fromWei(balanceOfUser, 'ether');
      console.log(balanceOfUserInWei)
      console.log(balanceOfUser)

      const transferContract = new web3.eth.Contract(FinalToken.abi,"0xfa5D2be1173123DCEDd64d1Fccbeb8cfB2b71c98"); 
      const devTokenTransfer = await transferContract.methods.transferFrom().call();
      setDevTokenTransferInstance(devTokenTransfer)
      console.log(devTokenTransfer)
      //const FinalToken = new web3.eth.Contract(FinalTokenabi.abi, networkData.address);
     // setFinalToken(FinalToken)
      
      setLoading(false);
    } else {
      window.alert("the contract not deployed to detected network.");
      setloading2(true);
    }
  };

  
  const changeInpitField = (e) => {
    setinputFieldChange(e.target.value);
  }

  const onSubmit = async () => {
    if(parseFloat(inputFieldChange) > 0) {
      await sendToken(inputFieldChange)
    }else{
      window.alert("null value not allowed")
    }
  }


  const sendToken = async (a) => {
    const web3 = new Web3(window.ethereum);
    
    const amountOfEthWei = await web3.utils.toWei(a.toString())
    await DevTokenTransferInstance
    .methods
    .transferFrom()
    .send({from:account, value: amountOfEthWei})
      .once("recepient", (recepient) => {
        console.log("Success");
      }) 
      .on("error", () => {
        window.alert("error")
      })
    // const web3 = new Web3(window.web3);
    // await FinalToken.methods
    //   .setCompleted(a.toString())
    //   .send({ from: account })
    //   .once("recepient", (recepient) => {
    //     console.log("success");
    //   })
    //   .on("error", () => {
    //     console.log("error");
    //   });
  };

  const walletAddress = async () => {
    await window.ethereum.request({
      method: "eth_requestAccounts",
      params: [
        {
          eth_accounts: {},
        },
      ],
    });
    window.location.reload();
  };

  useEffect(() => {
    loadWeb3();
    loadBlockchainData();

    if (refresh == 1) {
      setrefresh(0);
      loadBlockchainData();
    }
    //esl
  }, [refresh]);

  if (loading === true) {
    content = (
      <p className="text-center">
        Loading...{loading2 ? <div>loading....</div> : ""}
      </p>
    );
  } else {
    content = (
      <div class="container">
        <main role="main" class="container">
          <div class="jumbotron">
            <h1>Coin DB Faucet</h1>
            <div className="row" style={{ paddingTop: "30px" }}>
              {" "} 
              <div className="row" style={{ paddingLeft: "40px" }}>
                <h3>Welcome to {TokenName} faucet, we give you test tokens to add your wallet. please enter your wallet address</h3>
              </div>
              <br></br>
              <div className="row" style={{ paddingLeft: "40px" }}>
                <h3>Coin {TokenSymbol}</h3>
              </div>
              <br></br>
              <div className="row" style={{ paddingLeft: "40px" }}>
                <h3>Coin balance in the account {BalanceOfUser}</h3>
              </div>
              <div className="row" style={{ paddingLeft: "40px" }}>
                <input value="0"
                 placeholder="Add your address "
                 value={inputFieldChange} />
                onChange={changeInpitField}
                <button className="btn btn-secondary" onClick={onSubmit} >Get Token</button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div>
      <Navbar account={account} />

      {account == "" ? (
        <div className="container">
          {" "}
          Connect your wallet to application{"   "}{" "}
          <button onClick={walletAddress}>metamask</button>
        </div>
      ) : (
        content
      )}
      {/* {content} */}
    </div>
  );
};

export default App;
