<?php
$items = func_arr(array(func_arr(array("name" => "one")), func_arr(array("name" => "two")), func_arr(array("name" => "three"))));
foreach (func_getArr($items) as $item => $___){echo($item['name']);
}