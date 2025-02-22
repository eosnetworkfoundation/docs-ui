const swaggerParser = require('./utils/swagger-parser');
const {createTmpDir, removeTmpDir} = require('./utils/create-temp-dir');
const path = require("path");
const fs = require("fs-extra");

const downloadApis = async () => {
    try { fs.rmSync("apis", { recursive: true }); } catch (e) { }
    fs.mkdirSync("apis");

    const projects = [
        [{
            repo:'antelopeIO/spring',
            versions: [{
                version: 'v1.0.4',
                branch:'release/1.0'
            },{
                latest:true,
                version: 'v1.1.0',
                branch:'release/1.1'
            }]
        }]
    ];

    let redocusaurusSpecs = [];

    for (const project of projects) {
        for (const repo of project) {
            const repoName = repo.repo.split('/')[1];

            for (const versionBranch of repo.versions) {
                redocusaurusSpecs = redocusaurusSpecs.concat(await swaggerParser(
                    repo.repo,
                    versionBranch
                ));
            }

            const indexMdPath = `./apis/${repoName}/index.md`;
            const capitalizedTitle = repoName.charAt(0).toUpperCase() + repoName.slice(1);


            const indexMdContent = `---
title: ${capitalizedTitle}
---

Below you can find the list of APIs that are available for ${repoName}.

${repo.versions.map(version => {
                return `- [${version === repo.versions[0] ? 'latest' : version} ${version === repo.versions[0] ? `(${version})` : ''}](/apis/${repoName}/${version === repo.versions[0] ? 'latest' : version}/)`;
            }).join('\n')}

`;

            fs.writeFileSync(indexMdPath, indexMdContent);
        }
    }

    fs.writeFileSync('./redocusaurus.specs.js', `module.exports = ${JSON.stringify(redocusaurusSpecs, null, 4)};`);

}

module.exports = downloadApis;
// downloadApis();
