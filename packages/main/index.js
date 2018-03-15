let vueTemplateCompiler = require('vue-template-compiler');
let phpGenerator = require('php-generator');
import {parse, compose} from './ast/index';
import templateProcess from './ast/template/index';
import scriptProcess from './ast/script/index';

function compile(vueContent) {
    // 把vue文件拆分成template、script、style几个模块
    let part = vueTemplateCompiler.parseComponent(vueContent);


    // 用ssrCompile对template模块进行处理
    let vdom = vueTemplateCompiler.ssrCompile(part.template.content);
    // 对ssrCompile生成的代码进行ast解析
    let templateAst = parse(vdom.render, {sourceType: 'script'});
    // 改造template的ast
    templateProcess(templateAst);


    // 生成script的ast
    let scriptAst = parse(part.script.content);
    let classAst = scriptProcess(scriptAst);

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
