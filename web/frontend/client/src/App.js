import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./getWeb3";

import "./App.css";

const myStyle = {
  color: "Black",
  backgroundColor: "white",
  padding: "10px",
  fontFamily: "Sans-Serif",
  
};


class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { accounts, contract } = this.state;

    const unite=document.getElementById("input").value;
    await contract.methods.set(unite).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();

    // Update state with the result.
    this.setState({ storageValue: response });
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
    
      <div className="App">
        <section>
        <h1 align="left" style={myStyle}>PHARMA DAPP</h1>
        <hr></hr>
        <h2 align="left" style={myStyle}>Manufacturer</h2>
        
        </section>
    
        
        <section className="picture">
        <div className="mainHeading">
          <h1 className="heading">Medicine ID: 1</h1>
          <div className="unitDisplay">Current Units: {this.state.storageValue}</div>
          <div className="input">
          <input type="text" id="input" className="iput-1"></input>
          </div>
          <div>
          <button type="submit" onClick={this.runExample} className="button-1">Add Units</button>
        </div>
        </div>
    </section>
       
      </div>
    );
  }
}

export default App;
