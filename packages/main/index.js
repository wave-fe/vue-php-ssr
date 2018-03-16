let vueTemplateCompiler = require('vue-template-compiler');
let phpGenerator = require('php-generator');
import {parse, replace} from './ast/index';
import {addNamespace} from './ast/util';
import templateProcess from './ast/template/index';
import scriptProcess from './ast/script/index';
import {genClass, addMethod, addMethods} from './ast/genClass';

function compile(vueContent) {
    let namespace = 'test';

    // 生成class的ast
    let classAst = genClass(namespace);

    // 把vue文件拆分成template、script、style几个模块
    let {template, script} = vueTemplateCompiler.parseComponent(vueContent);


    // 用ssrCompile对template模块进行处理
    let vdom = vueTemplateCompiler.ssrCompileToFunctions(template.content);

    // 对ssrCompile生成的代码进行ast解析
    let templateAst = parse(vdom.render, {sourceType: 'script'});

    // 改造template的ast
    templateAst = templateProcess(templateAst);
    addMethod(classAst, templateAst);


    // 生成script的ast
    let scriptAst = parse(script.content);
    let {
        exportObject,
        computed,
        methods
    } = scriptProcess(scriptAst);
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

export default {
    compile
};
