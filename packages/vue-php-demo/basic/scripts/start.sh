set -e

# 检测php命令是否存在
command -v php -v >/dev/null 2>&1 || {
    echo >&2 "php required but it's not installed.  Aborting.";
    exit 1;
}

function version_gt() {
    test "$(echo "$@" | tr " " "\n" | sort -V | head -n 1)" != "$1";
}

PHP_VERSION=`php -v|head -1|awk '{print $2}'`;

if version_gt '5.6.0' $PHP_VERSION; then
   echo "php version is too old, please use v5.6.0+"
   exit 1;
fi

# start php server
php -S 0.0.0.0:8090&

# compile vue php
vue-php-compile -r index.js

# cp php module to output
#cp -r packages/Smarty output/packages/
if [ -f ".vpsrc" ];then
    packagePath=`cat .vpsrc|awk -F "[:]" '/packagePath/{print$2}'`;
else
    packagePath="node_modules/vue-php-packages"
fi

if [ -n "$packagePath" ];then
    echo '';
else
    packagePath="node_modules/vue-php-packages"
fi

cp -r $packagePath/Smarty ./output/$packagePath/

# start webpack dev server
webpack-dev-server --host 0.0.0.0 --inline --progress --config build/webpack.dev.conf.js
