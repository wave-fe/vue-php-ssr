<?php
$inline = function ($i) {
return $i;
;
}
;$inline = $inline(5);
var_dump($inline);
$assignment = null;
$assignment = function () {
$_results = func_arr(array(1, 2, 3, 4, 5));
return $_results;
;
}
;$assignment = $assignment();
var_dump($assignment);
