import esquery from 'esquery';
import estemplate from 'estemplate';
import {analyze} from 'escope';
import escodegen from 'escodegen';
import {clone, getPackageInfo, getBaseInfo} from '../util';
import config from '../../config';
import path from 'path';
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
            if (ref) {
                // console.log(ref.resolved.defs[0].node.init);
                exportObject = ref.resolved.defs[0].node.init;
            }
            else {
                throw 'export form unknown';
            }
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

function processImport(ast, options) {
    let dir = getPackageInfo(options.filePath).dir;

    let imports = esquery(ast, 'ImportDeclaration');
    imports.map(function (item) {
        if (/^[\.\/\\]/.test(item.source.value)) {
            // 是相对路径
            // 先把import a from '../a';中的../a转换为绝对路径
            let importPath = path.resolve(dir, item.source.value);
            let {namespace} = getPackageInfo(importPath);
            // 最后把修改import后路径保存在namespace字段
            item.namespace = {
                type: 'Literal',
                value: namespace
            };
        }
        else {
            // 最后把修改import后路径保存在namespace字段
            item.namespace = item.source;
        }
    });
}

export default function (ast,options) {
    processImport(ast, options);
    // 查找export default {}
    let exportObject = getExportObject(ast);
    return {
        exportObject,
        computed: processComputed(exportObject),
        methods: processMethods(exportObject)
    };
    // console.log(JSON.stringify(exportObject));
}
