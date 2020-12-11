const webpackConfig = require("../../webpack.config");
const { name } = require('../../config');

// emulate the extension root directory
webpackConfig.devServer.proxy["/extension/"] = {
    target: "http://localhost:8082"
};
// emulate the extensions.json
webpackConfig.devServer.before = function(app) {
    app.get("/extensions.json", function(req, res) {
        res.json({
            [name]: {
                "bundle": "extension/index.js",
                "translations": "extension/translations"
            }
        });
    });
},
module.exports = webpackConfig;
