import path from 'path';
import {compile} from '../index';

// (async function () {
//     let info = await compile(path.resolve(__dirname, './dataset/index.vue'));
//     console.log(info.phpCode);
// })();
(async function () {
    await compile(path.resolve(__dirname, '../base.js'));
    await compile(path.resolve(__dirname, './run.js'));
    await compile(path.resolve(__dirname, './dataset/index2.vue'));
    await compile(path.resolve(__dirname, './dataset/index.vue'));
})();
