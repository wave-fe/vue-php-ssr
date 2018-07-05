<?php
function something($x, $y = "something", $z = 5) {
var_dump($x, $y, $z);
;
}
function sum($a, $b) {
return func_add($a,$b);
;
}
function hello($a, $b) {
return "hello!";
;
}
var_dump(call_user_func_array);
var_dump(hello(5, 6));
