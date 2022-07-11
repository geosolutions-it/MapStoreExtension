# Template project to create MapStore extensions

This repository is a template where to start to create [MapStore Extensions](https://mapstore.readthedocs.io/en/latest/developer-guide/extensions/).

It is basically a customized MapStore project that allows to run, test and build a sample extension.
You can copy this repository and modify the sample extension to develop your own one.

## Quick Start

Clone the repository with the --recursive option to automatically clone submodules.

`git clone --recursive https://github.com/geosolutions-it/MapStoreExtension`

Install NodeJS >= 12.16.1 , if needed, from [here](https://nodejs.org/en/download/releases/).

You can start the development application locally:

`npm install`

`npm start`

The application runs at `http://localhost:8081` afterwards. You will see, opening a map, the sample plugin on top of the map.


## Start creating your own extension

If you have to create an extension, you will have to

- find a name for it
- write the code/css for the plugin and its reducers/epics to implement the effective extension.

### Naming the plugin

The first step to create the plugin is to name it. To do it, you have to edit 3 files:

- Edit `config.js` to change the name of your extension.
- Edit `assets/index.json` and change the "name" entry with the name of your plugin. (here you can customize dependencies, if needed)
- Edit `localConfig.json` replacing "SampleExtension", in `plugins/desktop` section, with the name of your Extension (for running local development)
- *[only for version <= 2020.01.xx]* Edit  `package.json` changing `name` entry with a unique name for your extension. E.g. `mapstore-extension-<ext-name>.`

> **note** Edit the `name` in `package.json` is not strictly needed from version 2021.02.xx. Anyway it is a good practice to choose a unique `name` in your `package.json` for a new npm project, in general.

### Start developing

The main entry point of the plugin is `js/extension/plugins/Extension.jsx`. It contains a sample plugin with a sample reducer (probably you will need to rename the reducer), and a sample epic that you can see as example and replace with yours.
You should not move or change the `js/extension/plugins/Extension.jsx` file, but you can change all the other files inside `js/extension/` directory. You edit the oher files and add new ones from this starting point.

Moreover you can edit:

- `assets/index.json`: to customize extension dependencies.
- `assets/translations/`: to set up your translations.

### Build Extension

To build the extension you should run

- `npm run ext:build`

This will create a zip with the name of your extension in `dist` directory.


### Test Module

The current project contains the plugin on its own. In a production environment the extension will be loaded dynamically from the MapStore back-end.
You can simulate in dev-mode this condition by:

Commenting `js/app.js` the lines indicated in `js/app.jsx`, that allow to load the plugin in the main app.

```javascript
// Import plugin directly in application. Comment the 3 lines below to test the extension live.
const extensions = require('./extensions').default;
plugins.plugins = { ...plugins.plugins, ...extensions };
ConfigUtils.setConfigProp('translationsPath', ['./MapStore2/web/client/translations', './assets/translations']);
// end of lines to comment
```

- run, in 2 different console the following commands:
  - `npm run ext:start`
  - `npm run ext:startapp`

This will run webpack dev server on port 8081 with MapStore, simulating the `extensions.json` on the default extensions path (the path is relative), and will run on port 8082 the effective modules to load.

## Under the hood

MapStore extensions are based on WebPack 5 [Module Federation](https://webpack.js.org/concepts/module-federation/).
MapStore uses `ModuleFederationPlugin` to expose the shared libs and provide the proper entry points.

An extension can `build/createExtensionWebpackConfig.js` utility to create an extension with the same shared libs.
This utility function create the base structure to export the proper files as a federate module compatible with MapStore (passing the `name` of the extension and the exposes argument).
This project basically uses this utility function, and is configured to:

- Run MapStore and debug the plugin, as a normal plugin
- Run the test mode of the module, simulating the effective installation
- Build the final zip file ready to be installed

### Limitations

For now, components retrieved from MapStore (using the import) will be a **copy of the existing ones**, so calling methods directly on some files imported from MapStore will not have any effect (e.g. register MapInfo Viewers, trying to load resolutions or from `ConfigUtils` or in general access rules using `libs/ajax`).

You can add to your extension **only** `css`, `js` and `png`, `jpg`, `gif` image files (other than translations folder and `index.json`). Future improvements could allow to add other assets types(icons, fonts, json ...)

## Dev Hints

Here a list of hints to develop your extension:

- In order to keep your changes as much self contained as possible we suggest to put all your code (and assets) in `js/extension/`. (Put css in `js/extension/assets/`, etc...)
- Use the `@mapstore` alias to refer to MapStore components. This helps your code to be compatible with future enhancements when mapstore will be published as a separated package, that can be shared
- In order to debug the extension in `ext:start` + `ext:startapp` mode, you need to add `devtool: 'eval'` to `build/webpack.config.js`.
- Most of the times you will develop extensions for the main map. For this reason you can find in `app.json` some code comments dedicated to configuring this project to have a plain map on startup. It has not been configured as default because this project is intended to have less differences as possible from a standard project.
- When the `extensions.json` is configured in `app.jsx` via `extensionsRegistry` and `extensionsFolder`, in order to emulate the `extensions.json` from Webpack DevServer for testing, the paths configured in `build/module.app.webpack.config.js` and `build/webpack.config.js` needs to be modified accordingly


