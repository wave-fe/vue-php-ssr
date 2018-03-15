import esquery from 'esquery';
import estemplate from 'estemplate';

export function genClass(name) {
    // 利用estemplate生成class模板
    return estemplate(`
        class <%= name %> extends Vue_Base {}
    `, {
        name: {
            "type": "Identifier",
            "name": name
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
