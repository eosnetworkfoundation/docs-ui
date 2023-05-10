const fs = require("fs-extra");
const yauzl = require("yauzl");
const path = require("path");

const _exec = require("child_process").exec;
const exec = (cmd) => {
    return new Promise((resolve, reject) => {
        _exec(cmd, (err, stdout, stderr) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(stdout);
        });
    });
}

const isLinux = process.platform === "linux";


const unzip = async (zipPath, unzipDir) => {
    return new Promise(async (resolve, reject) => {
        // make unzip dir
        if(!fs.existsSync(unzipDir)) {
            fs.mkdirSync(unzipDir);
        }

        if(isLinux) {
            await exec(`unzip ${zipPath} -d ${unzipDir}`);

            return;
        }

        yauzl.open(zipPath, {lazyEntries: true}, function(err, zipfile) {
            if (err) {
                reject(err);
                return;
            }

            zipfile.readEntry();
            zipfile.on("entry", function(entry) {
                if (/\/$/.test(entry.fileName)) {
                    // Directory file names end with '/'.
                    // Note that entries for directories themselves are optional.
                    // An entry's fileName implicitly requires its parent directories to exist.
                    zipfile.readEntry();

                    // make dir
                    if(!fs.existsSync(path.join(unzipDir, entry.fileName))) {
                        fs.mkdirSync(path.join(unzipDir, entry.fileName));
                    }

                } else {
                    // file entry
                    zipfile.openReadStream(entry, function(err, readStream) {
                        if (err) throw err;
                        readStream.on("end", function() {
                            zipfile.readEntry();
                        });
                        readStream.pipe(
                            fs.createWriteStream(path.join(unzipDir, entry.fileName))
                        );
                    });
                }
            });

            zipfile.once("end", function() {
                zipfile.close();
                resolve();
            });
        });
    });
}

const downloadZip = async (repo, zipPath, branch = "main") => {
    // create dir recursivelyu
    try { fs.mkdirSync(path.dirname(zipPath), { recursive: true }); } catch (err) {}
    const res = await fetch(`http://github.com/${repo}/zipball/${branch}/`);
    await new Promise((resolve, reject) => {
        const fileStream = fs.createWriteStream(zipPath);
        res.body.pipe(fileStream);
        res.body.on("error", (err) => {
            reject(err);
        });
        fileStream.on("finish", function() {
            resolve();
        });
    });
}

module.exports = {
    downloadZip,
    unzip
}
