import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import legacy from '@vitejs/plugin-legacy'
import {createSvgIconsPlugin} from 'vite-plugin-svg-icons'
// 开发环境使用import导入 CommonJS模块导入
import {viteCommonjs} from '@originjs/vite-plugin-commonjs'

// 在CSS和Javascript之间共享变量
import ViteCSSExportPlugin from "vite-plugin-css-export";


import path from "path";
// Convert CommonJS modules to ES6
// https://github.com/rollup/plugins/tree/6eb661692f5b8d8fc4e3b61ff748f49fab1e82ec/packages/node-resolve
import commonjs from '@rollup/plugin-commonjs';
import {nodeResolve} from '@rollup/plugin-node-resolve';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        nodeResolve(),
        viteCommonjs(), // 在commonjs插件之前
        commonjs(),
        legacy({ // 浏览器兼容
            targets: ['ie >= 11'],
            additionalLegacyPolyfills: ['regenerator-runtime/runtime']
        }),
        createSvgIconsPlugin({
            // 指定需要缓存的图标文件夹
            iconDirs: [path.resolve(process.cwd(), 'src/assets/svg'), path.resolve(process.cwd(), 'src/assets/icon/svg')],
            // 指定symbolId格式
            symbolId: 'icon-[name]',
            // inject: 'body-last',
            /**
             * custom dom id
             * @default: __svg__icons__dom__
             */
            customDomId: '__svg__icons__dom__',
        }),
        ViteCSSExportPlugin(),

    ],
    build: {
        brotliSize: false,
        chunkSizeWarningLimit: 1500,
        commonjsOptions: {
            include: [/design.config.js/], // 生产环境使用import导入 CommonJS模块导入
        }
    },
    define: {
        'process.env': {}
    },
    server: {
        // 反向代理（跨域处理）
        // proxy: {
        //     '/api': {
        //         target: 'https://api.test.com/api',
        //         changeOrigin: true,
        //         rewrite: (path) => path.replace(/^\/api/, '')
        //     },
        // },
    },
    resolve: {
        alias: [
            {
                find: "/@",
                replacement: path.resolve(__dirname, "./src"),
            },
            {
                find: "/@__dir",
                replacement: path.resolve(__dirname, "./"),
            }
        ],
    },
    css: {
        preprocessorOptions: {
            less: {
                javascriptEnabled: true,
                additionalData: `@import "/@/styles/index.less";`
            }
        }
    }
})
