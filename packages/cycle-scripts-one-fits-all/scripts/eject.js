'use strict'

const fs = require('fs-extra')
const path = require('path')
const mkdirp = require('mkdirp')
const merge = require('deepmerge')

const ownPackageJsonPath = path.resolve(__dirname, '..', 'package.json')
const appPackageJsonPath = path.join(process.cwd(), 'package.json')
const ownPackageJson = JSON.parse(fs.readFileSync(ownPackageJsonPath))
const appPackageJson = JSON.parse(fs.readFileSync(appPackageJsonPath))
const scriptsPath = path.join(process.cwd(), '.scripts')

// Declaring new scripts
const scripts = {
  start: 'cross-env NODE_ENV=development webpack-dev-server --config configs/webpack.config.js',
  test: 'cross-env NODE_ENV=test nyc mocha-webpack --timeout=100000 --colors --webpack-config configs/webpack.config.test.js test/**/*.test.*',
  build: 'cross-env NODE_ENV=production webpack --config configs/webpack.config.js',
  clean: 'rimraf build .tmp .nyc_output coverage'
}

// Declare the new dependencies, excluding self
let devDependencies = {}
Object.keys(appPackageJson.devDependencies)
  .filter(dep => dep !== ownPackageJson.name)
  .filter(dep => dependencies.indexOf(dep) === -1)
  .forEach(dep => {
    devDependencies[dep] = appPackageJson.devDependencies[dep]
  })
devDependencies = Object.assign({}, devDependencies, ownPackageJson.dependencies)

// Write the new package.json
const newPackageJson = Object.assign({}, appPackageJson, {scripts: scripts, devDependencies: devDependencies})
fs.writeFileSync(
  appPackageJsonPath,
  JSON.stringify(newPackageJson, null, 2)
)

const babelrc = fs.existsSync(path.join(process.cwd(), '.babelrc')) ?
    merge(require('../configs/babelrc.json'), JSON.parse(fs.readFileSync(path.join(process.cwd(), '.babelrc')))) :
    require('../configs/babelrc.json');

fs.writeFileSync(
    path.join(process.cwd(), '.babelrc'),
    JSON.stringify(babelrc, null, 2)
)

fs.mkdirSync(path.join(process.cwd(), 'configs'));
fs.copySync(path.join(__dirname, '..', 'configs', 'webpack.config.js'), 'configs/webpack.config.js')
fs.copySync(path.join(__dirname, '..', 'configs', 'webpack.config.test.js'), 'configs/webpack.config.test.js')

fs.copySync(path.join(__dirname, '..', 'configs', 'tsconfig.json'), 'tsconfig.json')
