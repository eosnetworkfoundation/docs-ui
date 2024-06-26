require("isomorphic-fetch");

const { createTmpDir, removeTmpDir } = require("./utils/create-temp-dir");
const { downloadZip, unzip } = require("./utils/download-repo-as-zip");

const fs = require("fs-extra");
const yauzl = require('yauzl-promise');
const path = require('path');

const zipPath = "./tmp/docs.zip";
const unzipDir = path.join("tmp/unpacked/");

const processDocs = (docsDir, from, to) => {
    console.log(`Processing docs: ${from} -> ${to}`);
    const docsPath = path.join(unzipDir, docsDir, from);

    // copy docs subdir to root docs dir
    try { fs.rmSync(to, { recursive: true }); } catch (e) {}
    fs.mkdirSync(to);

    fs.readdirSync(docsPath).forEach(file => {
        fs.moveSync(path.join(docsPath, file), path.join(to, file), { overwrite: true|false })
    });
}

const downloadDocs = async (branch) => {
    try { fs.rmSync("docs", { recursive: true }); } catch (e) { }
    fs.mkdirSync("docs");

    console.log(`Preparing docs: eosnetworkfoundation/docs (${branch})`);

    await downloadZip("eosnetworkfoundation/docs", zipPath, branch);
    await unzip(zipPath, unzipDir);

    // find "docs" subdir
    const files = fs.readdirSync(unzipDir);
    const docsDir = files.find(f => f.startsWith("eosnetworkfoundation-docs-"));
    processDocs(docsDir, "native", "docs");
    processDocs(docsDir, "evm", "evm");
    processDocs(docsDir, "images", "static/images");
}

module.exports = downloadDocs;
