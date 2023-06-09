require('isomorphic-fetch');
const {createTmpDir, removeTmpDir} = require("./create-temp-dir");
const { downloadZip, unzip } = require("./download-repo-as-zip");
const { findFiles } = require("./find-files");
const fs = require("fs-extra");
const path = require("path");

const normalizePath = (_path) => {
    return path.normalize(_path).replace(/\/\//g, "/").replace(/\\\\/g, '/').replace(/\\/g, '/');
}

const parse = async (repo, versionBranch) => {
    const { version, branch, latest = false } = versionBranch;
    console.log(`Preparing API: ${repo} (${version})`);
    let specs = [];

    const repoName = repo.split('/')[1];
    const tmpDir = `./tmp/${repo.replace(/\//, '-').replace(/\\/, '-')}`;
    if(!fs.existsSync(tmpDir)) {
        fs.mkdirsSync(tmpDir);
    }

    const apisDir = `./apis/`;
    if(!fs.existsSync(apisDir)) {
        fs.mkdirsSync(apisDir);
    }

    const basePath = `${apisDir}/${repo.split('/')[1]}/${latest ? 'latest' : version}`;

    // download repo as zip
    const zipPath = `${tmpDir}.zip`;
    await downloadZip(repo, zipPath, branch);
    await unzip(zipPath, tmpDir);

    // find all .swagger files recursively
    const swaggerFiles = findFiles(tmpDir, '.swagger.yaml');


    swaggerFiles.forEach(file => {
        const destination = path.join(basePath, path.basename(file));
        fs.moveSync(file, destination, { overwrite: true });

        // Fix lingering issue with old swagger files
        let content = fs.readFileSync(destination, 'utf8');
        content = content.replace(/#\/component\/schema\/Error/g, "#/components/schemas/Error");

        // get the relative from this file's destination path to the `openapi` folder
        const relativePath = path.relative(path.dirname(destination), path.join(__dirname, '../../static/openapi/v2.0/')).replace(/\\/g, '/') + '/';

        // Fix absolute pathing for schemas
        content = content.replace(/https:\/\/docs.eosnetwork.com\/openapi\/v2.0\//g, relativePath);
        fs.writeFileSync(destination, content);


        const fileName = path.basename(file);

        specs.push({
            spec: normalizePath(destination.replace(/\/\//g, "/")),
            route: normalizePath(`/apis/${repoName}/${latest ? 'latest' : version}/${fileName.split('.swagger')[0]}.api/`),
        });
    });

    const indexMdPath = `${basePath}/index.md`;
    const capitalizedTitle = repo.split('/')[1].charAt(0).toUpperCase() + repo.split('/')[1].slice(1);
    const indexMdContent = `---
title: ${capitalizedTitle} (${version})
---

${swaggerFiles.map(file => {
    const fileName = path.basename(file);
    const fileNameWithoutExtension = fileName.replace('.swagger.yaml', '');
    return `- [${fileNameWithoutExtension}](/apis/${repoName}/${latest ? 'latest' : version}/${fileNameWithoutExtension}.api)`;
}).join('\n')
    }
`;

    fs.writeFileSync(indexMdPath, indexMdContent);


    return specs;
}

module.exports = parse;
