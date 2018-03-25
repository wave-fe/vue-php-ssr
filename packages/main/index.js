let vueTemplateCompiler = require('vue-template-compiler');
let phpGenerator = require('php-generator');
import {parse, replace} from './ast/index';
import {addNamespace, getPackageInfo, getBaseInfo} from './ast/util';
import templateProcess from './ast/template/index';
import scriptProcess, {processImport} from './ast/script/index';
import {baseClassPath, outputPath} from './config';
import {genClass, addMethod, addMethods, addProperty} from './ast/genClass';
import {getOutputFilePath} from './utils';
import fs from 'fs';
import path from 'path';
import mkdirp from 'mkdirp';

function getFilePath(importPath) {
    let ext = ['', '.js', '.vue', '.jsx', '.es6', '/index.js', '/index.vue', '/index.jsx', '/index.es6'];
    for (var i = 0; i < ext.length; i++) {
        let p = importPath + ext[i];
        if(fs.existsSync(p)) {
            let stats = fs.statSync(p);
            if (stats.isFile()) {
                return p;
            }
        }
    }
    return;
}

function ifNeedProcess(filePath) {
    return /\.js$|\.vue$|\.jsx$|\.es6/.test(filePath);
}

export async function recursiveCompile(filePath) {
    let compiledPath = {};
    async function rCompile(filePath) {
        let existsPath = getFilePath(filePath);

        if (!existsPath) {
            return;
        }
        
        if (!ifNeedProcess(existsPath)) {
            return;
        }

        if (compiledPath[filePath]) {
            return;
        }

        compiledPath[filePath] = true;

        console.log('compiling file: ', existsPath);

        let {importPaths} = await compile(existsPath);
        let promises = importPaths.map(async function (importPath) {
            return await rCompile(importPath);
        });

        return await Promise.all(promises);
    }
    return await rCompile(filePath);
}

export async function compile(filePath) {
    let {ext} = path.parse(filePath);
    if (ext === '.vue') {
        return compileSFCFile(filePath);
    }
    else if (ext === '.js') {
        return compileJsFile(filePath);
    }
    else {
        throw 'file type not support: ' + filePath;
    }
}

export async function compileSFCFile(filePath) {
    return new Promise(function (resolve, reject) {
        // 读取文件
        fs.readFile(filePath, function (err, data) {
            if (err) {
                reject(err);
                return;
            }
            let {
                dir,
                name
            } = getPackageInfo(filePath);
            let ret = compileSFC(data.toString(),{filePath});
            // 把生成的代码写入文件
            let phpPath = path.resolve(dir, name + '.php');
            let {
                outputFileDir,
                outputFilePath
            } = getOutputFilePath(phpPath);
            mkdirp(outputFileDir, function () {

                fs.writeFile(outputFilePath, ret.phpCode, function (err) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(ret);
                });
            });
        });
    });
}

export async function compileJsFile(filePath) {
    return new Promise(function (resolve, reject) {
        // 读取文件
        fs.readFile(filePath, function (err, data) {
            if (err) {
                reject(err);
                return;
            }
            let {
                dir,
                namespace,
                name
            } = getPackageInfo(filePath);

            let ast = parse(data);
            let importPaths = processImport(ast, {filePath});
            addNamespace(ast, namespace);
            let phpCode = phpGenerator.generate(ast);
            // 把生成的代码写入文件
            let phpPath = path.resolve(dir, name + '.php');

            let {
                outputFileDir,
                outputFilePath
            } = getOutputFilePath(phpPath);

            mkdirp(outputFileDir, function () {
                fs.writeFile(outputFilePath, phpCode, function (err) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve({
                        importPaths,
                        phpCode
                    });
                });
            });
        });
    });
}

export function compileSFC(vueContent, options = {}) {
    let filePath = options.filePath;
    let {
        dir,
        namespace
    } = getPackageInfo(filePath);

    let baseName = getBaseInfo().name;
    // 生成class的ast
    let classAst = genClass('defaultexport', baseName);

    // 把vue文件拆分成template、script、style几个模块
    let {template, script} = vueTemplateCompiler.parseComponent(vueContent);


    // 用ssrCompile对template模块进行处理
    let vdom = vueTemplateCompiler.ssrCompileToFunctions(template.content);

    // 对ssrCompile生成的代码进行ast解析
    let templateAst = parse(vdom.render, {sourceType: 'script'});

    // 改造template的ast
    templateAst = templateProcess(templateAst);
    addMethod(classAst, templateAst);


    let content = script.content;
    // 生成script的ast
    if (baseName) {
        let classToBase = path.relative(dir, baseClassPath);

        content = `import ${baseName} from '${classToBase}';${script.content}`
    }
    let scriptAst = parse(content);
    let {
        components,
        computed,
        data,
        exportObject,
        importPaths,
        methods,
        props
    } = scriptProcess(scriptAst, options);
    addMethods(classAst, computed);
    addMethods(classAst, methods);
    addProperty(classAst, components);
    addProperty(classAst, data);
    addProperty(classAst, props);

    scriptAst = replace(scriptAst, exportObject, classAst);
    addNamespace(scriptAst, namespace);


    // 把改造完的ast生成php code
    // let phpCode = phpGenerator.generate(templateAst);
    // let phpCode = phpGenerator.generate(classAst);
    let phpCode = phpGenerator.generate(scriptAst);

    return {
        vdom,
        importPaths,
        phpCode
    };
}

