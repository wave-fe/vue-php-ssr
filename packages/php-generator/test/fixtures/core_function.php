<?php
class Klass
{
public function without_params() {
return "I'm a method without params.";
;
}
public function with_default_params($param1 = "default") {
return $param1;
;
}

}
function global_function() {
return "I'm a global function";
;
}
function global_function_with_params() {
return "I'm a global function with params";
;
}
$klass = new Klass();
var_dump(call_user_func_array);
var_dump(call_user_func_array);
var_dump(call_user_func_array);
var_dump(call_user_func);
