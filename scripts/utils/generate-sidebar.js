// generate a sidebar using the properties in the head of each doc

const fs = require('fs');
const { findFiles } = require('./find-files');


const IGNORED_DIRECTORIES = [
    'images'
];


const getHeadProperties = (file) => {
    const head = file.split(/---/g)[1];
    if(!head) {
        console.log('no head for', file);
        return false;
    }

    const properties = {};
    head.split('\n').filter(x => !!x).forEach(line => {
        const [key, value] = line.split(':');
        if(!key || !value) return;
        properties[key.trim()] = value.trim();
    });

    return properties;
}

const formatTitle = (docPath) => {
    let title = docPath.split('/').pop();
    title = title.split(/[^a-zA-Z0-9]/g).map(x => x[0].toUpperCase() + x.slice(1)).join(' ');
    return title;
}

const removeUnderscoreNumbers = (docPath) => {
    const parts = docPath.split('/');
    return parts.map(part => {
        return part.split('_')[1] || part;
    }).join('/');
}

const generateSidebars = (docsPath) => {
    let sidebar = [];
    const rootLevelDocs = fs.readdirSync(docsPath);
    for(const root of rootLevelDocs){
        if(IGNORED_DIRECTORIES.includes(root)) continue;
        if(!root.includes('.')){
            // directory

            let title = null;

            const indexPath = `./${docsPath}/${root}/index.md`;
            if(fs.existsSync(indexPath)){
                const index = fs.readFileSync(indexPath, 'utf8');
                const properties = getHeadProperties(index);
                if(!properties || !properties.title){
                    throw new Error(`No properties/title found for ${indexPath}, but index file found`);
                }

                title = properties.title;
            } else {
                title = formatTitle(root);
            }

            const category = {
                type: 'category',
                label: title,
                items: [
                    {
                        type: 'autogenerated',
                        dirName: `${root}`
                    }
                ],
                collapsed: false
            };


            sidebar.push(category);



        } else {
            if(!root.includes('.md')) continue;

            if(root === "index.md") continue;

            // document
            const doc = fs.readFileSync(`./${docsPath}/${root}`, 'utf8');
            const properties = getHeadProperties(doc);

            let title = null;
            if(properties && properties.title){
                title = properties.title;
            } else {
                title = formatTitle(root);
            }

            const docItem = {
                type: 'doc',
                id: removeUnderscoreNumbers(root).replace('.md', ''),
                label: title
            };
        }





    }

    // sidebar.push({
    //     type: 'category',
    //     label: 'everything else',
    //     items: [
    //         {
    //             type: 'autogenerated',
    //             dirName: `.`
    //         }
    //     ],
    //     collapsed: false
    // })

    const sidebarjs = `// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
    welcomeSidebar: ${JSON.stringify(sidebar, null, 4)}
};
    
module.exports = sidebars;`;

    // console.log(JSON.stringify(sidebar, null, 4));
    fs.writeFileSync(`./src/${docsPath}-sidebars.js`, sidebarjs);
};

module.exports = {
    generateSidebars
};
