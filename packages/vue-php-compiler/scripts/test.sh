set -e;
echo `pwd`;
babel-node test/build.js
echo 'copying smart'
cp -r ./packages/Smarty ./output/packages/
echo 'copying homepage'
cp -r ./test/homepage ./output/test/
php output/test/index.php
