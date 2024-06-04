import Vue from "vue";
import Vuex from "vuex";
import VuexPersist from "vuex-persist";
// import WalletConnectProvider from "@walletconnect/web3-provider";
import { providers, BigNumber } from "ethers";
import { staking } from "./staking";
import { trustwallet } from "./trustwallet";
import { walletconnect } from "./walletconnect";
import { network } from "./network";
import { vctoken } from "./vctoken";
import { constants } from "./constants";
import { dialogs } from "./dialogs";
import { getCirculation, getPrice } from "../plugins/axios/base-api";

Vue.use(Vuex);

const vuexPlugins = [];

const vuexLocalStorage = new VuexPersist({
    // The key to store the state on in the storage provider.
    key: "vuex-xend-explorer",
    storage: window.localStorage,
    asyncStorage: false,
    // Function that passes the state and returns the state with only the Objects you want to store.
    reducer: _state => ({
        darkMode: _state.darkMode,
        address: _state.address
    })
});

vuexPlugins.push(vuexLocalStorage.plugin);

export const store = new Vuex.Store({
    plugins: vuexPlugins,

    state: {
        breakpoints: {},
        provider: null,
        walletType: "",
        balance: BigNumber.from(0),
        zeroAccBalance: "",
        tokenPrice: 0,
        tokenChange: 0,
        totalStake: 0,
        marketCap: 0,
        circulation: 0,
        symbol: "RWA",
        gasPrice: 0,
        darkMode: true,
        address: "",
        chainId: "",
        counter: 0,
        inputData: ""
    },
    getters: {
        shortAddress(state) {
            return `${state.address.slice(0, 5)}...${state.address.slice(
                37,
                42
            )}`;
        },
        walletAddress(state) {
            return state.address;
        },
        balance(state) {
            return state.balance;
        },
        symbol(state) {
            return state.symbol;
        },
        inputData(rootState) {
            return rootState.inputData;
        },
        zeroAccBalance(rootState) {
            return rootState.zeroAccBalance;
        },
        chainId(rootState) {
            return rootState.chainId;
        }
    },
    mutations: {
        addCounter(_state) {
            _state.counter = _state.counter + 1;
        },
        setCounter(_state, _counter) {
            _state.counter = _state.counter = _counter;
        },
        setProvider(_state, _provider) {
            _state.provider = _provider;
        },
        setBalance(_state, _balance) {
            _state.balance = _balance;
        },
        setZeroAccBalance(_state, _balance) {
            _state.zeroAccBalance = _balance;
        },
        setWalletType(_state, _type) {
            _state.walletType = _type;
        },
        /**
         * @param {object} _state
         * @param {object} _breakpoint
         */
        setBreakpoint(_state, _breakpoint) {
            _state.breakpoints = {
                ..._state.breakpoints,
                ...{ [_breakpoint.code]: _breakpoint }
            };
        },

        /**
         * @param {object} _state
         * @param {number} _tokenPrice
         */
        setTokenPrice(_state, _tokenPrice) {
            _state.tokenPrice = _tokenPrice;
        },

        setTokenChangePrice(_state, _tokenChange) {
            _state.tokenChange = _tokenChange;
        },

        setMarketCap(_state, _marketCap) {
            _state.marketCap = _marketCap;
        },

        setCirculation(_state, _circulation) {
            _state.circulation = _circulation;
        },

        /**
         * @param {object} _state
         * @param {number} _gasPrice
         */
        setGasPrice(_state, _gasPrice) {
            _state.gasPrice = _gasPrice;
        },

        /**
         * @param {object} _state
         * @param {boolean} _on
         */
        setDarkMode(_state, _on) {
            _state.darkMode = _on;
        },
        setAddress(_state, _address) {
            _state.address = _address;
        },
        setChainId(_state, _chainId) {
            _state.chainId = _chainId;
        },
        setInputData(rootState, inputData) {
            rootState.inputData = inputData;
        },
        setTotalStake(_state, _totalStake) {
            _state.totalStake = _totalStake;
        }
    },
    actions: {
        async getPrice({ commit, dispatch }) {
            try {
                const res = await getPrice();

                commit("setTokenPrice", res.data.price);
                commit("setTokenChangePrice", res.data.usd_24h_change);
                commit("setMarketCap", res.data.usd_market_cap);
                dispatch("getTotalActiveStakes");
            } catch (err) {
                console.log(err);
            }
        },
        async getTotalStakes({ commit }) {
            commit("setTotalStake", staking.state.totalActiveStakes);
        },

        async getCirculation({ commit }) {
            try {
                const res = await getCirculation();
                // console.log(res, "vcprice");

                commit("setCirculation", res.data.price);
            } catch (err) {
                console.log(err);
            }
        },
        async getInputData({ state, commit }, txHash) {
            let provider = new providers.JsonRpcProvider(
                state.network.networkOptions.rpcUrls[0]
            );
            const tx = await provider.getTransaction(txHash);

            commit("setInputData", tx.data);
        },
        async updateBalance({ commit, state, rootState }) {
            if (state.address) {
                const _provider = new providers.JsonRpcProvider(
                    rootState.network.networkOptions.rpcUrls[0]
                );
                const balance = await _provider.getBalance(state.address);
                commit("setBalance", balance);
            }
        },

        async updateProviderState({ commit, state, rootState }) {
            if (window.ethereum) {
                const provider = new providers.Web3Provider(window.ethereum);
                commit("setProvider", provider);
                if (state.address) {
                    const _provider = new providers.JsonRpcProvider(
                        rootState.network.networkOptions.rpcUrls[0]
                    );
                    const balance = await _provider.getBalance(state.address);
                    commit("setBalance", balance);
                }
            }
        },
        async chainChanged({ dispatch }) {
            window.ethereum.on("chainChanged", function() {
                dispatch("emptyStakingStore");
                dispatch("updateProviderState");
                dispatch("chainCheck");
                dispatch("checkContracts");
            });
        },
        async accountsChanged({ dispatch, commit }) {
            window.ethereum.on("accountsChanged", function(accounts) {
                dispatch("emptyStakingStore");
                commit("setAddress", accounts[0]);
                dispatch("updateProviderState");
                dispatch("chainCheck");
                dispatch("checkContracts");
            });
        },
        async connectMetamask({ commit, dispatch }) {
            if (window.ethereum) {
                const accounts = await window.ethereum.request({
                    method: "eth_requestAccounts"
                });
                commit("setAddress", accounts[0]);
                commit("setWalletType", "metamask");
                localStorage.setItem("autoconnect", true);
                localStorage.setItem("walletType", "metamask");
                dispatch("createContract");
                dispatch("chainCheck");
                dispatch("updateProviderState");
            } else {
                const siteName = window.location.href;
                const toDeepLink = () =>
                    `https://metamask.app.link/dapp/${siteName}`;
                window.open(toDeepLink(siteName));
            }
        },
        async switchChain({ state, dispatch }) {
            if (window.ethereum) {
                try {
                    await window.ethereum.request({
                        method: "wallet_switchEthereumChain",
                        params: [{ chainId: state.network.chainIdHex }]
                    });
                    dispatch("chainCheck");
                    dispatch("updateProviderState");
                    dispatch("checkContracts");
                    return true;
                } catch (switchError) {
                    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                        navigator.userAgent
                    );
                    let errorCode = "";
                    if (isMobile) {
                        errorCode = switchError.data.originalError.code;
                        if (errorCode && parseInt(errorCode) === 4902)
                            dispatch("addChain");
                    } else {
                        if (parseInt(switchError.code) === 4902) {
                            dispatch("addChain");
                        }
                    }
                    console.error(switchError);
                }
            }
        },
        async addChain({ state }) {
            try {
                await window.ethereum.request({
                    method: "wallet_addEthereumChain",
                    params: [state.network.networkOptions]
                });

                return true;
            } catch (error) {
                return false;
            }
        },
        async chainCheck({ state, dispatch, commit }) {
            const chainId = await window.ethereum.request({
                method: "eth_chainId"
            });
            if (chainId !== state.network.chainIdHex) {
                dispatch("switchChain");
            }
            commit("setChainId", chainId);
        },

        async checkContracts({ state, dispatch }) {
            if (!state.staking.contract) {
                dispatch("createContract");
            }
        },

        emptyStakingStore({ commit }) {
            commit("setContract", null);
            commit("setStakes", []);
            commit("setEmptyRequest");
            commit("setEmptyValidatorIDs");
        },

        async disconnect({ commit, dispatch }) {
            localStorage.setItem("autoconnect", false);
            localStorage.setItem("walletType", "");
            commit("setAddress", "");
            commit("setProvider", null);
            commit("setBalance", BigNumber.from(0));
            commit("setCounter", 0);
            dispatch("emptyStakingStore");
            commit("setTrustProvider", null);
            commit("setWalletType", "");
        }
    },
    modules: {
        staking,
        constants,
        trustwallet,
        walletconnect,
        network,
        vctoken,
        dialogs
    }
});
