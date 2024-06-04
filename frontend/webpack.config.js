const createExpoWebpackConfigAsync = require("@expo/webpack-config");

module.exports = async function(env, argv) {
    const config = await createExpoWebpackConfigAsync(
        {
            ...env,
            babel: {
                dangerouslyAddModulePathsToTranspile: [
                    "@walletconnect/ethereum-provider"
                ]
            },
            plugins: [
                "@babel/plugin-proposal-nullish-coalescing-operator",
                "@babel/plugin-proposal-optional-chaining"
            ]
        },
        argv
    );
    return config;
};
