#! /usr/bin/env node

const parseArgs = require('minimist');
const babel = require('@babel/core');
const glob = require('glob');
const path = require('path');
const css = require("css");
const {extractClassnames} = require("../cssExtractor");
const reactTransformClassnameToCssModules = require('babel-plugin-react-transform-classname-to-css-modules');
const Sequence = require('context-sequence');
const fs = require('fs-extra');

function readFile(relPath) {
  const absPath = path.join(process.cwd(), relPath);
  return fs.readFileSync(absPath, 'utf-8');
}

function writeFile(relPath, content) {
  const absPath = path.join(process.cwd(), relPath);
  fs.mkdirSync(path.dirname(relPath), {recursive: true});
  return fs.writeFileSync(absPath, content, 'utf-8');
}

// parse args
const parsedArgs = parseArgs(process.argv); // TODO: display help

const projectPath = parsedArgs['path'] || 'src/';
const jsxPath = projectPath + (parsedArgs['jsxPath'] || '**/{*.js,*.jsx}'); // TODO: better join with globing pattern
const stylesPath = parsedArgs['stylesPath'] || '**/*.css';
const outPath = parsedArgs['outPath'] || 'modulized/';
const debug = parsedArgs['debug'] || false;

const ignore = ['**/node_modules/**', path.join(outPath, '**')];

const tasks = new Sequence([
  {
    task(_, ctx) {
      ctx.jsxFilesPaths = glob.sync(jsxPath, {ignore});
    }
  },
  {
    task(_, ctx) {
      const cssFiles = glob.sync(stylesPath, {ignore});

      ctx.stylesFilesData = cssFiles.map(cssFile => {
        let entry = {};
        entry.path = cssFile;
        const cssCode = readFile(cssFile);
        const parsed = css.parse(cssCode);
        entry.classnames = extractClassnames(parsed);
        return entry;
      });
    }
  },
  {
    task() {
      fs.copySync(projectPath, path.join(outPath, projectPath));
    }
  },
  // TODO : check for collisions / conflicts and ask for details
  // types of conflicts :
  // - multiple files have the same classes
  // - one file has the same class multiple times
  {
    task(_, ctx) {
      const {jsxFilesPaths, stylesFilesData} = ctx;

      for (const jsxFilePath of jsxFilesPaths) {

        const plugin = [
          reactTransformClassnameToCssModules,
          {
            stylesFilesData,
            jsxFilePath,
            debug
          }
        ];

        const transformed = babel.transform(readFile(jsxFilePath), {plugins: [plugin]});
        const code = transformed.code;

        writeFile(path.join(outPath, jsxFilePath), code);

      }
    }
  }
]);

tasks.run();
