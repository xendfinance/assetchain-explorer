import Contract from "web3-eth-contract";
import Staking from "./abi/Staking.abi.json";

Contract.setProvider(window.ethereum);

export const stakingCreate = address => new Contract(Staking, address);
