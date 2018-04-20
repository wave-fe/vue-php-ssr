set -e;
echo `pwd`;
babel-node test/build.js
echo 'copying smart'

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
echo 'copying homepage'
cp -r ./test/homepage ./output/test/
php output/test/index.php
