
const createExtensionWebpackConfig = require('../../MapStore2/build/createExtensionWebpackConfig');

const { name } = require('../../config');
const commons = require('./commons');
const webpackConfig = createExtensionWebpackConfig({
    prod: false,
    name,
    ...commons,
    overrides: {
        // serve translations (and index.json)
        devServer: {
            devMiddleware: { publicPath: "/extensions/" },
            static: {
                directory: './assets',
                publicPath: '/extensions/'
            }
        }
    }
});

module.exports = webpackConfig;
