// Counts the amount of chars in the `docs` so that we estimate machine translation costs

const fs = require('fs');
const path = require('path');

const countChars = (dir) => {
    let count = 0;

    const files = fs.readdirSync(dir);
    const iterateFiles = (files, _path = "") => {
        files.forEach(file => {
            if(!path.extname(file)){
                iterateFiles(fs.readdirSync(path.join(dir, _path, file)), _path + '/' + file);
            }
            else if(path.extname(file) === '.md'){
                const textFile = fs.readFileSync(path.join(dir, _path, file), 'utf8');
                count += textFile.length;
            }
        });
    }

    iterateFiles(files);

    console.log(`Total amount of characters in ${dir}: ${count}`);
}

countChars(`./docs`);
