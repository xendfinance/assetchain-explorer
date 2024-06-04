import EthereumProvider from "@walletconnect/ethereum-provider";
const PROJECT_ID = "285bb7d745a906491988c13c70621e69";

export const state = {
    wcProvider: null
};

export const getters = {};

export const mutations = {
    setWCProvider(state, provider) {
        state.wcProvider = provider;
    }
};

export const actions = {
    async initProvider({ state, rootState, commit }) {
        const provider =
            state.wcProvider ??
            (await EthereumProvider.init({
                projectId: PROJECT_ID,
                showQrModal: true,
                chains: [rootState.network.chainId]
            }));

        commit("setWCProvider", provider);
    },
    async wcChainChanged({ state, rootState, dispatch }) {
        await dispatch("initProvider");
        state.wcProvider.on("chainChanged", () => {
            dispatch("chainCheckWC");
            if (!rootState.staking.contract) {
                dispatch("createContract");
            }
        });
    },
    async wcAccountsChanged({ state, rootState, dispatch, commit }) {
        await dispatch("initProvider");
        state.wcProvider.on("accountsChanged", function(accounts) {
            dispatch("emptyStakingStore");
            commit("setAddress", accounts[0]);

            dispatch("updateBalance");
            dispatch("chainCheckWC");
            if (!rootState.staking.contract) {
                dispatch("createContract");
            }
        });
    },
    async connectWalletConnect({ state, rootState, dispatch, commit }) {
        console.log("connecting");
        await dispatch("initProvider");

        await state.wcProvider.enable().catch(err => console.log(err));

        const accounts = await state.wcProvider.request({
            method: "eth_requestAccounts"
        });
        commit("setAddress", accounts[0]);
        commit("setWalletType", "wc");
        localStorage.setItem("autoconnect", true);
        localStorage.setItem("walletType", "wc");

        if (!rootState.staking.contract) {
            dispatch("createContract");
        }
        dispatch("chainCheckWC");
        dispatch("updateBalance");
    },
    async addChainWC({ state, rootState, dispatch }) {
        await dispatch("initProvider");

        const resp = await state.wcProvider.request({
            method: "wallet_addEthereumChain",
            params: [rootState.network.networkOptions]
        });
        console.log(resp);
    },
    async switchChainWC({ state, rootState, dispatch }) {
        console.log("switch wc");
        await dispatch("addChainWC");
        try {
            await state.wcProvider.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: parseInt(rootState.network.chainId) }]
            });
            // dispatch("chainCheckWC");
            dispatch("updateBalance");
            if (!rootState.staking.contract) {
                dispatch("createContract");
            }
            return true;
        } catch (switchError) {
            if (parseInt(switchError.code) === 4902) {
                dispatch("addChainWC");
            }
            console.error(switchError);
        }
    },
    async chainCheckWC({ state, rootState, commit, dispatch }) {
        if (state.wcProvider.isWalletConnect) {
            const address = state.wcProvider.accounts[0];
            const chainId = state.wcProvider.chainId;
            console.log(
                address,
                chainId,
                "parse",
                parseInt(rootState.network.chainId)
            );
            if (chainId !== parseInt(rootState.network.chainId)) {
                dispatch("switchChainWC");
            }
            commit("setChainId", chainId);
        }
    }
};

export const walletconnect = {
    state,
    getters,
    mutations,
    actions
};
