import esquery from 'esquery';
import estemplate from 'estemplate';
import {analyze} from 'escope';
import escodegen from 'escodegen';
import {clone, getPackageInfo, getBaseInfo, defAnalyze} from '../util';
import config from '../../config';
import path from 'path';
import parseOptions from '../parseOptions';

function getExportObject(ast, scope) {
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
            let ref = scope.resolve(exportObject);
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
    // 找到所有 method
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

function processComponents(ast, options, getDef) {
    let dir = getPackageInfo(options.filePath).dir;
    // 找到所有 components
    let components = esquery(ast, 'ObjectExpression>Property[key.name="components"]')[0];
    // 如果没找到就返回一个空数组，保证components永远可读
    if (!components) {
        return {
            type: 'Property',
            key: {
                type: 'Identifier',
                    name: 'components'
            },
            value: {
                type: 'ObjectExpression',
                properties: []
            },
            kind: 'init'
        };
    }
    // 把 type 从 property 改为 classproperty
    // 按照ast标准本应是ClassProperty，但是espree不认，只好用使用原始的property，到php-generator里再判断是否是类属性，然后生成不一样的代码
    // components.type = 'ClassProperty';
    // 找到所有依赖的组件，把变量引用替换成路径
    // 本来按照js语法是可以直接传递class引用的，生成代码都ok了，一切都非常美好，
    // 但是作为世界上最好的语言，php没法传递class引用，只好传递class名字
    esquery(components, 'Property>ObjectExpression>Property').map(function (component) {
        let def = getDef(component.key);
        let importPath = path.resolve(dir, def.parent.source.value);
        let {useNamespaceConverted} = getPackageInfo(importPath);
        // 把变量引用换成字符串
        component.value = {
            "type": "Literal",
            "value": useNamespaceConverted,
            "raw": "\"" + useNamespaceConverted + "\""
        };
    });
    return components;
}

function processData(ast) {
    let data = esquery(ast, 'ObjectExpression>Property[key.name="data"]')[0];
    // 从 property 修改为 MethodDefinition
    data.type = 'MethodDefinition';
    // 从 init 修改为get
    data.kind = 'method';
    return data;
}

export function processImport(ast, options) {
    let dir = getPackageInfo(options.filePath).dir;

    let imports = esquery(ast, 'ImportDeclaration');
    imports.map(function (item) {
        if (/^[\.\/\\]/.test(item.source.value)) {
            // 是相对路径
            // 先把import a from '../a';中的../a转换为绝对路径
            let importPath = path.resolve(dir, item.source.value);
            let {useNamespace} = getPackageInfo(importPath);
            // 最后把修改import后路径保存在namespace字段
            item.namespace = {
                type: 'Literal',
                value: useNamespace
            };
        }
        else {
            // 最后把修改import后路径保存在namespace字段
            item.namespace = item.source;
        }
    });
}


export default function (ast,options) {
    let scopeManager = analyze(ast, {
        sourceType: parseOptions.sourceType,
        ecmaVersion: parseOptions.ecmaFeatures.ecmaVersion
    });
    let getDef = defAnalyze(ast);

    processImport(ast, options);
    // 查找export default {}
    let exportObject = getExportObject(ast, scopeManager);
    return {
        exportObject,
        data: processData(exportObject),
        computed: processComputed(exportObject),
        components: processComponents(exportObject, options, getDef),
        methods: processMethods(exportObject)
    };
    // console.log(JSON.stringify(exportObject));
}
