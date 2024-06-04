export async function getTrustWalletInjectedProvider(
    { timeout } = { timeout: 3000 }
) {
    const provider = getTrustWalletFromWindow();

    if (provider) {
        return provider;
    }

    return listenForTrustWalletInitialized({ timeout });
}

async function listenForTrustWalletInitialized(
    { timeout } = { timeout: 3000 }
) {
    return new Promise(resolve => {
        const handleInitialization = () => {
            resolve(getTrustWalletFromWindow());
        };

        window.addEventListener(
            "trustwallet#initialized",
            handleInitialization,
            {
                once: true
            }
        );

        setTimeout(() => {
            window.removeEventListener(
                "trustwallet#initialized",
                handleInitialization,
                { once: true }
            );
            resolve(null);
        }, timeout);
    });
}

function getTrustWalletFromWindow() {
    const isTrustWallet = ethereum => {
        // Identify if Trust Wallet injected provider is present.
        const trustWallet = !!ethereum.isTrust;

        return trustWallet;
    };

    const injectedProviderExist =
        typeof window !== "undefined" && typeof window.ethereum !== "undefined";

    // No injected providers exist.
    if (!injectedProviderExist) {
        return null;
    }

    // Trust Wallet was injected into window.ethereum.
    if (isTrustWallet(window.ethereum)) {
        return window.ethereum;
    }

    // Trust Wallet provider might be replaced by another
    // injected provider, check the providers array.
    if (window.ethereum) {
        if (window.ethereum.providers) {
            // ethereum.providers array is a non-standard way to
            // preserve multiple injected providers. Eventually, EIP-5749
            // will become a living standard and we will have to update this.
            if (window.ethereum.providers.find(isTrustWallet)) {
                return window.ethereum.providers.find(isTrustWallet);
            } else return null;
        }
    }

    // Trust Wallet injected provider is available in the global scope.
    // There are cases that some cases injected providers can replace window.ethereum
    // without updating the ethereum.providers array. To prevent issues where
    // the TW connector does not recognize the provider when TW extension is installed,
    // we begin our checks by relying on TW's global object.
    if (window["trustwallet"]) {
        return window["trustwallet"];
    } else return null;
}

export const state = {
    injectedProvider: null
};

export const getters = {};

export const mutations = {
    setTrustProvider(_state, _injectedProvider) {
        _state.injectedProvider = _injectedProvider;
    }
};

export const actions = {
    async trustChainChanged({ rootState, dispatch }) {
        const injectedProvider = await getTrustWalletInjectedProvider();
        injectedProvider.on("chainChanged", () => {
            dispatch("chainCheckTrust");
            if (!rootState.staking.contract) {
                dispatch("createContract");
            }
        });
    },
    async trustAccountsChanged({ rootState, dispatch, commit }) {
        const injectedProvider = await getTrustWalletInjectedProvider();
        injectedProvider.on("accountsChanged", function(accounts) {
            dispatch("emptyStakingStore");
            commit("setAddress", accounts[0]);

            dispatch("updateBalance");
            dispatch("chainCheckTrust");
            if (!rootState.staking.contract) {
                dispatch("createContract");
            }
        });
    },
    async connectTrustWallet({ rootState, commit, dispatch }) {
        const injectedProvider = await getTrustWalletInjectedProvider();
        commit("setTrustProvider", injectedProvider);
        try {
            const accounts = await injectedProvider.request({
                method: "eth_requestAccounts"
            });
            commit("setAddress", accounts[0]);
            commit("setWalletType", "trustwallet");
            localStorage.setItem("autoconnect", true);
            localStorage.setItem("walletType", "trustwallet");
            if (!rootState.staking.contract) {
                dispatch("createContract");
            }
            dispatch("chainCheckTrust");
            dispatch("updateBalance");
        } catch (e) {
            if (e.code === 4001) {
                console.error("User denied connection.");
            }
        }
    },

    async switchChainTrust({ state, rootState, dispatch }) {
        try {
            await state.injectedProvider.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: rootState.network.chainIdHex }]
            });
            dispatch("chainCheckTrust");
            dispatch("updateBalance");
            if (!rootState.staking.contract) {
                dispatch("createContract");
            }
            return true;
        } catch (switchError) {
            if (parseInt(switchError.code) === 4902) {
                dispatch("addChainTrust");
            }
            console.error(switchError);
        }
    },
    async addChainTrust({ state, rootState }) {
        try {
            console.log("add");
            await state.injectedProvider.request({
                method: "wallet_addEthereumChain",
                params: [rootState.network.networkOptions]
            });

            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    },
    async chainCheckTrust({ state, rootState, commit, dispatch }) {
        const chainId = await state.injectedProvider.request({
            method: "eth_chainId"
        });
        if (chainId !== rootState.network.chainIdHex) {
            console.log("change chain");
            dispatch("switchChainTrust");
        }
        commit("setChainId", chainId);
    }
};

export const trustwallet = {
    state,
    getters,
    mutations,
    actions
};
