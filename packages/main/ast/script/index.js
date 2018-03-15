import esquery from 'esquery';
import estemplate from 'estemplate';
import {analyze} from 'escope';
import escodegen from 'escodegen';
import {clone} from '../util';

function getExportObject(ast) {
    let scopeManager = analyze(ast);
    let currentScope = scopeManager.acquire(ast);
    let exportObject = esquery(ast, 'ExportDefaultDeclaration')[0];
    if (!exportObject) {
        // 没有export
        throw 'export not found';
    }
    exportObject = exportObject.declaration;
    if (exportObject.type !== 'ObjectExpression') {
        // 其他export形式，
        // 比如 let a = {}; export default a;
        if (exportObject.type === 'Identifier') {
            let ref = currentScope.resolve(exportObject);
            // console.log(ref.resolved.defs[0].node.init);
            exportObject = ref.resolved.defs[0].node.init;
        }
        else {
            throw 'export form unknown';
        }
    }
    return exportObject;
}

function processComputed(ast) {
    // 找到所有computed
    let computed = esquery(ast, 'ObjectExpression>Property[key.name="computed"]>ObjectExpression>Property');
    // 当前只处理get的computed，后续需要判断是否是可以set的，
    // 复制一份ast，分别生成set和get
    computed = computed.map(function (item) {
        // 从 property 修改为 MethodDefinition
        item.type = 'MethodDefinition';
        // 从 init 修改为get
        item.kind = 'get';
        return item;
    });
    return computed;
}

function obj2class(ast) {
    let computed = processComputed(ast);

    // 利用estemplate生成class模板
    let classAst = estemplate(`
        class <%= name %> extends Vue_Base {}
    `, {
        name: {
            "type": "Identifier",
            "name": "test"
        }
    });
    // 找到classbody部分
    let classBody = esquery(classAst, 'ClassBody')[0];
    // 把computed放到body里
    classBody.body = [...classBody.body, ...computed];

    return classAst;
    // console.log(escodegen.generate(classAst));
}

export default function (ast) {
    // 查找export default {}
    let exportObject = getExportObject(ast);
    return obj2class(exportObject);
    // console.log(JSON.stringify(exportObject));
}
