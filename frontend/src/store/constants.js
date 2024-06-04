import { Contract, providers } from "ethers";
import Constants from "../contracts/abi/Constants.abi.json";

export const state = {
    contract: null,
    withdrawalPeriodTime: 0
};

export const getters = {
    getwithdrawalPeriod(state) {
        return state.withdrawalPeriodTime;
    }
};

export const mutations = {
    setConstsContract(state, contract) {
        state.contract = contract;
    },
    setWithdrawalPeriod(state, period) {
        state.withdrawalPeriodTime = period;
    }
};

export const actions = {
    async createConstsContract({ rootState, commit, dispatch }, payload) {
        let provider = null;
        let signer = null;
        if (rootState.walletType === "metamask") {
            provider = new providers.Web3Provider(window.ethereum);
            signer = provider.getSigner(rootState.address);
        }
        if (rootState.walletType === "trustwallet") {
            provider = new providers.Web3Provider(window.ethereum);
            signer = provider.getSigner(rootState.address);
        }
        if (rootState.walletType === "wc") {
            console.log(rootState.walletconnect.wcProvider);
            // provider = new providers.JsonRpcProvider(
            //     rootState.network.networkOptions.rpcUrls[0]
            // );
            provider = new providers.Web3Provider(window.ethereum);

            signer = provider.getSigner(rootState.address);
        }
        const contract = new Contract(payload, Constants, signer);

        commit("setConstsContract", contract);

        dispatch("withdrawalPeriodTime");
    },

    async withdrawalPeriodTime({ state, commit }) {
        if (state.contract) {
            const time = await state.contract.withdrawalPeriodTime();
            commit("setWithdrawalPeriod", time.toNumber());
        }
    }
};

export const constants = {
    state,
    getters,
    mutations,
    actions
};
