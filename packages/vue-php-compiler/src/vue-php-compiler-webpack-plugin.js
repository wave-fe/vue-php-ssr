import {recursiveCompile} from './index';

export class VuePhpCompilerWebpackPlugin {
    apply(compiler, callback) {
        compiler.plugin("emit", function(compilation, callback) {
            let files = compilation.modules
                .map(item => item.userRequest)
                .filter(item => item)
                .filter(item => !/node_modules/.test(item));
            recursiveCompile(files).then(function () {
                callback();
            });
        });
    }
}
