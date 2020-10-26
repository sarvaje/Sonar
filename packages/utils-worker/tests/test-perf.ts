import { CSS, Test } from './helpers/types';
import { getResults } from './helpers/runner';
import { join } from 'path';
import * as fs from 'fs';

const generateCSS = (path: string) => {
    let result = '';

    for (let i = 0; i < 10000; i++) {
        result += `.a${i} {
            color: #abcdef;
        }
`;
    }

    result += `
.button {
    .example1 {
        appearance: none;
        -moz-appearance: none;
        -webkit-appearance: none;
    }
}
`;

    fs.writeFileSync(join(__dirname, 'index.css'), result, 'utf-8'); // eslint-disable-line no-sync

    return {
        content: result,
        path
    };
};

const generateHTML = (css: CSS[] = []) => {
    let result = `
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width">
        <title>Basic Hints Test</title>`;

    if (css.length) {
        for (const { path } of css) {
            result += `<link rel="stylesheet" href="${path}"/>`;
        }
    }

    result += `
    </head>
    <body>
        <h1>Basic Hints Test</h1>
        <dialog open>
            <form>`;

    for (let i = 0; i < 500; i++) {
        result += `<img src="icon.png"><button class="button">Test</button>
                  `;
    }

    result += `</form>
        </dialog>
    </body>
</html>
`;

    return result;
};

const generateDeepHTML = (css: CSS[] = []) => {
    const deep = 100;
    let result = `
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width">
        <title>Basic Hints Test</title>`;

    if (css.length) {
        for (const { path } of css) {
            result += `<link rel="stylesheet" href="${path}"/>`;
        }
    }

    result += `
    </head>
    <body>
        <h1>Basic Hints Test</h1>
        <dialog open>
            <form>`;

    for (let j = 0; j < 5; j++) {
        for (let i = 0; i < deep; i++) {
            result += `<div>
            <img src="icon.png"><button>Test</button>
            `;
        }

        for (let i = 0; i < deep; i++) {
            result += `</div>`;
        }
    }

    result += `</form>
        </dialog>
    </body>
</html>
`;

    return result;
};

const prefixOrderCSS = [generateCSS('./index.css')];

const tests: Test[] = [{
    expectedHints: ['axe/text-alternatives'],
    expectedTime: 26000,
    html: generateHTML(),
    name: 'Axe perf test',
    timeout: 40000
}, {
    expectedHints: ['axe/text-alternatives'],
    expectedTime: 40000,
    html: generateDeepHTML(),
    name: 'Axe deep perf test',
    timeout: 60000
}, {
    expectedHints: ['button-type'],
    expectedTime: 3000,
    hints: {
        'axe/aria': 'off',
        'axe/color': 'off',
        'axe/forms': 'off',
        'axe/keyboard': 'off',
        'axe/language': 'off',
        'axe/name-role-value': 'off',
        'axe/other': 'off',
        'axe/parsing': 'off',
        'axe/semantics': 'off',
        'axe/sensory-and-visual-cues': 'off',
        'axe/structure': 'off',
        'axe/tables': 'off',
        'axe/text-alternatives': 'off',
        'axe/time-and-media': 'off'
    },
    html: generateDeepHTML(),
    name: 'Button type perf test',
    timeout: 10000
}, {
    expectedHints: ['x-content-type-options'],
    expectedTime: 300,
    hints: {
        'axe/aria': 'off',
        'axe/color': 'off',
        'axe/forms': 'off',
        'axe/keyboard': 'off',
        'axe/language': 'off',
        'axe/name-role-value': 'off',
        'axe/other': 'off',
        'axe/parsing': 'off',
        'axe/semantics': 'off',
        'axe/sensory-and-visual-cues': 'off',
        'axe/structure': 'off',
        'axe/tables': 'off',
        'axe/text-alternatives': 'off',
        'axe/time-and-media': 'off'
    },
    html: generateHTML(),
    name: 'x-content-type-options perf test',
    timeout: 5000
}, {
    css: prefixOrderCSS,
    expectedHints: ['css-prefix-order'],
    expectedTime: 1000,
    hints: {
        'axe/aria': 'off',
        'axe/color': 'off',
        'axe/forms': 'off',
        'axe/keyboard': 'off',
        'axe/language': 'off',
        'axe/name-role-value': 'off',
        'axe/other': 'off',
        'axe/parsing': 'off',
        'axe/semantics': 'off',
        'axe/sensory-and-visual-cues': 'off',
        'axe/structure': 'off',
        'axe/tables': 'off',
        'axe/text-alternatives': 'off',
        'axe/time-and-media': 'off'
    },
    html: generateDeepHTML(prefixOrderCSS),
    name: 'CSS prefix order perf test',
    timeout: 5000
}];

const runTest = (test: Test) => {
    return getResults({
        userConfig: {
            hints: test.hints || [],
            language: 'en-us',
            parsers: ['css']
        }
    }, test, console.log);
};

const runTests = async () => {
    let ok = true;

    for (const test of tests) {
        console.log(`Running test: '${test.name}'`);
        try {
            const result = await runTest(test);

            if (result.totalTime < test.expectedTime!) {
                console.log(`Test '${test.name}' ok. (${result.totalTime}/${test.expectedTime})`);
            } else {
                ok = false;
                console.log(`Test '${test.name}' fails. (${result.totalTime}/${test.expectedTime})`);
            }
        } catch (e) {
            console.error(`Test '${test.name}' fails.\n`, e);
            ok = false;
        }
    }

    if (!ok) {
        console.error('Perf tests failed');
        process.exit(1); // eslint-disable-line no-process-exit
    }

    process.exit(0); // eslint-disable-line no-process-exit
};


runTests();
