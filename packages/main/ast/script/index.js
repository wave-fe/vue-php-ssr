import esquery from 'esquery';
import {analyze} from 'escope';
import {getPackageInfo, defAnalyze} from '../util';
import {getFilePath} from '../../utils';
import {defaultExportName, packagePath} from '../../config';
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
    if (!components) {
        return;
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
        let namespace = useNamespaceConverted.replace(/\\/g, '\\\\');
        // 把变量引用换成字符串
        component.value = {
            type: 'Literal',
            value: namespace,
            raw: '"' + namespace + '"'
        };
    });
    return components;
}

function processData(ast) {
    let data = esquery(ast, 'ObjectExpression>Property[key.name="data"]')[0];
    if (!data) {
        return;
    }
    // 从 property 修改为 MethodDefinition
    data.type = 'MethodDefinition';
    // 从 init 修改为get
    data.kind = 'method';
    return data;
}

/**
 * 修改props的ast，props有很多形式1、数组, 2、对象xxx: String, 3、对象xxx: {type: String}
 * 最后都转化为对象xxx: {default: xxx}
 * 只保留default属性，其他的类型检测不在php里做，php只管最稳定的输出首屏dom
 * 至于有些代码写的传入类型和props不匹配，会在浏览器console里提示的，
 * 开发者自己去改就好了，在首屏渲染就不矫情这些事了
 *
 * @param {AST} ast export的ast
 *
 * @return {AST=}
 */
function processProps(ast) {
    // 数组形式的props
    let props = esquery(ast, 'ObjectExpression>Property[key.name="props"]')[0];
    if (!props) {
        return;
    }

    if (props.value.type === 'ObjectExpression') {
        // 删除default以外所有属性
        props.value.properties.map(function (node) {
            if (node.value.type === 'ObjectExpression') {
                // 只保留default字段
                node.value.properties = node.value.properties.filter(function (property) {
                    return property.key.name === 'default';
                });
            }
            else {
                // node.value一定是一个object
                // 避免运行时判断这判断那的，烦
                node.value = {
                    type: 'ObjectExpression',
                    properties: []
                };
            }
        });
        return props;
    }

    let elements = [];
    if (props.value.type === 'ArrayExpression') {
        // 把数组转换成对象
        // props: ['a', 'b', 'c']
        // 转换成
        // props: {
        //  a: {},
        //  b: {},
        //  c: {}
        // }
        props.value.elements.map(function (node) {
            elements.push({
                type: 'Property',
                method: false,
                shorthand: false,
                computed: false,
                key: {
                    type: 'Identifier',
                    name: node.value
                },
                value: {
                    type: 'ObjectExpression',
                    properties: []
                },
                kind: 'init'
            });
        });

        props.value = {
            type: 'ObjectExpression',
            properties: []
        };

        props.value.properties = props.value.properties.concat(elements);

        return props;
    }

    return;
}

export function processImport(ast, options) {
    let dir = getPackageInfo(options.filePath).dir;

    let imports = esquery(ast, 'ImportDeclaration');
    return imports.map(function (item) {
        let importPath;
        if (/^[./\\]/.test(item.source.value)) {
            // 是相对路径
            // 先把import a from '../a';中的../a转换为绝对路径
            importPath = path.resolve(dir, item.source.value);
        }else {
            // 绝对路径，从packages路径加载第三方包
            if (/[/\\]/.test(item.source.value)) {
                // 如果包名是xxx/yyy
                importPath = path.resolve(packagePath, item.source.value);
            }
            else {
                // 包名仅仅是xxx
                importPath = path.resolve(packagePath, item.source.value, 'index');
            }
        }

        // 根据路径查找磁盘上存在的文件，
        // 比如，import xxx from './xxx', 
        // 查找./xxx是否存在,不存在就继续查找./xxx/index等
        let filePathInfo = getFilePath(importPath);

        if (filePathInfo) {
            importPath = filePathInfo.filePathWithOutExt;
        }
        let originalPath = item.source.value;

        item.source.value = path.relative(dir, importPath);
        let {namespace} = getPackageInfo(importPath);
        // 最后把修改import后路径保存在namespace字段
        // 如果找到的是php就不增加命名空间
        // 毕竟人家写的代码，也不知道用没用命名空间
        let filePath = '';
        if (filePathInfo) {
            filePath = filePathInfo.filePath;
        }
        if (/php$/.test(filePath)) {
            item.namespace = {
                type: 'Literal',
                value: originalPath 
            };
        }
        else {
            item.namespace = {
                type: 'Literal',
                value: namespace
            };
            // 处理default export
            item.specifiers.map(function (specifier) {
                if (specifier.type === 'ImportDefaultSpecifier') {
                    specifier.raw = defaultExportName;
                }
            });
        }
        return importPath;
    })
    // 筛选出非空子集，就是所有的相对路径模块
        .filter(item => !!item);
}


export default function (ast,options) {
    let scopeManager = analyze(ast, {
        sourceType: parseOptions.sourceType,
        ecmaVersion: parseOptions.ecmaFeatures.ecmaVersion
    });
    let getDef = defAnalyze(ast);

    let importPaths = processImport(ast, options);
    // 查找export default {}
    let exportObject = getExportObject(ast, scopeManager);
    return {
        exportObject,
        importPaths,
        data: processData(exportObject),
        computed: processComputed(exportObject),
        components: processComponents(exportObject, options, getDef),
        methods: processMethods(exportObject),
        props: processProps(exportObject)
    };
}
