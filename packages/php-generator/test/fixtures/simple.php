<?php
$x = 50;
$y = 20;
$z = func_add($x,$y);
var_dump($x, $y);
var_dump($z);
var_dump(func_arr(array("a" => 1, "b-c" => 'c', "d-e-fh" => g(0), "hi" => "hi")));
$obj = func_arr(array("key" => 'value', "key2" => 'value2'));
unset($obj['key']);
var_dump(isset($something['key2']));
var_dump((gettype($something) !== NULL));
