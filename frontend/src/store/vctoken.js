import { getCirculation, getPrice } from "../plugins/axios/base-api";

export const state = {
    price: 0,
    circulation: 0
};
export const getters = {
    vcTokenPrice(state) {
        return state.price;
    },

    circulation(state) {
        return Number(state.circulation);
    }
};
export const mutations = {
    setPrice(state, price) {
        state.price = price;
    },
    setCirculation(state, circulation) {
        state.circulation = circulation;
    }
};
export const actions = {
    async getPrice({ commit }) {
        try {
            const res = await getPrice();

            commit("setPrice", res.data.price);
        } catch (err) {
            console.log(err);
        }
    },
    async getCirculation({ commit }) {
        try {
            const res = await getCirculation();
            console.log(res, "circulation");

            commit("setCirculation", res.data.price);
        } catch (err) {
            console.log(err);
        }
    }
};

export const vctoken = {
    state,
    getters,
    mutations,
    actions
};
