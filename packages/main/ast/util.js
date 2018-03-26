import path from 'path';
import esquery from 'esquery';
import WeakMap from 'es6-weak-map';
import {analyze} from 'escope';
import {baseDir, defaultExportName} from '../config';
import parseOptions from './parseOptions';

export function isClosureVariable(ident, currentScope) {
    let scope = currentScope;
    let count = 0;
    while (scope) {
        let variables = scope.variables;
        for (var j = 0; j < variables.length; j++) {
            count++;
            if (variables[j].name === ident.name) {
                return true;
            }
        }
        scope = scope.upper
    }
    return false;
};

export function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

export function addNamespace(ast, name) {
    let programBody = ast.body;
    programBody.unshift({
        "type": "NamespaceDeclaration",
        "id": {
            "type": "Identifier",
            "name": name
        }
    });
}

function getNamespaceFromFilepath(filePath) {
    let {dir, name} = path.parse(filePath);
    let filePathWithoutExt = path.resolve(dir, name);
    let relativeToRoot = path.relative(baseDir, filePathWithoutExt);
    // for example
    // src/main/xxx.js#function yyy
    // namespace => src.main.xxx
    let namespace = relativeToRoot.split(path.sep).join('.').replace(/\-/g, '');
    let namespaceConverted = namespace.split('.').join('\\');
    // useNamespace => src.main.xxx.yyy
    let useNamespace = namespace + '.' + defaultExportName;
    // useNamespaceConverted => src\main\xxx\yyy
    let useNamespaceConverted = useNamespace.split('.').join('\\');
    return {
        namespace,
        namespaceConverted,
        useNamespace,
        useNamespaceConverted
    };
}

export function getPackageInfo(filePath) {
    if (!filePath) {
        return {};
    }
    let {dir, name} = path.parse(filePath);
    let {
        namespace,
        useNamespace,
        useNamespaceConverted
    } = getNamespaceFromFilepath(filePath);
    return {
        name,
        dir,
        useNamespace,
        useNamespaceConverted,
        namespace
    };
}

export function defAnalyze(ast) {
    let scopes = analyze(ast, {
        sourceType: parseOptions.sourceType,
        ecmaVersion: parseOptions.ecmaFeatures.ecmaVersion
    }).scopes;

    let map = new WeakMap();
    var scope;

    while (scope = scopes.shift()) {
        scope.references.map(function (reference) {
            if (!map.has(reference.identifier)) {
                if (reference.resolved) {
                    map.set(reference.identifier, reference.resolved.defs[0]);
                }
            }
        });
        scopes = scopes.concat(scope.childScopes);
    }

    return function (identifier) {
        return map.get(identifier);
    };
}

export function defaultExport2NamedExport(ast, filePath) {
    let exportObject = esquery(ast, 'ExportDefaultDeclaration')[0];
    if (!exportObject) {
        return;
    }

    if (exportObject.declaration.type === 'ClassDeclaration') {
        let namedExport = clone(exportObject);
        namedExport.type = 'ExportNamedDeclaration';
        namedExport.declaration.id.name = defaultExportName;
        let programAst = esquery(ast, 'Program')[0];
        programAst.body.unshift(namedExport);
    }
    else {
        // 不是class的就直接变量导出

        let originDeclaration = clone(exportObject.declaration);
        exportObject = exportObject.declaration;
        exportObject.type = 'ExportNamedDeclaration';
        exportObject.declaration = {
            "type": "VariableDeclaration",
            "declarations": [
              {
                "type": "VariableDeclarator",
                "id": {
                  "type": "Identifier",
                  "name": defaultExportName
                },
                "init": originDeclaration
              }
            ],
            "kind": "const"
        };
    }
}
