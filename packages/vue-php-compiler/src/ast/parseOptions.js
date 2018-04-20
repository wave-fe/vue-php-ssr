export default {
    loc : true,
    range : true,
    // tokens : true,
    comment : true,
    sourceType: 'module',
    ecmaFeatures: {
        ecmaVersion: 9, // ecmascript 2018
        impliedStrict: false,
        arrowFunctions: true, // enable parsing of arrow functions
        blockBindings: true, // enable parsing of let/const
        destructuring: true, // enable parsing of destructured arrays and objects
        regexYFlag: true, // enable parsing of regular expression y flag
        regexUFlag: true, // enable parsing of regular expression u flag
        templateStrings: true, // enable parsing of template strings
        binaryLiterals: true, // enable parsing of binary literals
        octalLiterals: true, // enable parsing of ES6 octal literals
        unicodeCodePointEscapes: true, // enable parsing unicode code point escape sequences
        defaultParams: true, // enable parsing of default parameters
        restParams: true, // enable parsing of rest parameters
        forOf: true, // enable parsing of for-of statement
        objectLiteralComputedProperties: true, // enable parsing computed object literal properties
        objectLiteralShorthandMethods: true, // enable parsing of shorthand object literal methods
        objectLiteralShorthandProperties: true, // enable parsing of shorthand object literal properties
        objectLiteralDuplicateProperties: true, // Allow duplicate object literal properties (except '__proto__')
        generators: true, // enable parsing of generators/yield
        spread: true, // enable parsing spread operator
        superInFunctions: true, // enable super in functions
        classes: true, // enable parsing classes
        newTarget: false, // enable parsing of new.target
        jsx: true, // enable React JSX parsing
        globalReturn: true, // enable return in global scope
        experimentalObjectRestSpread: true // allow experimental object rest/spread
    }
};
