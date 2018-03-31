// import Component from './dataset/index';
import Component from './homepage/src/demo';
import smarty from './config';
// import Component from './homepage/views/feed';
// import Component from './homepage/views/index';
// import Component from './homepage/components/utils/mint-ui/src/utils/dom.js';

let instance = new Component();
// for (var i = 0; i < 1000 * 1000; i++) {
//     instance.render();
// }
// var_dump('done');
// var_dump(instance.render());
let data = {
    content: 'content text'
};

let root = dirname(__FILE__);
smarty.assign('data', data);
smarty.assign('renderString', instance.render(data));
smarty.display(root + '/homepage/entry/index.tpl');
