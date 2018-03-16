import espree from 'espree';
import estraverse from 'estraverse';
import parseOptions from './parseOptions';

export function parse(code, options) {

    options = Object.assign({}, parseOptions, options);

    return espree.parse(code, options);
};

export function replace(ast, originalAst, newAst) {
    estraverse.replace(ast, {
        enter: function (node, parent) {
            if (node === originalAst) {
                this.break();
                return newAst;
            }
        }
    });
    return ast;
}
