let vueTemplateCompiler = require('vue-template-compiler');
let phpGenerator = require('php-generator');

function compile(vueContent) {
    let part = vueTemplateCompiler.parseComponent(vueContent);
    // console.log(part);
    let vdom = vueTemplateCompiler.ssrCompile(part.template.content);
    let phpCode = phpGenerator.compileTemplate(vdom.render);

    return {
        vdom,
        phpCode
    };
}

export default {
    compile
};
