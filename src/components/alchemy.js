import { Network, Alchemy, Utils } from "alchemy-sdk";

// Optional Config object, but defaults to demo api-key and eth-mainnet.
const settings = {
  // ETH_SEPOLIA
  apiKey: "TtDW98sqZiIB1mVbmSdX7-AEGPnkp8Tz",
  network: Network.ETH_SEPOLIA,
};

const alchemy = new Alchemy(settings);

// alchemy.core.getTokenBalances("0x3f5CE5FBFe3E9af3971dD833D26bA9b5C936f0bE").then(console.log);

export const getAddressBalance = async (address) => {
  try {
    let balance = await alchemy.core.getBalance(address, "latest");
    console.log(`Balance of ${address}: ${balance} ETH`);
    return balance;
  } catch (error) {
    console.error("Error getAddressBalance:", error);
  }
};

export const getGasPrice = async () => {
  try {
    return await alchemy.core.getGasPrice();
  } catch (error) {
    console.error("Error getGasPrice:", error);
  }
};

export const defaultTransParams = async () => {
  let gasPrice = await getGasPrice();
  return { gas: 51000, gasPrice };
};

export const defaultSendTransParams = async (address) => {
  //   return { from: address, ...defaultTransParams() };
  return { from: address };
};
