import esquery from 'esquery';
import estemplate from 'estemplate';
import {analyze} from 'escope';
import escodegen from 'escodegen';
import {clone} from '../util';
import parseOptions from '../parseOptions';

function getExportObject(ast) {
    let scopeManager = analyze(ast, {
        sourceType: parseOptions.sourceType,
        ecmaVersion: parseOptions.ecmaFeatures.ecmaVersion
    });
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

function processMethods(ast) {
    // 找到所有computed
    let methods = esquery(ast, 'ObjectExpression>Property[key.name="methods"]>ObjectExpression>Property');
    // 当前只处理get的computed，后续需要判断是否是可以set的，
    // 复制一份ast，分别生成set和get
    methods = methods.map(function (item) {
        // 从 property 修改为 MethodDefinition
        item.type = 'MethodDefinition';
        // 从 init 修改为get
        item.kind = 'method';
        return item;
    });
    return methods;
}

export default function (ast) {
    // 查找export default {}
    let exportObject = getExportObject(ast);
    return [
        ...processComputed(exportObject),
        ...processMethods(exportObject)
    ];
    // console.log(JSON.stringify(exportObject));
}
