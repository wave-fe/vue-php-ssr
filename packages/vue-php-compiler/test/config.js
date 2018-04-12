import Smarty from 'Smarty';
let smarty = new Smarty();
smarty.left_delimiter='{%';
smarty.right_delimiter='%}';

smarty.force_compile = true;
smarty.debugging = false;
smarty.caching = false;
