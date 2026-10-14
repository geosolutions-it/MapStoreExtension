const path = require("path");

const themeEntries = require('./MapStore2/build/themes.js').themeEntries;
const extractThemesPlugin = require('./MapStore2/build/themes.js').extractThemesPlugin;
const ModuleFederationPlugin = require('./MapStore2/build/moduleFederation').plugin;
const { devServer } = require('./MapStore2/build/devServer');

module.exports = require('./MapStore2/build/buildConfig')({
    bundles: {
        'MapStoreExtension': path.join(__dirname, "js", "app"),
        'MapStoreExtension-embedded': path.join(__dirname, "MapStore2", "web", "client", "product", "embedded"),
        'MapStoreExtension-api': path.join(__dirname, "MapStore2", "web", "client", "product", "api")
    },
    themeEntries,
    paths: {
        base: __dirname,
        dist: path.join(__dirname, "dist"),
        framework: path.join(__dirname, "MapStore2", "web", "client"),
        code: [path.join(__dirname, "js"), path.join(__dirname, "MapStore2", "web", "client")]
    },
    plugins: [extractThemesPlugin, ModuleFederationPlugin],
    prod: false,
    publicPath: "dist/",
    cssPrefix: '.MapStoreExtension',
    prodPlugins: [],
    devServer: {
        devMiddleware: { publicPath: '/dist/' },
        ...devServer,
        // serve the project root as static content, excluding backend build
        // and log files whose changes would trigger a full page reload
        static: [{
            directory: __dirname,
            watch: {
                ignored: [
                    '**/web/target/**',
                    '**/logs/**',
                    '**/*.log',
                    '**/node_modules/**',
                    '**/.git/**'
                ]
            }
        }]
    },
    alias: {
        "@mapstore/patcher": path.resolve(__dirname, "node_modules", "@mapstore", "patcher"),
        "@mapstore": path.resolve(__dirname, "MapStore2", "web", "client"),
        "@js": path.resolve(__dirname, "js")
    }
});
