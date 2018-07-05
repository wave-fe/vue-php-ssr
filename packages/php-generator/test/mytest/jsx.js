function hello() {
}

function render() {
    var a = 1;
    return (<a href="https://www.baidu.com" aaa={a} onClick={hello}><p>bbb</p></a>);
}

console.log(render());
