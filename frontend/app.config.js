// const { store } = require("./src/store");
// console.log(store.getters.isTestMode, "isTestMode");

const appConfig = {
    url: "https://xend.finance",
    // app title
    name: "Asset Chain Scan",
    // app description
    description:
        "Asset Chain Scan is a Block Explorer and Analytics Platform for Asset Chain by Xend Finance.",
    // app image
    image: "https://xend.finance/icons/logo.svg",
    // app keywords
    keywords: "Xend, Asset Chain",
    // apollo client settings
    apollo: {
        // list of providers. if one of them is unavailable, another is randomly picked
        providers: [
            {
                http: process.env.VUE_APP_RPC + ":16761/",
                // for subscriptions
                ws: ""
            }
        ],
        // index into providers array of default provider or 'random' - takes index randomly
        defaultProviderIndex: "random"
    },
    //
    useTestnet: true,
    // use 'hash' mode in vue router
    routerHashMode: false,
    // testnet config
    testnet: {
        // list of providers. if one of them is unavailable, another is randomly picked
        providers: [
            {
                http: process.env.VUE_APP_RPC + ":16761/api",
                // for subscriptions
                ws: ""
            }
        ]
    },
    // progressive web application
    usePWA: true,
    // pwa settings
    pwa: {
        // name used in pwa manifest
        name: "XendChain"
    },
    // default options for production build
    build: {
        // output dir for production build
        outputDir: "dist"
    },
    // downtime threshold in seconds. downtime values less than this threshold will be displayed as 0
    downtimeThreshold: 10,
    // feature flags
    flags: {
        networkNodesMap: false,
        rewardsEstimation: true,
        ftmVault: true,
        dailyBlocks: true,
        dailyTxFees: true
    }
};

if (appConfig.useTestnet) {
    appConfig.apollo.providers = appConfig.testnet.providers;
}

// scss variables prepended to every scss file
appConfig.scssData = `
    @import "src/assets/scss/vars";
`;

module.exports = appConfig;
