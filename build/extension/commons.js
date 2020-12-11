const path = require("path");

module.exports = {
    exposes: {
        "./plugin": path.join(__dirname, '..', '..', 'js', 'extension', 'plugins', "Extension")
    },
    destination: path.join(__dirname, '..', '..', "dist"),
    alias: {
        "@mapstore": path.resolve(__dirname, '..', '..', "MapStore2", "web", "client"),
        "@js": path.resolve(__dirname, '..', '..', "js")
    }
};
