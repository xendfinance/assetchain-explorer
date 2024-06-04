import { Contract, providers, BigNumber } from "ethers";
import { toBigNumberFloat } from "@/utils/big-number.js";
import Staking from "../contracts/abi/Staking.abi.json";
import { toHex, toInt, formatStringFloat } from "../utils/big-number";
import { safeWrite } from "../utils/safe";
import { ERR_MSG } from "./dialogs";
// import { stakingCreate } from "../contracts/staking";

const STAKING_ADDRESS = process.env.VUE_APP_STAKING_ADDRESS;

export const state = {
    contract: null,
    constsAddress: "",
    totalSupply: "",
    totalActiveStakes: 0,
    signer: null,
    stakes: [],
    loadingStakes: false,
    validatorsIDs: [],
    lastValidatorID: "",
    requests: [],
    rewards: []
};

// const overrides = {
//     chainId: process.env.VUE_APP_CHAIN_ID
// };

export const getters = {
    getTotalSupply(state, _rootState, index) {
        const totalSupply =
            toInt(state.totalSupply) - toInt(index.zeroAccBalance);

        return toHex(totalSupply);
    },
    getTotalActiveStakes(state) {
        return state.totalActiveStakes;
    },
    validatorsIDs(state) {
        return state.validatorsIDs;
    },
    getLoadingStakes(state) {
        return state.loadingStakes;
    },

    getStakes(state) {
        return state.stakes.map(s => {
            return {
                id: s.validatorId,
                stakingName: "RWA",
                validator: s.validatorId,
                amount: formatStringFloat(s.stakeAmount.toString(), 18, 6),
                rewards: formatStringFloat(s.rewards.toString(), 18, 4),
                action: "unstake",
                claim: "Claim rewards"
            };
        });
    },
    filteredUserStakes(state, getters) {
        return getters.getStakes.filter(s =>
            Boolean(Number(s.amount) || Boolean(Number(s.rewards)))
        );
    },
    filteredRequsest(state) {
        let concatReq = [];
        state.requests.map(r => (concatReq = [...concatReq, ...r]));
        return concatReq;
    }
};

export const mutations = {
    setContract(state, contract) {
        state.contract = contract;
    },
    setTotalActiveStakes(state, totalActiveStakes) {
        state.totalActiveStakes = totalActiveStakes;
    },
    setTotalSupply(state, totalSupply) {
        state.totalSupply = totalSupply;
    },
    setSigner(state, signer) {
        state.signer = signer;
    },
    setConstsAddress(state, constsAddress) {
        state.constsAddress = constsAddress;
    },

    setLastValidator(state, lastValidatorID) {
        state.lastValidatorID = lastValidatorID;
    },
    setValidatorID(state, validatorID) {
        state.validatorsIDs.push(validatorID);
    },
    setEmptyValidatorIDs(state) {
        state.validatorsIDs = [];
    },
    setLoadingStakes(state, loading) {
        state.loadingStakes = loading;
    },
    setStake(state, stake) {
        state.stakes.push(stake);
    },
    setStakes(state, stakes) {
        state.stakes = stakes;
    },
    setEmptyRequest(state) {
        state.requests = [];
    },
    setRequest(state, request) {
        state.requests.push(request);
    }
};

export const actions = {
    async createContract({ rootState, commit, dispatch }) {
        let provider = null;
        let signer = null;
        let contract = null;
        if (rootState.address) {
            if (rootState.walletType === "metamask") {
                provider = new providers.Web3Provider(window.ethereum);
                signer = provider.getSigner(rootState.address);
            }
            if (rootState.walletType === "trustwallet") {
                provider = new providers.Web3Provider(window.ethereum);
                signer = provider.getSigner(rootState.address);
            }
            if (rootState.walletType === "wc") {
                provider = new providers.Web3Provider(window.ethereum);
                signer = provider.getSigner(rootState.address);
            }
            contract = new Contract(STAKING_ADDRESS, Staking, signer);
        } else {
            provider = new providers.JsonRpcProvider(
                rootState.network.networkOptions.rpcUrls[0]
            );
            contract = new Contract(STAKING_ADDRESS, Staking, provider);
        }
        const lastValidator = await contract.lastValidatorID();

        commit("setLastValidator", lastValidator.toNumber());

        commit("setContract", contract);
        commit("setTotalStake", staking.state.totalActiveStakes);

        dispatch("getConstsAddress");
        dispatch("getValidatorsIDs");
        dispatch("getTotalActiveStakes");
    },

    async getTotalActiveStakes({ commit, rootState }) {
        const provider = new providers.JsonRpcProvider(
            rootState.network.networkOptions.rpcUrls[0]
        );
        const contract = new Contract(STAKING_ADDRESS, Staking, provider);
        const totalActiveStakes = await contract.totalActiveStake();
        commit("setTotalActiveStakes", totalActiveStakes);
        commit("setTotalStake", totalActiveStakes);
    },

    async getConstsAddress({ rootState, state, commit, dispatch }) {
        const address = await state.contract.constsAddress();
        commit("setConstsAddress", address);

        if (!rootState.constants.contract) {
            dispatch("createConstsContract", address);
        }
    },
    async getValidatorsIDs({ state, rootState, commit, dispatch }) {
        commit("setLoadingStakes", true);
        if (state.contract) {
            const getValidator = async id =>
                await state.contract.getValidator(id);

            const getStakeValue = async id =>
                await state.contract.getStake(rootState.address, id);

            const getRewards = async id =>
                await state.contract.pendingRewards(rootState.address, id);

            commit("setEmptyValidatorIDs");
            commit("setStakes", []);
            if (state.lastValidatorID && !state.validatorsIDs.length) {
                for (let i = 1; i <= Number(state.lastValidatorID); i++) {
                    const validator = await getValidator(i);

                    if (
                        Number(validator.status) === 0 &&
                        Number(validator.createdTime)
                    ) {
                        commit("setValidatorID", i);

                        // set stakes
                        if (rootState.address) {
                            const rewardValue = await getRewards(i);
                            const stakeValue = await getStakeValue(i);
                            commit("setStake", {
                                validatorId: i,
                                stakeAmount: stakeValue,
                                rewards: rewardValue
                            });
                        }
                    }
                }
            }
        }
        commit("setLoadingStakes", false);
        commit("setEmptyRequest");
        dispatch("getWrRequests");
    },
    async getWrRequests({ state, rootState, commit }) {
        state.validatorsIDs.forEach(async v => {
            let isFound = false;
            let offset = 0;
            let limit = 10;
            let wrReq = [];
            while (!isFound) {
                const req = await state.contract.getWrRequests(
                    rootState.address,
                    v,
                    offset,
                    limit
                );
                // console.log(req);
                if (!req) {
                    isFound = true;
                    return;
                }

                if (req.length) {
                    req.map((r, idx) => {
                        if (Number(r.time)) {
                            const item = {
                                dateUnstaking: r.time,
                                epoch: r.epoch,
                                amount: r.amount
                            };
                            wrReq.push({
                                ...item,
                                wrId: idx + offset,
                                validator: v
                            });
                        }
                    });
                }

                if (Number(req[req.length - 1].time) === 0) {
                    isFound = true;
                } else if (Number(req[req.length - 1].time) > 0) {
                    offset = offset + limit;
                } else isFound = true;
            }
            offset = 0;
            commit("setRequest", wrReq);
        });
    },
    // write functions
    async delegate({ state, dispatch }, payload) {
        dispatch("setDialogLoading", true);
        dispatch("setEmptyMsg");

        const delegate = toBigNumberFloat(payload.delegate);

        try {
            const [tx] = await safeWrite(
                state.contract.delegate(payload.toValidatorID, {
                    value: BigNumber.from(delegate)
                    // overrides
                })
            );

            dispatch("setDialogLoading", false);
            dispatch("setSuccessMsg", `${tx.hash}`);
            dispatch("getValidatorsIDs");
            dispatch("updateBalance");
            return tx;
        } catch (err) {
            console.log(err);
            dispatch("setErrorMsg");
            dispatch("setDialogLoading", false);
            return ERR_MSG;
        }
    },
    async undelegate({ state, dispatch }, payload) {
        dispatch("setDialogLoading", true);
        dispatch("setEmptyMsg");

        // const provider = new providers.Web3Provider(window.ethereum);
        // const signer = provider.getSigner(rootState.address);

        // const contract = new Contract(STAKING_ADDRESS, Staking, signer);
        if (state.contract) {
            const amount = toBigNumberFloat(payload.amount);

            try {
                const [tx] = await safeWrite(
                    state.contract.undelegate(payload.toValidatorID, amount)
                    // overrides
                );

                dispatch("setSuccessMsg", `${tx.hash}`);
                dispatch("setDialogLoading", false);
                dispatch("getValidatorsIDs");
                dispatch("updateBalance");
            } catch (err) {
                console.log(err);
                dispatch("setErrorMsg");
                dispatch("setDialogLoading", false);
                return ERR_MSG;
            }
        }
    },
    async claimRewards({ state, dispatch }, payload) {
        dispatch("setDialogLoading", true);
        dispatch("setEmptyMsg");

        if (state.contract) {
            try {
                const [tx] = await safeWrite(
                    state.contract.claimRewards(payload.toValidatorID)
                    // overrides
                );

                dispatch("setSuccessMsg", `${tx.hash}`);
                dispatch("setDialogLoading", false);
                dispatch("getValidatorsIDs");
            } catch (err) {
                console.log(err);
                dispatch("setErrorMsg");
                dispatch("setDialogLoading", false);
                return ERR_MSG;
            }
        }
    },
    async withdraw({ state, dispatch }, payload) {
        dispatch("setDialogLoading", true);
        dispatch("setEmptyMsg");

        if (state.contract) {
            try {
                const [tx] = await safeWrite(
                    state.contract.withdraw(payload.toValidatorID, payload.wrId)
                    // overrides
                );

                dispatch("setSuccessMsg", `${tx.hash}`);
                dispatch("setDialogLoading", false);
                dispatch("getValidatorsIDs");
            } catch (err) {
                console.log(err);
                dispatch("setErrorMsg");
                dispatch("setDialogLoading", false);
                return ERR_MSG;
            }
        }
    }
};

export const staking = {
    state,
    getters,
    mutations,
    actions
};
