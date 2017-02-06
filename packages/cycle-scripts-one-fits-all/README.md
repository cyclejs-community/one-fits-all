# one-fits-all flavour

[Cycle-app](https://github.com/cyclejs-community/create-cycle-app) flavor.

## Language

ES6 or Typescript 2.1 configured with:
* TypeScript ```target: ES6``` transpiles to ES6 with [```lib: DOM,ES6,DOM.Iterable,ScriptHost```](http://www.typescriptlang.org/docs/handbook/compiler-options.html) and piped through Babel
* Babel targets ES5 with [ES2015 preset](https://babeljs.io/docs/plugins/preset-es2015/)
 
## Bundler

Webpack is configured using [webpack-blocks](https://github.com/andywer/webpack-blocks)
* [Webpack dev server](https://webpack.js.org/configuration/dev-server)
* [Hot Module Replacement](https://webpack.js.org/concepts/hot-module-replacement/)

## Scripts

- `npm start`: Start development server listening on port 8000
- `npm test`: Run the default test tool
- `npm run build`: Generate a production-ready build content, on the `build` folder (this folder is *gitignored*)
- `npm run eject`: Copy flavor's dependencies and configurations to the project folder, update `package.json` and remove the dependency on the flavored `cycle-scripts`. This is irreversible.


## Boilerplate:

The flavor generate the following file structure:

```
my-awesome-cycle-app/
├── node_modules/
├── public/
│   ├── favicon.png
│   └── favicon.ico
├── src/
│   ├── css
│   │   └── styles.scss
│   ├── app.tsx
│   ├── app.test.js
│   └── index.ts
├── .gitignore
├── package.json
├── tsconfig.json
├── tslint.json
└── index.ejs
```

### Config files
* .babelrc (Added on the root after running the eject script)
* webpack.config.js (Added on the root after running the eject script)
