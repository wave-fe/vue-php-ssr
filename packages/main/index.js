let vueTemplateCompiler = require('vue-template-compiler');
let phpGenerator = require('php-generator');
import {parse, replace} from './ast/index';
import {addNamespace, getPackageInfo, getBaseInfo, defaultExport2NamedExport} from './ast/util';
import templateProcess from './ast/template/index';
import scriptProcess, {processImport} from './ast/script/index';
import {outputPath, defaultExportName} from './config';
import {genClass, addMethod, addMethods, addProperty} from './ast/genClass';
import {getOutputFilePath, getFilePath} from './utils';
import fs from 'fs';
import path from 'path';
import mkdirp from 'mkdirp';

let baseName = 'base';
function ifNeedProcess(filePath) {
    return /\.js$|\.vue$|\.jsx$|\.es6/.test(filePath);
}

export async function recursiveCompile(filePath) {
    let compiledPath = {};
    async function rCompile(filePath) {
        let filePathInfo = getFilePath(filePath);

        if (!filePathInfo) {
            return;
        }

        let existsPath = filePathInfo.filePath;
        
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
                namespaceConverted,
                name
            } = getPackageInfo(filePath);

            let content = data;
            // base文件本身就不import base了
            if (!/base\.index/.test(namespace)) {
                content = `
                    import {func_add} from '${baseName}';
                    ${data}
                `;
            }
            let ast = parse(content);
            defaultExport2NamedExport(ast, filePath);
            let importPaths = processImport(ast, {filePath});
            addNamespace(ast, namespace, namespaceConverted);
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
        namespace,
        namespaceConverted
    } = getPackageInfo(filePath);

    let vueName = 'vue';
    // 生成class的ast
    let classAst = genClass(defaultExportName, vueName);

    // 把vue文件拆分成template、script、style几个模块
    // style 不处理了，使用webpack extract出来的css，省心
    let {template, script} = vueTemplateCompiler.parseComponent(vueContent);

    // 用ssrCompile对template模块进行处理
    let vdom = vueTemplateCompiler.ssrCompile(template.content);

    let templateCode = `
        function _render(_ssrRenderData=[]) {
            ${vdom.render}
        }
    `;

    // 对ssrCompile生成的代码进行ast解析
    let templateAst = parse(templateCode, {
        sourceType: 'script',
        ecmaVersion: 9
    });

    // 改造template的ast
    templateAst = templateProcess(templateAst);
    addMethod(classAst, templateAst);


    let content = `
        import {func_add} from '${baseName}';
        import ${vueName} from '${vueName}';
        ${script.content}
    `;
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
    addNamespace(scriptAst, namespace, namespaceConverted);


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

