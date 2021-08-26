import React, { Component } from "react";
import ProfilePicture from "./contracts/ProfilePicture.json";
import getWeb3 from "./getWeb3";
import ipfsClient from "./ipfs";

import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ipfsHash: "",
      web3: undefined,
      file: undefined,
      accounts: undefined,
      profilePictureContract: undefined,
    };
    this.captureFile = this.captureFile.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = ProfilePicture.networks[networkId];
      const profilePictureContract = new web3.eth.Contract(
        ProfilePicture.abi,
        deployedNetwork && deployedNetwork.address
      );

      console.log(profilePictureContract);
      const ipfsHash = await profilePictureContract.methods.userImages(accounts[0]).call();
      console.log("retrived hash", ipfsHash)
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ ipfsHash, web3, accounts, profilePictureContract });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  captureFile(event) {
    event.preventDefault();
    const file = event.target.files[0];
    this.setState({ file });
    // const reader = new window.FileReader()
    // reader.readAsArrayBuffer(file)
    // reader.onloadend = () => {
    //   this.setState({ buffer: Buffer(reader.result) })
    //   console.log('buffer', this.state.buffer)
    // }
  }

  async onSubmit(event) {
    event.preventDefault();

    const ipfsResponse = await ipfsClient.add(this.state.file);
    const ipfsHash = ipfsResponse.path;

    this.setState({ ipfsPath: ipfsHash });

    console.log("metadata", ipfsResponse);

    console.log(this.profilePictureContract);

    const etheriumResponse = await this.state.profilePictureContract.methods
      .mint(ipfsHash)
      .send({
        from: this.state.accounts[0],
      });

    console.log(etheriumResponse);
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
          <a href="#" className="pure-menu-heading pure-menu-link">
            IPFS File Upload DApp
          </a>
        </nav>

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h1>Your Image</h1>
              <p>This image is stored on IPFS & The Ethereum Blockchain!</p>
              <img
                src={`https://ipfs.infura.io/ipfs/${this.state.ipfsHash}`}
                alt=""
              />
              <h2>Upload Image</h2>
              <form onSubmit={this.onSubmit}>
                <input type="file" onChange={this.captureFile} />
                <input type="submit" />
              </form>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App;
