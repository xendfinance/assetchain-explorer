import { ethers } from "ethers";

// import collectionAbi from "./collection.json";
import Staking from "./Staking.abi.json";
import Token from "./ERC20.abi.json";
import Multicall from "./Multicall.abi.json";

const collectionAbi = [...Staking, ...Token, ...Multicall];

const iface = new ethers.utils.Interface(collectionAbi);

export function parseArgs(data) {
    return iface.parseTransaction({ data }).args;
}

export function parseFunctionName(data) {
    return iface.parseTransaction({ data }).name;
}
