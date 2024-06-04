//# sourceMappingURL=index.es.js.map

const appConfig = require("./app.config.js");
const path = require("path");
const svgFilePath = path.join(__dirname, "./src/assets/svg");

console.log("--- app config ---");
console.log(appConfig);
// const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = {
    // transpileDependencies: true,
    // configureWebpack: {
    //     module: {
    //         rules: [
    //             {
    //                 test: /node_modules[\\/]@walletconnect/,
    //                 loader: "babel-loader"
    //             }
    //         ]
    //     }
    // },

    publicPath: appConfig.routerHashMode ? "" : "/",
    outputDir: appConfig.build.outputDir,

    css: {
        loaderOptions: {
            scss: {
                prependData: appConfig.scssData
            }
        }
    },

    pwa: {
        name: appConfig.pwa.name,
        themeColor: "#1969ff",
        msTileColor: "#1969ff",
        assetsVersion: "4",
        manifestOptions: {
            background_color: "#1969ff"
        },
        workboxOptions: {
            skipWaiting: true
        }
    },

    pluginOptions: {
        i18n: {
            locale: "en",
            fallbackLocale: "en",
            localeDir: "locales",
            enableInSFC: false
        }
    },

    chainWebpack: config => {
        // sets page title
        config.plugin("html").tap(_args => {
            _args[0].url = appConfig.url;
            _args[0].title = appConfig.name;
            _args[0].description = appConfig.description;
            _args[0].keywords = appConfig.keywords;
            _args[0].image = appConfig.image;
            return _args;
        });

        config.module
            .rule("vue-svgicon")
            .test(/\.svg$/)
            .use("svgicon")
            .loader("@yzfe/vue-svgicon-loader")
            .options({
                idSeparator: "_",
                svgFilePath
            });

        config.module
            .rule("walletConnect")
            .test(/node_modules[\\/]@walletconnect/)
            .use("babel-loader")
            .loader("babel-loader");

        config.module
            .rule("vue")
            .use("vue-loader")
            .loader("vue-loader")
            .tap(options => {
                options.transformAssetUrls = options.transformAssetUrls || {};
                options.transformAssetUrls["icon"] = ["data"];
                return options;
            });
        // config.module
        //     .rule("m?js")
        //     .test(/\.m?js$/)
        //     .use("babel-loader")
        //     .loader("babel-loader");

        config.module.rule("svg").exclude.add(svgFilePath);

        config.resolve.alias.set("@icon", svgFilePath);

        config.resolve.symlinks(false);

        if (!appConfig.usePWA) {
            config.plugins.delete("pwa");
            config.plugins.delete("workbox");
        }
    }
};
