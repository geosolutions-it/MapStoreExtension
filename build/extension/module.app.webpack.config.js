// this configuration emulates the real loading of `extensions.json` and
// maps the extension files (running with `npm run ext:start`) to the `/extension/` path

const webpackConfig = require("../../webpack.config");
const { name } = require('../../config');

// emulate the extension root directory
webpackConfig.devServer.proxy = [
    {
        context: ["/extensions/"],
        target: "http://localhost:8082"
    },
    ...webpackConfig.devServer.proxy
];
// emulate the extensions.json
webpackConfig.devServer.setupMiddlewares = (middlewares, devServer) => {
    devServer.app.get("/extensions/extensions.json", (req, res) => {
        res.json({
            [name]: {
                "bundle": "index.js",
                "translations": "translations"
            }
        });
    });
    return middlewares;
};
module.exports = webpackConfig;
