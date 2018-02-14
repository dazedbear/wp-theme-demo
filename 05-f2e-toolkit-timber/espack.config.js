const espack = require('104-f2e-es6-pack-toolkit');
const fse = require('fs-extra');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const gulp = require('gulp');

/**
 * 將 twig 模板複製到 build 以供 theme 直接使用
 */
const copyTemplateToBuild = () => {
    // TODO: 確認 base tag 是否會影響 theme 運作
    return new Promise((resolve) => {
        gulp
            .src(['./src/templates/*'])
            .pipe(gulp.dest('./build/templates'))
            .on('end', () => resolve());
    })
}

/**
 * 將假資料傳給特定模板使用
 * @param {*} page 
 * @param {*} data 
 */
const injectDataToTemplate = (page = '', data = {}) => {
    // TODO: global

    // TODO: local per page
}

module.exports = {
    ignorePage: [],
    webpack(config, { dev }){
        // 置換 view engine
        config.module.rules.unshift({ test: /\.twig$/, loader: 'twig-loader' });
        
        // twig 檔 require 不用加副檔名
        config.resolve.extensions.push('.twig');

        // ejs 樣版改成套用 twig 樣板
        config.plugins.forEach((plugin) => {
            if (plugin instanceof HtmlWebpackPlugin) {
                const options = plugin.options;
                const chunkName = options.chunks[0];
                const fileName = options.filename.replace('.html', '');
                const excludeChunks = ['__about__'];

                // 例外清單內的 chunk 仍沿用 ejs 樣板，其餘使用 twig 樣板
                if(excludeChunks.indexOf(chunkName) === -1){
                    options.template = `./src/templates/${fileName}.twig`;
                }
            }
        });
        return config;
    },
    devServer: {},
    async processEnd() {
        await copyTemplateToBuild();
    }
};
