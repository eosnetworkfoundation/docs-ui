// copies non-md files to each language folder

const fs = require('fs');
const path = require('path');

const DOCS_DIR = `./docs`;

const getAllNonDocs = () => {
    let files = [];
    const iterateFiles = (_files, _path = "") => {
        _files.map(file => {
            if(!path.extname(file)){
                iterateFiles(fs.readdirSync(path.join(DOCS_DIR, _path, file)), _path + '/' + file);
            }
            else if(path.extname(file) !== '.md'){
                files.push(path.normalize(path.join(DOCS_DIR, _path, file)).replace(/\\/g, '/'));
            }
        });
    }

    iterateFiles(fs.readdirSync(DOCS_DIR));

    return files;
}

const copyNonDocs = (languages) => {
    console.log('Copying non-docs to each language folder...');
    const nonDocs = getAllNonDocs();

    for(let file of nonDocs){
        for(let lang of languages){
            const langFile = file.replace('docs/', `i18n/${lang}/docusaurus-plugin-content-docs/current/`);
            const langDir = path.dirname(langFile);

            if(fs.existsSync(langFile)) continue;

            if(!fs.existsSync(langDir)){
                fs.mkdirSync(langDir, { recursive: true });
            }
            fs.copyFileSync(file, langFile);
        }
    }
}

module.exports = {
    copyNonDocs
}
