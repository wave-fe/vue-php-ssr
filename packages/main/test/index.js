import path from 'path';
import {compile, recursiveCompile} from '../index';

(async function () {
    await recursiveCompile(path.resolve(__dirname, './run.js'));
    //await compile(path.resolve(__dirname, './dataset/index.vue'));
})();
