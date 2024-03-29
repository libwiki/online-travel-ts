import v1 from "./v1";
import * as VueRouter from "vue-router"
import {RouteRecordRaw, RouteRecordRedirectOption} from "vue-router";

const router = VueRouter.createRouter({
    // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
    history: VueRouter.createWebHistory(import.meta.env.BASE_URL),
    routes: [...v1], // `routes: routes` 的缩写
})

router.beforeEach(async (to, from) => {
    if (!to.meta.auth) {
        return true;
    }
    if (!to.query.user) {

    }
    // const userStore = useUserInfoStore();
    // if (!await userStore.login(to.query.user)) {
    //     return true
    // }
    return true
})
// const v:RouteRecordRaw={
//     path: "",
//     redirect: "",
//     children: [],
//     component: ()=>{},
// }
// router.addRoute(v)
export default router
