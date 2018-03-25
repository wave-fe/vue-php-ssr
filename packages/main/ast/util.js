import path from 'path';
import esquery from 'esquery';
import WeakMap from 'es6-weak-map';
import {analyze} from 'escope';
import {baseDir, baseClassPath, defaultExportName} from '../config';
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

export function getPackageInfo(filePath) {
    if (!filePath) {
        return {};
    }
    let {dir, name} = path.parse(filePath);
    let filePathWithoutExt = path.resolve(dir, name);
    let relativeToRoot = path.relative(baseDir, filePathWithoutExt);
    // for example
    // src/main/xxx.js#function yyy
    // namespace => src.main.xxx
    let namespace = relativeToRoot.split(path.sep).join('.');
    // useNamespace => src.main.xxx.yyy
    let useNamespace = namespace + '.' + name;
    // useNamespaceConverted => src\main\xxx\yyy
    let useNamespaceConverted = useNamespace.split('.').join('\\');
    return {
        name,
        dir,
        useNamespace,
        useNamespaceConverted,
        namespace
    };
}

export function getBaseInfo() {
    if (!baseClassPath) {
        return {};
    }
    return getPackageInfo(baseClassPath);
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

export function defaultExport2NamedExport(ast) {
    let exportObject = esquery(ast, 'ExportDefaultDeclaration')[0];
    if (!exportObject) {
        return;
    }
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
