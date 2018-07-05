<?php
Module\Http\Router::get('/send', function () {
return $this->json(func_arr(array("success" => Mail::send(func_arr(array("body" => Module::template('signup-confirmation')->compile(func_arr(array("base_url" => AppConfig::get("retrieve.email.url")))), "subject" => "Sign-up confirmation", "to" => $model->email, "from" => "somebody@example.com"))))));
;
}
);
