// eslint-disable-next-line import/no-extraneous-dependencies
const path = require('path')

const isDev = process.env.NODE_ENV === 'development'
/**
 * Determine the array of extensions that should be used to resolve modules.
 */
module.exports = {
    resolve: {

        modules: [path.join(__dirname, 'src'), 'node_modules'],
        extensions: ['.js'],
        mainFields: ['browser', 'module', 'main'],
        alias: {
            vue$: isDev ? 'vue/dist/vue.runtime.js' : 'vue/dist/vue.runtime.min.js',
            '@': path.join(__dirname, './'), // helpers.root('src'),
            '@src': path.join(__dirname, './src/'), // helpers.root('src'),
            '@assets': path.join(__dirname, './assets/'), // helpers.root('src'),
        },
    },

}
