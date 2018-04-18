import path from 'path';
import {compile, recursiveCompile} from '../src/index';

(async function () {
    // 数组验证是否会重复编译
    await recursiveCompile([
        path.resolve(__dirname, './index.js'),
        path.resolve(__dirname, './homepage/src/App.vue')
    ]);
    //await compile(path.resolve(__dirname, './dataset/index.vue'));
})();

