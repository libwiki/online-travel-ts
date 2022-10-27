const config = require("./design.config");
module.exports = {
    plugins: {
        'postcss-import': {},
        '@tailwindcss/nesting': 'postcss-nesting',
        tailwindcss: {},
        autoprefixer: {},
        'postcss-pxtorem': { // https://github.com/cuth/postcss-pxtorem
            // rootValue: config.rootValue,
            rootValue({file}) { // 处理vant组件库的适配
                return file.indexOf('vant') !== -1 ? 150 : config.rootValue;
            },
            propList: ['*', '!border'],
            selectorBlackList: ['.px--', '.tw-'], // 忽略的.px-- .tw-前缀的类、
        },
    },
}
