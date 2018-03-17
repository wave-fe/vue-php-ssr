import path from 'path';
import {compile} from '../index';

(async function () {
    // let compiled = await compile(path.resolve(__dirname, './dataset/index3.vue'));
    // console.log(compiled.phpCode);
    // console.log(compiled.vdom);
    await compile(path.resolve(__dirname, '../base.js'));
    await compile(path.resolve(__dirname, './run.js'));
    await compile(path.resolve(__dirname, './dataset/index.vue'));
    await compile(path.resolve(__dirname, './dataset/index2.vue'));
})();
