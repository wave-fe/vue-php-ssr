export const data = {
    hello: ', how are you'
}

export function sayHello(data = '') {
    if (data) {
        var_dump('hello' + data);
    }
    else {
        var_dump('hello world');
    }
}
