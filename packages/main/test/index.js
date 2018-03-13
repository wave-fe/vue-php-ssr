import fs from 'fs';
import path from 'path';
import compiler from '../index';

let file = fs.readFileSync(path.resolve(__dirname, './dataset/index2.vue'));

let compiled = compiler.compile(file.toString());
console.log(compiled.phpCode);

// let ast = compiled.template.ast.children[0].children;
// let ast = compiled.template.ast;
// console.log(JSON.stringify(ast));
