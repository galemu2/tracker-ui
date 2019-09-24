import dotenv from 'dotenv';
import express from 'express';
import proxy from 'http-proxy-middleware';
import SourceMapSupport from 'source-map-support';

import render from './render.jsx';

const app1 = express();

SourceMapSupport.install();
dotenv.config({ path: '/home/galemu00/Documents/JavaScript/React/proMERN/mern-2/ui/sample.env' });
// '/home/galemu00/Documents/JavaScript/React/proMERN/mern-2/ui/sample.env'
// TODO may need to move the .env file to root

const enableHMR = (process.env.ENABLE_HMR || 'true') === 'true';
if (enableHMR && (process.env.NODE_ENV !== 'production')) {
    console.log('Adding dev middleWare, enabling HMR');
    /* eslint "global-require": "off" */
    /* eslint "import/no-extraneous-dependencies":"off" */
    const webpack = require('webpack');
    const devMiddleware = require('webpack-dev-middleware');
    const hotMiddleware = require('webpack-hot-middleware');

    const config = require('../webpack.config.js')[0];
    config.entry.app.push('webpack-hot-middleware/client');
    config.plugins = config.plugins || [];
    config.plugins.push(new webpack.HotModuleReplacementPlugin());

    const compilr = webpack(config);
    app1.use(devMiddleware(compilr));
    app1.use(hotMiddleware(compilr));
}

const staticMidelware = express.static('public');
app1.use(staticMidelware);

const apiProxyTarget = process.env.API_PROXY_TARGET;
if (apiProxyTarget) {
    app1.use('/graphql', proxy({ target: apiProxyTarget, changeOrigin: true }));
    app1.use('/auth', proxy({ target: apiProxyTarget, changeOrigin: true }));
}

if (!process.env.UI_API_ENDPOINT) {
    process.env.UI_API_ENDPOINT = 'http://localhost:3000/graphql';
}
if (!process.env.UI_SERVER_API_ENDPOINT) {
    process.env.UI_SERVER_API_ENDPOINT = process.env.UI_API_ENDPOINT;
}
if (!process.env.UI_AUTH_ENDPOINT) {
    process.env.UI_AUTH_ENDPOINT = 'http://localhost:3000/auth';
}

app1.get('/env.js', (req, res) => {
    const env = {
        UI_API_ENDPOINT: process.env.UI_API_ENDPOINT,
        UI_AUTH_ENDPOINT: process.env.UI_AUTH_ENDPOINT,
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    };
    // console.log('>> env: ', JSON.stringify(env));
    res.send(`window.ENV = ${JSON.stringify(env)}`);
});

app1.get('*', (req, res, next) => {
    render(req, res, next);
});

const port = process.env.PORT || 8000;

app1.listen(port, () => {
    console.log(`UI started on port ${port}`);
});

if (module.hot) {
    module.hot.accept('./render.jsx');
}
