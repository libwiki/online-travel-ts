import Main from "../layouts/Main.vue"
export default [
    {
        path: '/',
        name: "index",
        component: Main,
        redirect: "/home",
        children: [
            {
                name: "home",
                path: '/home',
                components: {
                    default:()=>import("../views/Home.vue"),
                    nav: () => import("../views/nav/HomeNav.vue"),
                    left: () => import("../views/left/HomeLeft.vue"),
                    right: () => import("../views/right/HomeRight.vue"),
                },
                meta: {
                    title: "一键游南宁",
                    auth: true, // 是否验证登录权限
                }
            },
        ]
    },
]
