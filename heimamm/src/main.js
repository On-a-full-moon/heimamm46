import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css'; // or 'ant-design-vue/dist/antd.less'

// 富文本
import CKEditor from '@ckeditor/ckeditor5-vue';

const app = createApp(App)
app
  .use(router)
  .use(Antd)
  .use(CKEditor)
  .mount("#app");
