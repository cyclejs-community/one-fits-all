## Your amazing project

Thanks for using the `one-fits-all` flavor.

### Using your app

Run in development mode: `npm start`
Build a production build: `npm run build`
Run the unit tests: `npm test`

### Extending the configuration

If you want to add custom config to webpack, you can do it! Just edit the `webpack.config.js` in your app's root directory. It will be merged with the default config.

Example: Adding the progress bar plugin:
```javascript
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

module.exports = {
    plugins: [
        new ProgressBarPlugin()
    ]
}
```
Example: Add API proxy for devServer
```javascript
module.exports = {
    devServer: {
        proxy: {
            "/api": "http://localhost:3000"
        }
    }
}
```
