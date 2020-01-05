#! /usr/bin/env node

const parseArgs = require('minimist');
const babel = require('@babel/core');
const glob = require('glob');
const path = require('path');
const fs = require('fs');
const Listr = require('listr');
const reactTransformClassnameToCssModules = require('babel-plugin-react-transform-classname-to-css-modules');

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
const parsedArgs = parseArgs(process.argv);

const jsxPath = parsedArgs.jsxPath || '**/*.js'; // TODO: add jsx 
const stylesPath = parsedArgs.stylesPath || '**/*.css';
const outPath = parsedArgs.outPath || 'modulized/';


const ignore = ['**/node_modules/**', path.join(outPath, '**')];

const tasks = new Listr([
  {
    title: 'List jsx files',
    task: ctx => {
      ctx.jsFiles = glob.sync(jsxPath, {ignore}); 
    }
  },
  {
    title: 'List css files',
    task: ctx => {
      ctx.cssFiles = glob.sync(stylesPath, {ignore});
    }
  },
  {
    title: 'Modulize css',
    task: ctx => {
      const { jsFiles, cssFiles } = ctx;

      for (const jsFile of jsFiles) {

        const plugin = [
          reactTransformClassnameToCssModules,
          {
            filesPaths: cssFiles,
            jsxFilePath: jsFile
          }
        ];

        const transformed = babel.transform(readFile(jsFile), {plugins:[plugin]});
        const code = transformed.code;

        writeFile(path.join(outPath, jsFile), code);
      }
    }
  }
]);

tasks.run();
