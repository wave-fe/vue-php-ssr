import path from 'path';
import {compileFile} from '../index';

(async function () {
    let compiled = await compileFile(path.resolve(__dirname, './dataset/index3.vue'));
    console.log(compiled.phpCode);
    // console.log(compiled.vdom);
})();
