export function func_add(a, b) {
    if (is_numeric(a) && is_numeric(b)) {
        return a += b;
    }
    return `${a}${b}`;
}
