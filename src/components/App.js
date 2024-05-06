import React, { Component } from "react";
import Navbar from "./Navbar";
// import Web3 from "web3";
import "./App.css";
import Main from "./Main";
import ParticleSettings from "./ParticleSettings";
// import { util } from "chai";

// Smart contract ABI
import Stake from "../truffle_abis/ixswap/staking.abi.json";
import erc20Token from "../truffle_abis/ixswap/erc20.abi.json";

import { loadWeb3, valueTransaction } from "./utils";
import { getAddressBalance, defaultTransParams, defaultSendTransParams } from "./alchemy";
class App extends Component {
  async componentWillMount() {
    await loadWeb3();
    await this.loadBlockchainData();
  }

  async loadBlockchainData() {
    const web3 = window.web3;
    this.setState({ web3 });

    await this._loadAccount(web3);

    console.log("🚀 ~ App ~ loadBlockchainData ~ this.state.accounts[0]:", this.state.account);

    const balance = await getAddressBalance(this.state.account);
    this.setState({ balance: balance.toString() });

    //Load Staking smart contract
    await this._loadContractStaking(web3);
    //Load Token smart contract
    await this._loadContractToken(web3);

    this.setState({ loading: false });
  }

  async _loadAccount(web3) {
    const accounts = await web3.eth.getAccounts();
    console.log(accounts);
    this.setState({ account: accounts[0] });
  }

  // ■■■ ERC20 Token Smart contract ■■■
  async _loadTokenBalance() {
    let tokenBalance = await this.state.contractToken.methods.balanceOf(this.state.account).call();
    console.log("🚀 ~ App ~ _loadTokenBalance ~ tokenBalance:", tokenBalance);
    this.setState({ tokenBalance: tokenBalance.toString() });
    return tokenBalance;
  }

  async _loadContractToken(web3) {
    console.log("🚀 ~ App ~ _loadIXSwapToken ~ contractStake:", erc20Token);
    const contractToken = new web3.eth.Contract(erc20Token.abi, erc20Token.address, defaultTransParams());
    this.setState({ contractToken });
    // Load contract info
    Promise.all([this._loadTokenBalance()]);
    // window.alert("Token smart contract not deployed to detect network");
  }

  // ■■■ Staking Smart contract ■■■
  async _loadPendingReward() {
    let pendingReward = await this.state.contractStake.methods.getPendingReward(this.state.account).call();
    console.log("🚀 ~ App ~ _loadPendingReward ~ pendingReward:", pendingReward);
    this.setState({ pendingReward: pendingReward.toString() });
    return pendingReward;
  }

  async _loadStakingBalance() {
    let stakingBalance = await this.state.contractStake.methods.stakingBalance(this.state.account).call();
    console.log("🚀 ~ App ~ _loadStakingBalance ~ stakingBalance:", stakingBalance);
    this.setState({ stakingBalance: stakingBalance.toString() });
    return stakingBalance;
  }

  async _loadStakingInfo() {
    Promise.all([this._loadPendingReward(), this._loadStakingBalance()]);
  }

  async _loadContractStaking(web3) {
    console.log("🚀 ~ App ~ _loadIXSwapStaking ~ contractStake:", Stake);
    const contractStake = new web3.eth.Contract(Stake.abi, Stake.address, defaultTransParams());
    this.setState({ contractStake });
    // Load contract info
    await this._loadStakingInfo();
    // window.alert("Staking smart contract not deployed to detect network");
  }

  stakeTokens = async (amount) => {
    const web3 = this.state.web3;
    const txTrans = {
      to: this.state.contractStake._address,
      value: valueTransaction(web3, amount),
      ...(await defaultSendTransParams(this.state.account)),
    };
    // Stake / Deposit ETH to Stake smart contract
    web3.eth
      .sendTransaction(txTrans)
      .on("transactionHash", (hash) => {
        this.setState({ loading: false });
      })
      .on("receipt", console.log)
      .on("confirmation", async (confirmationNumber, receipt) => {
        console.log("confirmationNumber: ", confirmationNumber);
        console.log("receipt: ", receipt);
        await this._loadAllBalance();
      })
      .on("error", console.error);
  };

  unstakeTokens = async () => {
    this.setState({ loading: true });
    this.state.contractStake.methods
      .unstake()
      .send(await defaultSendTransParams(this.state.account))
      .on("transactionHash", (hash) => {
        this.setState({ loading: false });
      })
      .on("confirmation", async (confirmationNumber, receipt) => {
        console.log("confirmationNumber: ", confirmationNumber);
        console.log("receipt: ", receipt);
        await this._loadAllBalance();
      })
      .on("error", console.error);
  };

  claimReward = async () => {
    // Claim reward from Stake smart contract
    this.state.contractStake.methods
      .claimReward()
      .send(await defaultSendTransParams(this.state.account))
      .on("transactionHash", (hash) => {
        this.setState({ loading: false });
      })
      .on("confirmation", async (confirmationNumber, receipt) => {
        console.log("confirmationNumber: ", confirmationNumber);
        console.log("receipt: ", receipt);
        await this._loadAllBalance();
      })
      .on("error", console.error);
  };

  async _loadAllBalance() {
    Promise.all([this._loadStakingInfo(), this._loadTokenBalance()]);
  }

  constructor(props) {
    super(props);
    this.state = {
      web3: null,
      account: "0x0",
      tether: {},
      rwd: {},
      contractStake: {},
      contractToken: {},

      balance: "0",
      stakingBalance: "0",
      pendingReward: "0",
      tokenBalance: "0",

      loading: false,
    };
  }

  render() {
    let content;

    {
      this.state.loading
        ? (content = (
            <p id="loader" className="text-center" style={{ color: "white", margin: "30px" }}>
              LOADING PLEASE...
            </p>
          ))
        : (content = (
            <Main
              balance={this.state.balance}
              stakingBalance={this.state.stakingBalance}
              pendingReward={this.state.pendingReward}
              tokenBalance={this.state.tokenBalance}
              claimReward={this.claimReward}
              stakeTokens={this.stakeTokens}
              unstakeTokens={this.unstakeTokens}
              // releaseReward={this.contractStake}
            />
          ));
    }

    return (
      <div className="App" style={{ position: "relative" }}>
        <div style={{ position: "absolute" }}>
          <ParticleSettings />
        </div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: "600px" }} style={{ minHeight: "100vm" }}>
              <div>{content}</div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
