import path from 'path';
import fs from 'fs';

let runPath = process.cwd();

let customConfig = {};

let rcPath = path.resolve(runPath, '.vpsrc');

if (fs.existsSync(rcPath)) {
    customConfig = JSON.parse(fs.readFileSync(rcPath));
}

// short name
let cc = customConfig;

export const baseDir = cc.baseDir || path.resolve(__dirname);

export const baseClassPath = cc.baseClassPath || path.resolve('./base');

export const defaultClassName = cc.defaultClassName || 'defaultexport';

export const outputPath = cc.outputPath ? path.resolve(runPath, cc.outputPath) : path.resolve('./output');
