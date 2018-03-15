let vueTemplateCompiler = require('vue-template-compiler');
let phpGenerator = require('php-generator');
import {parse, compose} from './ast/index';
import templateProcess from './ast/template/index';
import scriptProcess from './ast/script/index';
import {genClass, addMethod, addMethods} from './ast/genClass';

function compile(vueContent) {

    // 生成class的ast
    let classAst = genClass('test');

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
    // let scriptAst = parse("import a from 'a'");
    let methodsAst = scriptProcess(scriptAst);
    addMethods(classAst, methodsAst);

    // 把改造完的ast生成php code
    // let phpCode = phpGenerator.generate(templateAst);
    let phpCode = phpGenerator.generate(classAst);

    return {
        vdom,
        phpCode
    };
}

export default {
    compile
};
