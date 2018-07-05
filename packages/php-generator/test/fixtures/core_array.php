<?php
$items = func_arr(array("One", "Two", "Three"));
array_unshift(func_getArr($items), "Zero");
array_shift(func_getArr($items));
array_push(func_getArr($items), "Four");
var_dump($items);
echo(join(", ", func_getArr($items)));
echo(count(func_getArr($items)));
echo(array_search(func_arr(array("name" => "Three")), func_getArr($items)));
echo(join(", ", func_getArr($items)));
