import espree from 'espree';
import parseOptions from './parseOptions';

export function parse(code, options) {

    options = Object.assign({}, parseOptions, options);

    return espree.parse(code, options);
};

/**
 * compose template ast & script ast & style ast
 *
 * @param {EsprimaAst} templateAst
 * @param {EsprimaAst} scriptAst
 * @param {EsprimaAst} styleAst
 *
 * @return {EsprimaAst}
*/
export function compose(templateAst, scriptAst, styleAst) {
};
