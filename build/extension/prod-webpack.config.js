
const path = require("path");
const fs = require("fs");

const createExtensionWebpackConfig = require('../../MapStore2/build/createExtensionWebpackConfig');
const CopyPlugin = require('copy-webpack-plugin');
const ZipPlugin = require('zip-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const {name} = require('../../config');
const commons = require('./commons');

// read version and produce a temporary updated index.json
const { version: versionText } = require('../../package.json');
const indexSrc = path.resolve(__dirname, "..", "..", "assets", "index.json");
const tmpIndex = path.resolve(__dirname, "..", "..", "assets", "index.json.tmp");
try {
    const indexContent = JSON.parse(fs.readFileSync(indexSrc, 'utf8'));
    if (Array.isArray(indexContent.plugins)) {
        indexContent.plugins = indexContent.plugins.map(p => p && p.name === name ? { ...p, version: versionText } : p);
    }
    fs.writeFileSync(tmpIndex, JSON.stringify(indexContent, null, 4), 'utf8');
} catch (e) {
    // keep behavior silent here; build will fail later if necessary
    console.error('Error updating index.json from version.txt:', e);
}

// the build configuration for production allow to create the final zip file, compressed accordingly
const plugins = [
    new CopyPlugin([
        { from: path.resolve(__dirname, "..", "..", "assets", "translations"), to: "translations" },
        { from: tmpIndex, to: 'index.json' }
    ]),
    new ZipPlugin({
        filename: `${name}.zip`,
        pathMapper: assetPath => {
            if (assetPath.startsWith('translations') || assetPath.startsWith('assets')) {
                return assetPath;
            }
            // other files have to be placed in the root, with the same name
            return path.basename(assetPath);
        }
    }),
    new CleanWebpackPlugin({
        cleanOnceBeforeBuildPatterns: [],
        cleanAfterEveryBuildPatterns: [tmpIndex]
    })
];
module.exports = createExtensionWebpackConfig({ prod: true, name, ...commons, plugins});
