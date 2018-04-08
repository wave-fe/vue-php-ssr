export function hyphenate(str) {
    return str.replace(/\B([A-Z])/g, "-$1").toLowerCase();
}
