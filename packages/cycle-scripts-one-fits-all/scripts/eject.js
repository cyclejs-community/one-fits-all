'use strict'

const fs = require('fs-extra')
const path = require('path')
const mkdirp = require('mkdirp')

const ownPackageJsonPath = path.resolve(__dirname, '..', 'package.json')
const appPackageJsonPath = path.join(process.cwd(), 'package.json')
const ownPackageJson = JSON.parse(fs.readFileSync(ownPackageJsonPath))
const appPackageJson = JSON.parse(fs.readFileSync(appPackageJsonPath))
const scriptsPath = path.join(process.cwd(), '.scripts')

// Declaring new scripts
const scripts = {
  start: 'NODE_ENV=development webpack --config webpack.config.js',
  test: 'NODE_ENV=test nyc mocha-webpack --timeout=10000 --colors --webpack-config webpack.config.test.js test/**/*.test.*',
  build: 'NODE_ENV=production webpack --config webpack.config.js'
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

fs.writeFileSync(
    path.join(process.cwd(), '.babelrc'),
    JSON.stringify(appPackageJson.babel)
)

// Delete babel config in package.json
delete appPackageJson.babel

fs.copySync(path.join(__dirname, 'configs', 'webpack.config.js'), 'webpack.config.js')
fs.copySync(path.join(__dirname, 'configs', 'webpack.config.test.js'), 'webpack.config.test.js')
