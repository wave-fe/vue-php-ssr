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
