# react-css-modulizer
[![npm version](https://img.shields.io/npm/v/react-css-modulizer.svg?style=flat-square)](https://www.npmjs.com/package/react-css-modulizer)
[![downloads](https://img.shields.io/npm/dm/react-css-modulizer.svg?style=flat-square)](https://npm-stat.com/charts.html?package=react-css-modulizer)

A CLI to convert classnames attributes in React into CSS Modules.

## Table of Contents
- [Motivation](#motivation)
- [Supported className expressions](#supported-classname-expressions)
- [Install](#install)
- [Usage](#usage)
- [className expression output format](#classname-expression-output-format)

## Motivation
CSS Modules are neat. If you have an (old) React project using plain string ```className``` attributes with CSS files, and you want to migrate it to CSS Modules, there was no automated way of doing it.
You may manage to do some stuff with [babel-plugin-react-css-modules](https://github.com/gajus/babel-plugin-react-css-modules) but it requires adding import statements if you don't have them already on each file.

With this CLI, in a single command you can do the conversion.

## Supported className expressions
Currently it supports two types of className expressions :
- String Literal :
```jsx harmony
<div className='alert alert-primary'/>
``` 
- String Literal inside a JSX Expression Container
```jsx harmony
<div className={'alert alert-primary'}/>
```

## Install
```bash
// npm
npm install -g react-css-modulizer

// yarn
yarn global add react-css-modulizer
```

## Usage
Go into the project you want to convert to CSS Modules. Assuming all your sources are under a ```src/``` folder, run :
```bash
react-css-modulizer --path='src'
```

This will :
 - search among all files under ```src/```
 - read ```className``` attributes in ```*.js``` and ```*.jsx``` files
 - read classes in ```*.css``` files
 - figure out which className attribute refers to which css file
 - copy whole ```src/``` folder under a ```modulized/``` folder
 - apply conversion to CSS Modules under ```modulized/```, modifying ```className``` attributes and adding ```import``` statements for css files

### Command line options
| Name       | Descritpion                        | Type   | Default value   |
|------------|------------------------------------|--------|-----------------|
| path       | Project relative path              | string | src/            |
| jsxPath    | React files globbing pattern       | string | **/{*.js,*.jsx} |
| stylesPath | CSS files globbing pattern         | string | **/*.css        |
| outPath    | Modulized project copy output path | string | modulized/      |
| debug      | Run in debug if set                | string | false           |

## className expression output format
Currently the output form is always the same :
- Single class attribute :

input:
```jsx harmony
<div className={'alert'}/>
```
output:
```jsx harmony
import styles from 'css/alerts.css';

/* ... */

<div className={styles.alert}/> // it gives a simple member expression
```
- Multiple classes attribute :


input:
```jsx harmony
<div className={'alert alert-primary'}/>
```
output:
```jsx harmony
import styles from 'css/alerts.css';

/* ... */

<div className={`${styles.alert} ${styles.alertPrimary}`}/> // it uses a template litteral
```
