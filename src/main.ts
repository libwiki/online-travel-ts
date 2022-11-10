import {createApp} from 'vue'
import App from './App.vue'
import "normalize.css"
import 'animate.css'
import "./utils/flexible" // rem适配（根据屏幕大小自动设置html标签的fontSize）
import "./styles/tailwind.index.css"
import 'virtual:svg-icons-register'
import {createPinia} from "pinia";
import router from "./router";

const app = createApp(App)
app.use(createPinia()); // 状态管理器 文档参考：https://pinia.web3doc.top/
app.use(router); // 使用 路由 文档参考：https://next.router.vuejs.org/zh/introduction.html
app.mount('#app')
