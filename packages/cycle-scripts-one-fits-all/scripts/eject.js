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
  test: 'mocha --colors --require babel-register src/**/**.test.js',
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

// Delete babel config in package.json
delete appPackageJson.babel

// Write the new package.json
const newPackageJson = Object.assign({}, appPackageJson, {scripts: scripts, devDependencies: devDependencies})
fs.writeFileSync(
  appPackageJsonPath,
  JSON.stringify(newPackageJson, null, 2)
)

mkdirp(scriptsPath, () => {
  function copy (script, subDir, inRoot) {
    subDir = subDir || ''
    fs.copySync(path.join(__dirname, subDir, script), path.join(inRoot ? '' : scriptsPath, script))
  }

  // Copy configs
  copy('.babelrc', 'configs', true)
  copy('webpack.config.js', 'configs', true)
})

