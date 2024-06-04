const CHAIN_ID_TEST = process.env.VUE_APP_CHAIN_ID;
const CHAIN_ID_HEX_TEST = `0x${Number(CHAIN_ID_TEST).toString(16)}`;
const CHAIN_ID_MAIN = 42420;
const CHAIN_ID_HEX_MAIN = `0x${Number(CHAIN_ID_MAIN).toString(16)}`;

const networkOptionsTest = {
    chainId: CHAIN_ID_HEX_TEST,
    chainName: "Asset Chain Testnet",
    nativeCurrency: {
        name: "Asset Chain Testnet",
        symbol: "RWA",
        decimals: 18
    },
    rpcUrls: [process.env.VUE_APP_RPC],
    blockExplorerUrls: [process.env.VUE_APP_EXPLORER_TESTNET]
};
const networkOptionsMain = {
    chainId: CHAIN_ID_HEX_MAIN,
    chainName: "Asset Chain",
    nativeCurrency: {
        name: "Asset Chain",
        symbol: "RWA",
        decimals: 18
    },
    rpcUrls: [process.env.VUE_APP_RPC],
    blockExplorerUrls: [process.env.VUE_APP_EXPLORER_MAINNET]
};

export const state = {
    test: process.env.VUE_APP_TYPE === "testnet",
    chainId: CHAIN_ID_TEST,
    chainIdHex: CHAIN_ID_HEX_TEST,
    networkOptions:
        process.env.VUE_APP_TYPE === "testnet"
            ? networkOptionsTest
            : networkOptionsMain,
    explorerTestnet: process.env.VUE_APP_EXPLORER_TESTNET,
    explorerMainnet: process.env.VUE_APP_EXPLORER_MAINNET
};
export const getters = {
    isTestMode(state) {
        return state.test;
    },
    networkOptions(state) {
        return state.networkOptions;
    },
    providerLink(state) {
        return state.networkOptions.rpcUrls[0];
    },
    explorerTestnet(state) {
        return state.explorerTestnet;
    },
    explorerMainnet(state) {
        return state.explorerMainnet;
    }
};
export const mutations = {
    setTestMode(state, mode) {
        state.test = mode;
    },
    setStand(state, networkOptions) {
        state.networkOptions = networkOptions;
    },
    setChainId(state, chainId) {
        state.chainId = chainId;
    },
    setChainIdHex(state, chainId) {
        state.chainIdHex = chainId;
    }
};
export const actions = {
    changeStandMain({ commit, dispatch }) {
        commit("setStand", networkOptionsMain);
        commit("setTestMode", false);
        commit("setChainId", CHAIN_ID_MAIN);
        commit("setChainIdHex", CHAIN_ID_HEX_MAIN);

        const walletType = localStorage.getItem("walletType");

        if (walletType === "metamask") {
            dispatch("switchChain");
        }
        // if (walletType === "trustwallet") {
        // }
        // if (walletType === "wc") {
        // }
    },
    changeStandTest({ commit, dispatch }) {
        commit("setStand", networkOptionsTest);
        commit("setTestMode", true);
        commit("setChainId", CHAIN_ID_TEST);
        commit("setChainIdHex", CHAIN_ID_HEX_TEST);

        const walletType = localStorage.getItem("walletType");

        if (walletType === "metamask") {
            dispatch("switchChain");
        }
        // if (walletType === "trustwallet") {
        // }
        // if (walletType === "wc") {
        // }
    }
};

export const network = {
    state,
    getters,
    mutations,
    actions
};
