import * as path from 'path';
import { promisify } from 'util';
import * as req from 'request';
import { updateFile } from '../release/lib/utils';

const request = promisify(req) as (options: req.OptionsWithUrl) => Promise<req.Response>;

const downloadFile = async (downloadURL: string, downloadLocation: string, transform?: { pattern: string; replacement: string }) => {
    const res = await request({ url: downloadURL }) as req.Response;

    if (res.body.message) {
        throw new Error(res.body.message);
    }

    const body = transform ?
        (res.body as string).replace(transform.pattern, transform.replacement) :
        res.body;

    await updateFile(downloadLocation, body);
};

const resources = new Map([
    ['packages/hint-performance-budget/src/connections.ini', 'https://raw.githubusercontent.com/WPO-Foundation/webpagetest/master/www/settings/connectivity.ini.sample'],
    ['packages/hint-no-vulnerable-javascript-libraries/src/snyk-snapshot.json', 'https://snyk.io/partners/api/v2/vulndb/clientside.json'],
    ['packages/parser-typescript-config/src/schema.json', 'http://json.schemastore.org/tsconfig'],
    ['packages/hint-amp-validator/src/validator', 'https://cdn.ampproject.org/v0/validator.js']
]);

const resourceTransforms = new Map([
    // AJV uses draft-07 and otherwise tests break
    ['packages/parser-typescript-config/src/schema.json', { pattern: 'draft-04', replacement: 'draft-07' }]
]);

const updateEverything = async () => {
    for (const [route, uri] of resources) {
        console.log(`Updating ${route}`);

        try {
            const transform = resourceTransforms.get(route);

            await downloadFile(uri, path.normalize(route), transform);

            console.log(`${route} updated`);
        } catch (e) {
            console.error(`Error downloading ${uri}`);
            console.error(JSON.stringify(e, Object.getOwnPropertyNames(e), 2));

            console.error(e);

            throw e;
        }
    }

    return null;
};

updateEverything();
