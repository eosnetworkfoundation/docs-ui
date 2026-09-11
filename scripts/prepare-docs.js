const downloadApis = require('./download-apis');
const downloadDocs = require('./download-docs');
const downloadManuals = require('./download-manuals');
const manualsAndApiMd = require('./utils/manuals-and-api-md');
const fs = require("fs-extra");
const {removeTmpDir, createTmpDir} = require("./utils/create-temp-dir");
const {generateSidebars} = require("./utils/generate-sidebar");
const {generateLatestDocs} = require('./utils/generate-latest-docs');

// get nodejs args
const args = process.argv.slice(2);

const skipDocs = args.find(arg => arg === '--skip-docs');
const skipApis = args.find(arg => arg === '--skip-apis');
const skipManuals = args.find(arg => arg === '--skip-manuals');

const docsBranch = args.find(arg => arg.startsWith('--docs-branch='));
const docsBranchName = docsBranch ? docsBranch.split('=')[1] : 'main'; // new-docs

console.log('Doc branch:', docsBranchName);


const prepareDocs = async() => {
    const startTime = Date.now();
    await removeTmpDir();
    await createTmpDir();

    await Promise.all([
        skipDocs ? Promise.resolve() : downloadDocs(docsBranchName),
        skipApis ? Promise.resolve() : downloadApis(),
        skipManuals ? Promise.resolve() : downloadManuals()
    ])

    if(!skipApis || !skipManuals) {
        if(skipManuals) fs.ensureDirSync('./manuals');
        await manualsAndApiMd();
    }

    await removeTmpDir();

    await generateSidebars('docs');
    await generateSidebars('evm');
    // await generateLatestDocs(docsBranchName);

    console.log(`Done in ${(Date.now() - startTime) / 1000}s`);

}

prepareDocs();
