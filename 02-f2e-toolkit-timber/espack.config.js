const espack = require('104-f2e-es6-pack-toolkit');
const fse = require('fs-extra');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const gulp = require('gulp');
const DashboardPlugin = require('webpack-dashboard/plugin');
const DashBoard = require('webpack-dashboard');

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
 * @param {string} fileName
 */
const mockData = (fileName = '') => {
    // mock 掉的 php functions
    const mockPHPFunctions = {
        wp_head: () => 'This is wp_head hook result.',
        wp_footer: () => 'This is wp_footer hook result.',
    }
    // mock 掉的 Timber API
    const mockTimberAPI = {
        function: (fn, ...args) => (fn in mockPHPFunctions) ? mockPHPFunctions[fn](...args) : null
    }
    // 注入 global 的 mock 資料
    const globalMockData = {
        // TODO: 根據 Timber Stater Theme 決定要 mock 哪些內建的 WP 資料口
        body_class: '',
        sidebar: '',
        sidebar_class: '',
        title: '',
        site: {
            url: '',
            name: '',
            site_url: '',
        },
        posts: [
            {
                post_type: 'post',
                title: 'Demo Paragraph',
                content: 'This is Demo Content',
                author: 'nobody'
            }
        ],
        menu: {
            get_items: '',
        },
        user: {
            email: '',
            name: '',
            link: '',

        },
        ...mockTimberAPI
    };

    // 注入特定幾頁的 mock 資料
    const pageMockData = {
        './index': {
            foo: 'bar',
        },
        './comment-form': {
            post: {
                id: '',
            },
            comment: {
                ID: '',
            }
        }
    };

    return (fileName in pageMockData) 
        ? { ...globalMockData, ...pageMockData[fileName]}
        : globalMockData;
}

module.exports = {
    ignorePage: [],
    webpack(config, { dev }){
        // 置換 view engine
        config.module.rules.unshift({ test: /\.twig$/, loader: 'twig-loader' });

        // twig 檔 require 不用加副檔名
        config.resolve.extensions.push('.twig');

        // 加入 webpack dashboard
        if(dev){
            config.plugins.push(new DashboardPlugin(new DashBoard().setData));
        }


        return espack
            .setConfig(config)
            .htmlPluginOptions((option, filename) => {
                // ejs 樣版改成套用 twig 樣板，並帶入 mockData
                const name = filename.replace('.html', '');
                return { 
                    template: `./src/templates/${name}.twig`,
                    payload: mockData(name),
                };
            })
            .config;
    },
    devServer: {
        quiet: true,
    },
    async processEnd() {
        await copyTemplateToBuild();
    }
};
