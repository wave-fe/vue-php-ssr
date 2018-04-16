set -e

# start php server
php -S 0.0.0.0:8090&

# compile vue php
vue-php-compile -r index.js

# cp php module to output
cp -r packages/Smarty output/packages/

# start webpack dev server
webpack-dev-server --host 0.0.0.0 --inline --progress --config build/webpack.dev.conf.js
