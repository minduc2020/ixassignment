import React, { Component } from "react";

import { formatEther, formatToken } from "./utils";
class Main extends Component {
  render() {
    const { stakingBalance, balance, stakeTokens, pendingReward, tokenBalance, claimReward, unstakeTokens } = this.props;
    return (
      <div id="content" className="mt-3">
        <table className="table text-muted text-center">
          <thead>
            <tr style={{ color: "white" }}>
              <th scope="col">ETH Balance</th>
              <th scope="col">Staking Balance</th>
              <th scope="col">Reward Balance</th>
              <th scope="col">Token Balance</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ color: "white" }}>
              <td>{formatEther(balance)} ETH</td>
              <td>{formatEther(stakingBalance)} ETH</td>
              <td>{formatToken(pendingReward)} Token</td>
              <td>{formatToken(tokenBalance)} Token</td>
            </tr>
          </tbody>
        </table>
        <div className="card mb-2" style={{ opacity: ".9" }}>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              let amount;
              amount = this.input.value.toString();
              stakeTokens(amount);
            }}
            className="mb-3"
          >
            <div style={{ borderSpacing: "0 1em" }}>
              <label className="float-left" style={{ marginLeft: "15px" }}>
                <b>Stake Tokens</b>
              </label>

              <div className="input-group mb-4">
                <input
                  ref={(input) => {
                    this.input = input;
                  }}
                  type="text"
                  value="0.001"
                  placeholder="0"
                  required
                />
                <div className="input-group-open">
                  <div className="input-group-text">ETH</div>
                </div>
              </div>
              <button type="submit" className="btn btn-primary btn-lg btn-block">
                DEPOSIT
              </button>
            </div>
          </form>
          <button
            type="submit"
            onClick={(event) => {
              event.preventDefault(unstakeTokens());
            }}
            className="btn btn-primary btn-lg btn-block"
          >
            WITHDRAW
          </button>
          <button
            type="submit"
            onClick={(event) => {
              event.preventDefault(claimReward());
            }}
            className="btn btn-primary btn-lg btn-block"
          >
            Claim Reward
          </button>
        </div>
      </div>
    );
  }
}

export default Main;
