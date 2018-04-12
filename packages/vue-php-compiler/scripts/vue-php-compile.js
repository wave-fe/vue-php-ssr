var commander = require('commander');
var packageJSON = require('../package.json');
var path = require('path');

var compiler = require('../lib/index');

var runPath = process.cwd();

commander.version(packageJSON.version)
    .option('-r --recursive', 'auto find dependencies and compile')
    .parse(process.argv);

if (!commander.args.length) {
    commander.outputHelp();
    process.exit();
}

let filePath = path.resolve(runPath, commander.args[0]);
if (commander.recursive) {
    compiler.recursiveCompile(filePath);
}
else {
    compiler.compile(filePath);
}
