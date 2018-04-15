import path from 'path';
import fs from 'fs';
import {
    baseDir,
    outputPath,
    webpackConfigPath
} from './config';

// require("@babel/register");


export function getOutputFilePath(filePath) {
    let relativePath = path.relative(baseDir, filePath);
    let outputFilePath = path.resolve(outputPath, relativePath);
    let parsedPath = path.parse(outputFilePath);
    return {
        outputFileDir: parsedPath.dir,
        outputFilePath
    };
}

export function getFilePath(importPath) {
    // 有限判断php，有php的文件会覆盖js转换的实现
    let ext = ['', '.php', '.js', '.vue', '.jsx', '.es6', '/index.php', '/index.js', '/index.vue', '/index.jsx', '/index.es6'];
    for (var i = 0; i < ext.length; i++) {
        let p = importPath + ext[i];
        if(fs.existsSync(p)) {
            let stats = fs.statSync(p);
            if (stats.isFile()) {
                return {
                    filePath: p,
                    // 当前名称文件没找到，找到了index文件
                    filePathWithOutExt: i > 5 ? importPath + '/index' : importPath
                };
            }
        }
    }
    return;
}

let webpackConfig;
export function getWebpackConfig() {
    if (webpackConfig) {
        return webpackConfig;
    }
    if (fs.existsSync(webpackConfigPath)) {
        webpackConfig = require(webpackConfigPath);
        return webpackConfig
    }
    return;
}
