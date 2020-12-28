import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

// 使用Ant-Design-Vue
import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";

//  使用axios
import axios from "axios";
// 本地地址(你在自己的电脑上配置了后台服务和mysql数据库)
axios.defaults.baseURL = "http://127.0.0.1/heimamm/public";

// 文本框编辑器
import CKEditor from "@ckeditor/ckeditor5-vue";

let app = createApp(App);
app.config.globalProperties.$axios = axios;

app
  .use(router)
  .use(Antd)
  .use(CKEditor)
  .mount("#app");
