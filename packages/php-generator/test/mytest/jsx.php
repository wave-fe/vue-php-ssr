<?php
function hello() {
;
}
function render() {
$a = 1;
return array(    "tag" => 'a',
    "attr" => array('href' => '"https://www.baidu.com"','aaa' => $a,'onClick' => $hello,),
    "children" => array(array(    "tag" => 'p',
    "attr" => array(),
    "children" => array('bbb',
    )),
    ));
;
}
var_dump(render());
