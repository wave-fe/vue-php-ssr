<?php
$items = func_arr(array(1, 2, 3, 4, 5));
for ($i = 0;
($i < count(func_getArr($items)));$i++) {var_dump($items[$i]);
}for ($i = 0, $j = 10;($i < $j);$i++) {var_dump($i);
}$obj = func_arr(array("one" => 'one', "two" => 'two', "three" => 'three'));
foreach (func_getArr($obj) as $i => $___){var_dump($i, $obj[$i]);
}$j = 10;
while (($j > 0)) {$j--;
var_dump($j);
}$xxx = 10;
do {--$xxx;
} while (($xxx > 0));
