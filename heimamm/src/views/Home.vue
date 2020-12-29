<template>
  <a-layout id="components-layout-demo-custom-trigger">
    <a-layout-header style="background: #fff; padding: 0">
      <a-row>
        <a-col :span="1">
          <menu-unfold-outlined
            v-if="collapsed"
            class="trigger"
            @click="() => (collapsed = !collapsed)"
          />
          <menu-fold-outlined
            v-else
            class="trigger"
            @click="() => (collapsed = !collapsed)"
          />
        </a-col>
        <a-col :span="23">
          <div class="handerPe">
            <div class="hander_left">
              <img src="../assets/login_logo.png" alt="" />
              <h2>黑马面面</h2>
            </div>
            <div class="hander_right">
              <img :src="info.avatar" alt="" />
              <span>{{ info.username }},你好</span>
              <a-button type="primary" @click="logout"> 退出 </a-button>
            </div>
          </div>
        </a-col>
      </a-row>
    </a-layout-header>

    <a-layout>
      <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible>
        <!-- <div class="logo" /> -->
        <a-menu theme="dark" mode="inline" v-model:selectedKeys="selectedKeys">
          <a-menu-item key="1">
            <user-outlined />
            <span><router-link to="/chart">数据概览</router-link></span>
          </a-menu-item>
          <a-menu-item key="2">
            <video-camera-outlined />
            <span><router-link to="/user">用户列表</router-link></span>
          </a-menu-item>
          <a-menu-item key="3">
            <upload-outlined />
            <span><router-link to="/question">题库列表</router-link></span>
          </a-menu-item>
          <a-menu-item key="4">
            <upload-outlined />
            <span> <router-link to="/enterprise">企业列表</router-link></span>
          </a-menu-item>
          <a-menu-item key="5">
            <upload-outlined />
            <span><router-link to="/subject">学科列表</router-link></span>
          </a-menu-item>
        </a-menu> </a-layout-sider
      ><a-layout-content
        :style="{
          padding: '24px',
          background: '#0094ff',
        }"
      >
        <router-view></router-view>
      </a-layout-content>
    </a-layout>

    <a-layout-footer>Footer</a-layout-footer>
  </a-layout>
</template>

<script>
import { httpGet } from "@/utils/http.js";

import { createVNode } from "vue";
import { Modal } from "ant-design-vue";

import {
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons-vue";

export default {
  data() {
    return {
      selectedKeys: ["1"],
      collapsed: false,

      info: [],
    };
  },
  created() {
    this.GetInfo();
  },
  methods: {
    // 获取用户基本信息
    GetInfo() {
      httpGet(`/info`)
        .then((res) => {
          console.log(res);
          let { data, code } = res;
          if (code == 206) {
            this.$message.warning("登录状态有误，请重新登录");
            // window.sessionStorage.removeItem("token");
            // this.$router.push("/login");
          }
          if (code == 200) {
            data.avatar = process.env.VUE_APP_URL + "/" + data.avatar;
            this.info = data;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // 退出登录
    logout() {
      let that = this;
      Modal.confirm({
        title: "删除",
        content: "确定退出！！",
        icon: createVNode(ExclamationCircleOutlined),
        okText: "确认",
        cancelText: "取消",
        onOk() {
          httpGet(`/logout`)
            .then((res) => {
              console.log(res);
              let { code } = res;
              if (code == 200) {
                that.$message.success("已退出登录");
                that.$router.push("/login");
                window.sessionStorage.removeItem("token");
              }
            })
            .catch((err) => {
              console.log(err);
            });
        },
      });
    },
  },
  components: {
    UserOutlined,
    VideoCameraOutlined,
    UploadOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
  },
};
</script>
<style scoped>
#app .ant-layout {
  background-color: #f0f2f5;
}
/* .ant-layout-content {
  display: none;
} */
.ant-layout .ant-layout-sider,
.ant-menu-dark {
  background: #ffffff;
}

.ant-menu-dark .ant-menu-item .anticon {
  /* color: #3c3d3f; */
  color: #bdb0ab;
}

.ant-menu-dark .ant-menu-item span {
  color: #3c3d3f;
  /* color: #bdb0ab; */
}

.ant-menu.ant-menu-dark .ant-menu-item-selected {
  background: #ecf5ff;
}

.ant-menu-dark .ant-menu-item-selected .anticon + span {
  color: #3c3d3f;
}

#components-layout-demo-custom-trigger .trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

#components-layout-demo-custom-trigger .trigger:hover {
  color: #1890ff;
}

#components-layout-demo-custom-trigger .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
}

.handerPe {
  height: 100%;
  /* background-color: red; */
}
.hander_left {
  float: left;
  display: flex;
  /* justify-items: center; */
  align-items: center;
}
.hander_left h2 {
  display: inline-block;
  margin: 0 10px;
}
.hander_right {
  float: right;
  display: flex;
  /* justify-items: center; */
  align-items: center;
}
.hander_right img {
  width: 30px;
}
.hander_right span {
  margin: 0px 30px 0px 10px;
}

.hander_right .ant-btn {
  margin: 0 10px;
}
.hander_left img {
  width: 26px;
}
</style>