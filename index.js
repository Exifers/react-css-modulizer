#! /usr/bin/env node

const parseArgs = require('minimist');

const parsedArgs = parseArgs(process.argv);

const srcPaths = parsedArgs._.slice(2);
const jsxRegex = parsedArgs.jsxRegex;
const stylesRegex = parsedArgs.stylesRegex;


