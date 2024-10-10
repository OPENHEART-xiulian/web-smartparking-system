import { getPluginsList } from "./build/plugins";
import { exclude, include } from "./build/optimize";
import { type ConfigEnv, loadEnv, type UserConfigExport } from "vite";
import AutoImport from "unplugin-auto-import/vite"; //使用后可以不手动引入ref reactive onMounted这些api
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import {
  __APP_INFO__,
  alias,
  pathResolve,
  root,
  wrapperEnv
} from "./build/utils";

export default ({ mode }: ConfigEnv): UserConfigExport => {
  const { VITE_CDN, VITE_PORT, VITE_COMPRESSION, VITE_PUBLIC_PATH } =
    wrapperEnv(loadEnv(mode, root));
  return {
    base: VITE_PUBLIC_PATH,
    root,
    resolve: {
      alias
    },

    // 服务端渲染
    server: {
      // 端口号
      port: VITE_PORT,
      open: true, // 是否自动打开浏览器
      host: "0.0.0.0",
      // 本地跨域代理 https://cn.vitejs.dev/config/server-options.html#server-proxy
      proxy: {
        "/api": {
          // 这里填写后端地址
          target: "http://127.0.0.1:3000",
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, "")
        }
      },
      // 预热文件以提前转换和缓存结果，降低启动期间的初始页面加载时长并防止转换瀑布
      warmup: {
        clientFiles: ["./index.html", "./src/{views,components}/*"]
      }
    },
    plugins: [
      getPluginsList(VITE_CDN, VITE_COMPRESSION),
      AutoImport({
        dts: "./types/auto-imports.d.ts", // 会在根目录生成auto-imports.d.ts，里面可以看到自动导入的api
        include: [/\.[tj]sx?$/, /\.vue$/], // 匹配的文件，也就是哪些后缀的文件需要自动引入
        resolvers: [ElementPlusResolver({ importStyle: "sass" })],
        imports: [
          // 自动引入的api从这里找
          "vue",
          "vue-router",
          // 详细配置
          {
            "@vueuse/core": [
              // named imports
              "useMouse", // import { useMouse } from '@vueuse/core',
              // alias
              ["useFetch", "useMyFetch"] // import { useFetch as useMyFetch } from '@vueuse/core',
            ],
            axios: [
              // default imports
              ["default", "axios"] // import { default as axios } from 'axios',
            ]
          }
        ]
      })
    ],
    // https://cn.vitejs.dev/config/dep-optimization-options.html#dep-optimization-options
    optimizeDeps: {
      include,
      exclude
    },
    build: {
      // https://cn.vitejs.dev/guide/build.html#browser-compatibility
      target: "es2015",
      sourcemap: false,
      // 消除打包大小超过500kb警告
      chunkSizeWarningLimit: 4000,
      rollupOptions: {
        input: {
          index: pathResolve("./index.html", import.meta.url)
        },
        // 静态资源分类打包
        output: {
          chunkFileNames: "static/js/[name]-[hash].js",
          entryFileNames: "static/js/[name]-[hash].js",
          assetFileNames: "static/[ext]/[name]-[hash].[ext]"
        }
      }
    },
    define: {
      __INTLIFY_PROD_DEVTOOLS__: false,
      __APP_INFO__: JSON.stringify(__APP_INFO__)
    }
  };
};
