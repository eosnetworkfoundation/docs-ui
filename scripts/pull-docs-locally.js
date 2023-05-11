const path = require('path');
const fs = require('fs-extra');
const chokidar = require('chokidar');
const manualsAndApiMd = require("./utils/manuals-and-api-md");

const docsFolderPath = process.argv.slice(2)[0];

if(!docsFolderPath){
    console.error('Please provide the path to the docs folder as an argument to this script');
    process.exit(1);
}

let absolutePath = path.resolve(docsFolderPath);

if(fs.readdirSync(absolutePath).includes("docs")){
    absolutePath = path.join(absolutePath, "docs");
}

let timeout;
let locked = false;
const copyFiles = (file = null) => {
    // If locked, possible file is overwritten, need to redo
    if(locked) return;
    locked = true;

    console.log('----file', file);

    clearTimeout(timeout);
    timeout = setTimeout(async () => {

        if(file === null) {
            fs.rmSync("docs", {recursive: true});
            fs.mkdirSync("docs");
            fs.copySync(absolutePath, "docs", { overwrite: true });
            await manualsAndApiMd();
        } else {
            console.log(file);
            // file path is absolute, need to make it relative in the docs folder
            fs.copySync(file, path.join("docs", path.relative(absolutePath, file)), { overwrite: true });
        }

        locked = false;
    }, 50);
};

var watcher = chokidar.watch(absolutePath, {ignored: /^\./, persistent: true});

copyFiles();

watcher
    .on('add', copyFiles)
    .on('change', copyFiles)
    .on('unlink', () => copyFiles())
    .on('error', function(error) {
        console.error('Error happened', error);
    });
