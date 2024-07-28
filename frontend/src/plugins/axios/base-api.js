import axios from "axios";

const baseURL = process.env.VUE_APP_PRICE_URL;

export const axiosClient = axios.create({
    baseURL,
    transformResponse: [data => JSON.parse(data)]
});

export const getPrice = async () =>
           await axiosClient.get("", {}).then(res => res.data);

// export const getCirculation = async () =>
//     await axiosClient.get("priceVinuCash", {}).then(res => res.data);
