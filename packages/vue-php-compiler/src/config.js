import path from 'path';
import fs from 'fs';

let runPath = process.cwd();

let customConfig = {};

let rcPath = path.resolve(runPath, '.vpsrc');

if (fs.existsSync(rcPath)) {
    customConfig = JSON.parse(fs.readFileSync(rcPath));
}

export {customConfig};

// short name
let cc = customConfig;


export const baseDir = cc.baseDir ? path.resolve(runPath, cc.baseDir) : path.resolve(runPath);

// export const baseClassPath = cc.baseClassPath || path.resolve('./base/vue');

export const defaultExportName = cc.defaultExportName || 'defaultexport';

if (defaultExportName === 'default') {
    throw '"default" is a key word in php, please DON\'T use "default" as default export name.';
}

export const outputPath = cc.outputPath ? path.resolve(runPath, cc.outputPath) : path.resolve(runPath, './output');

export const packagePath = cc.packagePath ? path.resolve(runPath, cc.packagePath) : path.resolve(runPath, './packages');

export const webpackConfigPath = cc.webpackConfigPath ? path.resolve(runPath, cc.webpackConfigPath) : path.resolve(runPath, './webpack.config.js');
