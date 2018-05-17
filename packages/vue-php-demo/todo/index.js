import {render as func_render} from './src/main';
import smarty from './smarty-config';

let data = {};

let root = dirname(__FILE__);
smarty.assign('data', data);
smarty.assign('renderString', func_render(data));
smarty.display(root + '/index.html');
