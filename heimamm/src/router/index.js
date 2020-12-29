import { createRouter, createWebHashHistory } from "vue-router";
import NProgress from "nprogress"; //引入进度条
import "nprogress/nprogress.css"; //引入进度条样式

import Home from "../views/Home.vue";
import Login from "../views/Login.vue";

// NProgress配置
NProgress.configure({ showSpinner: false }); //禁用进度环

const routes = [
  {
    path: "/",
    redirect: '/login',
  },
  {
    path: "/login",
    name: "Login",
    component: Login
  },
  {
    path: "/home",
    redirect: '/chart',
    name: "Home",
    component: Home,
    children: [
      // 数据概览接口
      {
        path: '/chart',
        component: () => import("@/components/Chart")
      },
      // 用户接口
      {
        path: '/user',
        component: () => import("@/components/User")
      },
      // 题库接口question
      {
        path: '/question',
        component: () => import("@/components/Question"),
      },
      // 企业接口enterprise
      {
        path: '/enterprise',
        component: () => import("@/components/Enterprise")
      },
      // 学科接口subject
      {
        path: '/subject',
        component: () => import("@/components/Subject")
      },
    ]
  },
  // 题库添加
  { path: '/addquestion', component: () => import("@/components/Addquestion") },
  // 题库编辑
  { path: '/eildquestion', component: () => import("@/components/Eildquestion") },
];


const router = createRouter({
  history: createWebHashHistory(),
  routes
});

// 添加路由前置守卫
// to：代表要去那个路由
// from：代表来自哪个路由
// next：下一步去哪里，next()代表放行，如果next("/login")代表强制跳转到到login路由
router.beforeEach((to, from, next) => {
  // 开启进度条
  NProgress.start();
  // 获取token
  let isAuthenticated = window.sessionStorage.getItem("token");
  // 1. 去登录页时不拦截   2. 检测是否获取token经过校验
  // 不是去登录页，且没有经过校验 跳转至登录页面
  if (to.name !== "Login" && !isAuthenticated) {
    // 强制转到login
    next({
      name: "Login"
    });
  } else {
    const toDepth = to.path.split("/").length;
    const fromDepth = from.path.split("/").length;
    // 判断后退时 是否缓存
    if (toDepth < fromDepth) {
      // console.log('back...')
      // 离开页面 不缓存
      from.meta.keepAlive = false;
      // 进入页面 缓存
      to.meta.keepAlive = true;
    }
    // 放行
    next();
  }
});
router.afterEach(() => {
  // 终止进度条
  NProgress.done();
});


export default router;
