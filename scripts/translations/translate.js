require('dotenv').config();
const fs = require('fs');
const path = require('path');
const docusaurusConfig = require('../../docusaurus.config.js');
const cliProgress = require('cli-progress');

const {TranslationServiceClient} = require('@google-cloud/translate');
const crypto = require('crypto');
const {execSync} = require('child_process');

const { copyNonDocs } = require('./copy-non-md');

const DOCS_DIR = `./docs`;

// TODO: Tables are getting messed up (see supported-tokens.md) (actually, looks like they are only messed up in the preview, but not in the actual docs)

// TODO: <head> tags are still getting messed up, are are being translated which breaks docusaurus.


// TODO: implement
const DO_NOT_TRANSLATE = [
    'Web3',
    'Ethereum',
    'EOS',
    'EVM'
];

// We're going to split the docs into a few different symbols:
// Title (everything between the first and second ---)
// Code blocks (everything between ``` and ```)
// Code snippets (everything between ` and `)
// Everything else (text)
//  - We'll also split links into their own symbol, so we can discard them from translation

const SYMBOL_TYPE = {
    TITLE: 'title',
    METADATA: 'metadata',
    HEAD: 'head',
    CODE_BLOCK: 'codeBlock',
    CODE_SNIPPET: 'codeSnippet',
    TEXT: 'text',
    LINK: 'link',
}

let symbols = [];

let id = 0;
let snippetId = 0;
const pushSymbol = (type, content) => {
    symbols.push({
        type,
        content,
        id: id++
    });
}

const translationClient = new TranslationServiceClient(
    {
        projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
        keyFilename: process.env.GOOGLE_CLOUD_KEY_FILE
    }
);

const getTranslator = (targetLanguageCode) => {
    return async (text) => {
        return await getTranslation(text, targetLanguageCode);
    }
}

const getTranslation = async (text, targetLanguageCode) => {
    const request = {
        parent: `projects/${process.env.GOOGLE_CLOUD_PROJECT_ID}/locations/global`,
        contents: [text],
        mimeType: 'text/plain',
        sourceLanguageCode: 'en',
        targetLanguageCode: targetLanguageCode,
    };

    const [response] = await translationClient.translateText(request);
    if(response && response.translations && response.translations.length > 0){
        return response.translations[0].translatedText;
    }

    return null;
}


const translate = async (doc, targetLanguageCode) => {

    const translator = getTranslator(targetLanguageCode);

    splitDocIntoSymbols(doc);

    let translatedTitle = await translator(symbols.find(symbol => symbol.type === SYMBOL_TYPE.TITLE).content);
    symbols = symbols.filter(symbol => symbol.type !== SYMBOL_TYPE.TITLE);

    const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
    progressBar.start(symbols.length, 0);

    const translatedSymbols = [];
    let symbolIndex = 0;
    for(const symbol of symbols){
        progressBar.update(++symbolIndex);


        if(symbol.type === SYMBOL_TYPE.CODE_BLOCK){
            translatedSymbols.push(`\`\`\`${symbol.content}\n\`\`\``);
            continue;
        }

        if(symbol.type === SYMBOL_TYPE.CODE_SNIPPET){
            translatedSymbols.push(`\`${symbol.content}\``);
            continue;
        }

        if(symbol.type === SYMBOL_TYPE.METADATA){
            const translated = symbol.content.replace(/title:\s*(.+)/, `title: ${translatedTitle}`);
            translatedSymbols.push(translated);
            continue;
        }

        if(symbol.type === SYMBOL_TYPE.LINK){
            let linkText = symbol.content.match(/\[(.+)\]/);

            // Some links have no text, so we'll just use the URL
            if(!linkText || !linkText.length){
                translatedSymbols.push(symbol.content);
                continue;
            }
            linkText = linkText[1];
            const translatedLinkText = await translator(linkText);
            if(!translatedLinkText){
                console.error(`Translation failed for symbol: ${symbol}`);
                translatedSymbols.push(symbol.content);
                continue;
            } else {
                translatedSymbols.push(symbol.content.replace(linkText, translatedLinkText));
            }

            continue;
        }

        if(!symbol || !symbol.content || !symbol.content.length){
            console.warn('Symbol is invalid or has empty content', symbol);
            continue;
        }

        if(symbol.content.match(/^[^a-zA-Z0-9]+$/)){
            translatedSymbols.push(symbol.content);
            continue;
        }

        // There's an issue where Google Translate API removes trailing
        // whitespaces, and there's no way to prevent this with configs afaik.
        // To solve it, we'll add a whitespace to the end of the string
        // if it was terminated by a whitespace, and one doesn't exist in the
        // translated string.
        const terminatedByWhitespace = symbol.content.endsWith(' ');

        let translated = await translator(symbol.content);
        if(translated){
            if(terminatedByWhitespace && !translated.endsWith(' ')){
                translated += ' ';
            }
            translatedSymbols.push(translated);
        } else {
            console.error(`Translation failed for symbol: ${symbol}`)
        }

        await new Promise(resolve => setTimeout(resolve, 200));
    }

    return translatedSymbols.join('');
}

const getAllDocs = () => {
    let files = [];
    const iterateFiles = (_files, _path = "") => {
        _files.map(file => {
            if(!path.extname(file)){
                iterateFiles(fs.readdirSync(path.join(DOCS_DIR, _path, file)), _path + '/' + file);
            }
            else if(path.extname(file) === '.md'){
                files.push(path.normalize(path.join(DOCS_DIR, _path, file)).replace(/\\/g, '/'));
            }
        });
    }

    iterateFiles(fs.readdirSync(DOCS_DIR));

    return files;
}



const splitDocIntoSymbols = (doc) => {
    symbols = [];

    let title = doc.match(/title:\s*(.+)/);
    if(title) title = title[0].replace('title:', '').trim();
    pushSymbol(SYMBOL_TYPE.TITLE, title);

    const secondIndex = doc.indexOf('---', doc.indexOf('---') + 1);
    const everythingBefore = doc.substring(0, secondIndex + 3);
    const everythingAfter = doc.substring(secondIndex + 3);
    pushSymbol(SYMBOL_TYPE.METADATA, everythingBefore);

    markdownToSymbols(everythingAfter);
}

const markdownToSymbols = (markdown) => {
    let result = [];
    let regex = /(```[\s\S]*?```|`.*?`|<head>.*?<\/head>|[^`]+)/g;
    // TODO: Head still isn't working
    // let regex = /(```[\s\S]*?```|`.*?`|<head>[\s\S]*?<\/head>|[^`]+)/g;

    let matches = markdown.match(regex);
    matches.forEach((match, i) => {
        // Check if it is a code block.
        if (match.startsWith('```') && match.endsWith('```')) {
            pushSymbol(SYMBOL_TYPE.CODE_BLOCK, match.slice(3, -3).trim());
        }
        // Check if it is a code snippet.
        else if (match.startsWith('`') && match.endsWith('`')) {
            pushSymbol(SYMBOL_TYPE.CODE_SNIPPET, match.slice(1, -1).trim());
        }
        // Check if it is a head
        else if (match.startsWith('<head>') && match.endsWith('</head>')) {
            pushSymbol(SYMBOL_TYPE.HEAD, match.slice(6, -7).trim());
        }
        // If it is not a code block or snippet, it is just plain text.
        else {
            // Links should not be translated (causes issues with google translate)
            const linkMatches = match.match(/\[.*?\]\(.*?\)/g);
            if(linkMatches){
                let lastIndex = 0;
                for(const link of linkMatches){
                    const index = match.indexOf(link, lastIndex);
                    if(index > lastIndex) {
                        pushSymbol(SYMBOL_TYPE.TEXT, match.substring(lastIndex, index));
                    }

                    pushSymbol(SYMBOL_TYPE.LINK, link);
                    lastIndex = index + link.length;
                }
                if(lastIndex < match.length){
                    pushSymbol(SYMBOL_TYPE.TEXT, match.substring(lastIndex));
                }
                return;
            }

            pushSymbol(SYMBOL_TYPE.TEXT, match);
        }
    });

    return result;
}

const saveCache = (translationCache) => fs.writeFileSync('./translations/translated.json', JSON.stringify(translationCache, null, 2));

const translateUI = async (languages, translationCache) => {
    execSync('npm run write-translations');
    const codeJson = JSON.parse(fs.readFileSync('./i18n/en/code.json', 'utf8'));
    const codeHash = crypto.createHash('md5').update(JSON.stringify(codeJson)).digest('hex');

    const footerJson = JSON.parse(fs.readFileSync('./i18n/en/docusaurus-theme-classic/footer.json', 'utf8'));
    const footerHash = crypto.createHash('md5').update(JSON.stringify(footerJson)).digest('hex');

    const navbarJson = JSON.parse(fs.readFileSync('./i18n/en/docusaurus-theme-classic/navbar.json', 'utf8'));
    const navbarHash = crypto.createHash('md5').update(JSON.stringify(navbarJson)).digest('hex');


    for(const language of languages){
        console.log('language', language);
        if(!translationCache[language]){
            translationCache[language] = {};
        }

        const translator = await getTranslator(language);

        const translateJson = async (json, hash, prop, saveTo) => {
            console.log(`Translating ${prop} for ${language}`);
            const translatedJson = {};
            if(!translationCache[language][prop] || translationCache[language][prop].hash !== codeHash){
                for(const key in json){
                    const translated = await translator(json[key].message);

                    if(!translated){
                        console.error(`Translation failed for code.json key: ${key}`);
                        translatedJson[key] = json[key];
                        continue;
                    }

                    translatedJson[key] = json[key];
                    translatedJson[key].message = translated;

                }

                translationCache[language][prop] = {
                    hash,
                    timestamp: Date.now(),
                    manually_translated: false,
                };
                saveCache(translationCache);

                if(!fs.existsSync(path.dirname(saveTo))){
                    fs.mkdirSync(path.dirname(saveTo), { recursive: true });
                }
                fs.writeFileSync(saveTo, JSON.stringify(translatedJson, null, 2));

                return translatedJson;
            }
        }

        await translateJson(codeJson, codeHash, 'code', `./i18n/${language}/code.json`);
        await translateJson(footerJson, footerHash, 'footer', `./i18n/${language}/docusaurus-theme-classic/footer.json`);
        await translateJson(navbarJson, navbarHash, 'navbar', `./i18n/${language}/docusaurus-theme-classic/navbar.json`);

    }
}

const translateDocs = async () => {

    const languages = docusaurusConfig.i18n.locales.filter(locale => locale !== 'en');
    // const languages = ['zh'];

    let docPaths = getAllDocs();

    const translationCache = JSON.parse(fs.readFileSync('./translations/translated.json', 'utf8'));
    for(const language of languages){
        if(!translationCache[language]){
            translationCache[language] = {};
        }
    }

    // for(let docPath of docPaths){
    //     for(let language of languages){
    //         const isTranslated = translationCache[language][docPath];
    //         const doc = fs.readFileSync(docPath, 'utf8');
    //         const hash = crypto.createHash('md5').update(doc).digest("hex");
    //
    //         const translateThisDoc = async () => {
    //             const title = (x => x ? x[0] : docPath)(doc.match(/title:\s*(.+)/));
    //             console.info(`\r\nTranslating ${title} to ${language}`);
    //             const translated = await translate(doc, language);
    //
    //             const translatedDocPath = `./i18n/${language}/docusaurus-plugin-content-docs/current/${docPath.replace('docs/', '')}`;
    //
    //             fs.mkdirSync(path.dirname(translatedDocPath), { recursive: true });
    //             fs.writeFileSync(translatedDocPath, translated);
    //
    //             translationCache[language][docPath] = {
    //                 hash,
    //                 timestamp: Date.now(),
    //                 manually_translated: false,
    //             };
    //             saveCache(translationCache);
    //
    //             await new Promise(resolve => setTimeout(resolve, 1000));
    //         }
    //
    //         if(!isTranslated){
    //             await translateThisDoc();
    //         } else {
    //             if(translationCache[language][docPath].hash !== hash){
    //                 await translateThisDoc();
    //             }
    //         }
    //
    //     }
    // }

    // Translates the various UI elements
    await translateUI(languages, translationCache);

    // Copies over non-doc files like diagrams, images, etc.
    copyNonDocs(languages);


    process.exit(0);
}

translateDocs(DOCS_DIR);
