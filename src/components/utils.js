import Web3 from "web3";
import { Utils } from "alchemy-sdk";
import _ from "lodash";

export const loadWeb3 = async () => {
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum);
    await window.ethereum.enable();
  } else if (window.web3) {
    window.web3 = new Web3(window.web3.currentProvider);
  } else {
    window.alert("Non ethereum browser detected. You should consider Metamask!");
  }
};

export const formatEther = (balance, minimumFractionDigits = 0, maximumFractionDigits = 3) => {
  const num = Utils.formatEther(balance);
  return formatNumber(num, minimumFractionDigits, maximumFractionDigits);
};

export const formatToken = (balance, minimumFractionDigits = 0, maximumFractionDigits = 3) => {
    const num = Utils.formatEther(balance);
    return formatNumber(num, minimumFractionDigits, maximumFractionDigits);
  };

  
export const formatNumber = (num, minimumFractionDigits = 0, maximumFractionDigits = 0) => {
  return new Intl.NumberFormat("en-US", { minimumFractionDigits, maximumFractionDigits }).format(num);
};

export const valueTransaction = (web3, amount) => {
  return web3.utils.toWei(amount.toString(), "ether");
};
