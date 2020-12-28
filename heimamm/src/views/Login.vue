<template>
  <a-layout>
    <!-- 整体盒子 -->
    <div class="login-container">
      <!-- 左侧盒子 -->
      <div class="left-box">
        <!-- 顶部标题 -->
        <div class="title-box">
          <img src="../assets/login_logo.png" alt="" />
          <span class="title">黑马面面</span>
          <span class="line"></span>
          <span class="sub-title">用户登录</span>
        </div>
        <!-- 表单 -->
        <a-form :model="Loginmodel" :rules="Loginrules" ref="Loginref">
          <a-row>
            <a-col :span="24">
              <!-- 手机号 开始 -->
              <a-form-item
                name="phone"
                :wrapperCol="{ span: 22 }"
                style="margin-left: 45px"
              >
                <a-input
                  v-model:value="Loginmodel.phone"
                  size="large"
                  placeholder="请输入手机号"
                >
                  <template #prefix
                    ><UserOutlined style="color: rgba(0, 0, 0, 0.25)"
                  /></template>
                </a-input>
              </a-form-item>
              <!-- 手机号 结束 -->

              <!-- 密码 开始 -->
              <a-form-item
                name="password"
                :wrapperCol="{ span: 22 }"
                style="margin-left: 45px"
              >
                <a-input-password
                  v-model:value="Loginmodel.password"
                  size="large"
                  placeholder="请输入密码"
                >
                  <template #prefix
                    ><LockOutlined style="color: rgba(0, 0, 0, 0.25)"
                  /></template>
                </a-input-password>
              </a-form-item>
              <!-- 密码 结束 -->
            </a-col>
          </a-row>
        </a-form>
      </div>
      <!-- 右侧图片 -->
      <img src="../assets/login_banner_ele.png" alt="" />
    </div>
  </a-layout>
</template>

<script>
// 图标
import { UserOutlined, LockOutlined } from "@ant-design/icons-vue";

export default {
  components: {
    UserOutlined,
    LockOutlined,
  },
  data() {
    // 手机自定义表单校验
    let checkPhone = async (rule, value) => {
      if (value === "") {
        return Promise.reject("请输入您的手机号");
      } else if (!/^[1]([3-9])[0-9]{9}$/.test(value)) {
        // 如果手机号格式错误，那么提示
        return Promise.reject("您的手机号格式错误!");
      } else {
        return Promise.resolve();
      }
    };
    return {
      Loginmodel: {
        phone: "18511111111",
        password: "12345678",
      },
      Loginrules: {
        phone: [
          {
            required: true,
            message: "手机不能为空",
            trigger: "blur",
          },
          { validator: checkPhone, trigger: "change" },
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur",
          },
          {
            min: 6,
            max: 12,
            message: "密码的长度为6-12位",
            trigger: "blur",
          },
        ],
      },
    };
  },
};
</script>


<style>
.ant-layout {
  height: 937px;
}

/* 整体盒子的CSS */
.login-container {
  height: 100%;
  background: linear-gradient(
    225deg,
    rgba(20, 147, 250, 1),
    rgba(1, 198, 250, 1)
  );
  /* 开启弹性布局 */
  display: flex;
  /* 上下居中 */
  align-items: center;
  /* 左右均分 */
  justify-content: space-around;
}

.left-box {
  width: 478px;
  background-color: #f5f5f5;
  height: 550px;
  /* // 设置样式 把 表单间隙空出来 */
  padding-right: 41px;
  box-sizing: border-box;
}

.title-box {
  display: flex;
  align-items: center;
  margin-top: 44px;
  margin-left: 48px;
  margin-bottom: 27px;
  color: black;
}

.title {
  font-size: 24px;
  margin-left: 16px;
  margin-right: 14px;
}

.line {
  width: 1px;
  height: 28px;
  background-color: #c7c7c7;
}

.sub-title {
  font-size: 21px;
  margin-left: 12px;
}

.login-code {
  width: 100%;
  height: 40px;
}

/* 底部的按钮 */
.my-btn {
  width: 100%;
  margin-top: 26px;
  margin-left: 0;
}
</style>