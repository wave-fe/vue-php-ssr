let vueTemplateCompiler = require('vue-template-compiler');
let phpGenerator = require('php-generator');
import {parse, replace} from './ast/index';
import {addNamespace, getPackageInfo, getBaseInfo} from './ast/util';
import templateProcess from './ast/template/index';
import scriptProcess from './ast/script/index';
import {baseClassPath} from './config';
import {genClass, addMethod, addMethods} from './ast/genClass';
import fs from 'fs';
import path from 'path';

export async function compileFile(filePath) {
    return new Promise(function (resolve, reject) {
        // 读取文件
        fs.readFile(filePath, function (err, data) {
            if (err) {
                reject(err);
            }
            let {
                dir,
                name
            } = getPackageInfo(filePath);
            let ret = compile(data.toString(),{filePath});
            // 把生成的代码写入文件
            let phpPath = path.resolve(dir, name + '.php');
            fs.writeFileSync(phpPath, ret.phpCode);
            resolve(ret);
        });
    });
}

export function compile(vueContent, options = {}) {
    let filePath = options.filePath;
    let {
        name,
        dir,
        namespace
    } = getPackageInfo(filePath);

    let baseName = getBaseInfo().name;
    // 生成class的ast
    let classAst = genClass(name, baseName);

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
        exportObject,
        computed,
        methods
    } = scriptProcess(scriptAst, options);
    addMethods(classAst, computed);
    addMethods(classAst, methods);

    scriptAst = replace(scriptAst, exportObject, classAst);
    addNamespace(scriptAst, namespace);


    // 把改造完的ast生成php code
    // let phpCode = phpGenerator.generate(templateAst);
    // let phpCode = phpGenerator.generate(classAst);
    let phpCode = phpGenerator.generate(scriptAst);

    return {
        vdom,
        phpCode
    };
}

