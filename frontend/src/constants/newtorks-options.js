export const STAKING_ADDRESS = "0xFC00FACE00000000000000000000000000000000";
export const DEFAULT_CHAIN_ID = "42420";
export const CHAIN_ID_HEX = `0x${Number(DEFAULT_CHAIN_ID).toString(16)}`;

const CHAIN_ID_TEST = process.env.VUE_APP_CHAIN_ID;
const CHAIN_ID_HEX_TEST = `0x${Number(CHAIN_ID_TEST).toString(16)}`;
const CHAIN_ID_MAIN = 42420;
const CHAIN_ID_HEX_MAIN = `0x${Number(CHAIN_ID_MAIN).toString(16)}`;

export const networkOptions =
    process.env.VUE_APP_TYPE === "mainnet"
        ? {
              chainId: CHAIN_ID_HEX_MAIN,
              chainName: "XendChain",
              nativeCurrency: {
                  name: "XendChain",
                  symbol: "RWA",
                  decimals: 18
              },
              rpcUrls: [process.env.VUE_APP_RPC],
              blockExplorerUrls: [process.env.VUE_APP_EXPLORER_MAINNET]
          }
        : {
              chainId: CHAIN_ID_HEX_TEST,
              chainName: "XendChain Testnet",
              nativeCurrency: {
                  name: "XendChain Testnet",
                  symbol: "RWA",
                  decimals: 18
              },
              rpcUrls: [process.env.VUE_APP_RPC],
              blockExplorerUrls: [process.env.VUE_APP_EXPLORER_TESTNET]
          };
// {
//     chainId: CHAIN_ID_HEX,
//     chainName: "VinuChain Testnet",
//     nativeCurrency: {
//         name: "VinuChain",
//         symbol: "VC",
//         decimals: 18
//     },
//     rpcUrls: ["https://vinufoundation-rpc.com"],
//     blockExplorerUrls: [process.env.VUE_APP_EXPLORER_TESTNET]
// };
