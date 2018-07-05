<?php
json_encode(func_arr(array("integer" => 5, "string" => "hey", "nested" => func_arr(array("objects" => func_arr(array("here" => "yey")))))));
var_dump(json_encode(func_arr(array("integer" => 5, "string" => "hey", "nested" => func_arr(array("objects" => func_arr(array("here" => "yey"))))))));
