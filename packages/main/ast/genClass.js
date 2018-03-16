import esquery from 'esquery';
import estemplate from 'estemplate';

export function genClass(name, base) {
    // 利用estemplate生成class模板
    let template = '';
    if (base) {
        template = 'class <%= name %> extends <%= base %> {}';
    }
    else {
        template = 'class <%= name %> {}';
    }
    return estemplate(template, {
        name: {
            "type": "Identifier",
            "name": name
        },
        base: {
            "type": "Identifier",
            "name": base
        }
    });
};

export function addMethod(classAst, methodAst) {
    // 找到classbody部分
    let classBody = esquery(classAst, 'ClassBody')[0];
    // 把computed放到body里
    classBody.body = [...classBody.body, methodAst];

    return classAst;
}

export function addMethods(classAst, methodAstArr) {
    // 找到classbody部分
    let classBody = esquery(classAst, 'ClassBody')[0];
    // 把computed放到body里
    classBody.body = [...classBody.body, ...methodAstArr];

    return classAst;
}
