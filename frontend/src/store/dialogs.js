export const ERR_MSG = "Warning! An error has occurred. Please try again.";

export const state = {
    errorMsg: "",
    successMsg: "",
    loading: false
};
export const getters = {
    getErrorMsg(state) {
        return state.errorMsg;
    },
    getSuccessMsg(state) {
        return state.successMsg;
    },
    getDialogLoading(state) {
        return state.loading;
    }
};
export const mutations = {
    setErrorMsg(state, error) {
        state.errorMsg = error;
    },
    setSuccessMsg(state, success) {
        state.successMsg = success;
    },
    setDialogLoading(state, loading) {
        state.loading = loading;
    }
};
export const actions = {
    setEmptyMsg({ commit }) {
        commit("setErrorMsg", "");
        commit("setSuccessMsg", "");
    },
    setErrorMsg({ commit }) {
        commit("setErrorMsg", ERR_MSG);
    },
    setSuccessMsg({ commit }, payload) {
        commit("setSuccessMsg", payload);
    },
    setDialogLoading({ commit }, payload) {
        commit("setDialogLoading", payload);
    }
};

export const dialogs = {
    state,
    getters,
    mutations,
    actions
};
