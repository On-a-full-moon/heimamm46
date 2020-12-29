<template>
  <a-layout>
    <a-layout-header></a-layout-header>

    <a-layout-content>
      <a-row class="imgs" type="flex" justify="space-around">
        <!--  -->
        <a-col class="tabelbox">
          <div class="topText">
            <img src="../assets/login_logo.png" alt="" class="logoImg" />
            <span class="span1">黑马面面</span>
            <span class="span2">用户登录</span>
          </div>
          <a-form
            layout="vertical"
            :model="formInline"
            ref="ruleForm"
            :rules="rules"
          >
            <a-form-item name="phone">
              <a-input
                v-model:value="formInline.phone"
                placeholder="请输入手机号"
                size="large"
              >
                <template #prefix
                  ><UserOutlined style="color: rgba(0, 0, 0, 0.25)"
                /></template>
              </a-input>
            </a-form-item>
            <a-form-item name="password">
              <a-input
                v-model:value="formInline.password"
                type="password"
                placeholder="请输入密码"
                size="large"
              >
                <template #prefix
                  ><LockOutlined style="color: rgba(0, 0, 0, 0.25)"
                /></template>
              </a-input>
            </a-form-item>
            <a-row>
              <a-col :span="18">
                <a-form-item name="code">
                  <a-input
                    v-model:value="formInline.code"
                    placeholder="请输入验证码"
                    size="large"
                  >
                    <template #prefix
                      ><LockOutlined style="color: rgba(0, 0, 0, 0.25)"
                    /></template>
                  </a-input>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <img
                  :src="codeURL"
                  alt="图片"
                  @click="getImg"
                  class="codeImg"
                />
              </a-col>
            </a-row>
            <a-form-item>
              <a-checkbox v-model:checked="checked" @change="onChange">
                我已阅读并同意用户协议和隐私条款
              </a-checkbox>
            </a-form-item>
            <a-form-item>
              <a-button type="primary" block size="large" @click="Login">
                登录
              </a-button>
            </a-form-item>
            <a-form-item>
              <a-button type="primary" block size="large" @click="register">
                注册
              </a-button>
            </a-form-item>
          </a-form>
        </a-col>
        <!--  -->
        <a-col>
          <img src="../assets/login_banner_ele.png" alt="" />
        </a-col>
      </a-row>
    </a-layout-content>

    <a-layout-footer></a-layout-footer>

    <!-- 注册框 -->
    <a-modal
      title="用户注册"
      style="top: 20px"
      cancelText="取消"
      okText="确定"
      v-model:visible="modal1Visible"
      @ok="setModal1Visible"
    >
      <a-form
        layout="horizontal"
        :rules="rules"
        :model="Registerform"
        ref="refRegisterform"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 20 }"
      >
        <a-form-item label="头像" required>
          <a-upload
            name="image"
            accept="image/*"
            list-type="picture-card"
            class="avatar-uploader"
            :headers="headers"
            :action="uploadUrl"
            :show-file-list="false"
            :on-success="uploadSuccess"
            :before-upload="beforeAvatarUpload"
            :data="{
              image: fileUrl,
            }"
            @change="handleChange"
          >
            <img v-if="imageUrl" :src="imageUrl" alt="avatar" />
            <div v-else>
              <!-- todo -->
              <loading-outlined v-if="loading" />
              <plus-outlined v-else />
              <div class="ant-upload-text">Upload</div>
            </div>
          </a-upload>
        </a-form-item>
        <a-form-item label="昵称" required name="username">
          <a-input v-model:value="Registerform.username" size="large" />
        </a-form-item>
        <a-form-item label="邮箱" required name="email">
          <a-input v-model:value="Registerform.email" size="large" />
        </a-form-item>
        <a-form-item label="手机" required name="phone">
          <a-input v-model:value="Registerform.phone" size="large" />
        </a-form-item>
        <a-form-item label="密码" required name="password">
          <a-input v-model:value="Registerform.password" size="large" />
        </a-form-item>
        <a-form-item label="图形码" name="rcode">
          <a-row>
            <a-col :span="15">
              <a-input v-model:value="Registerform.rcode" size="large">
              </a-input>
            </a-col>
            <a-col :span="8" :offset="1">
              <img :src="codeURL" alt="图片" @click="getImg" class="codeImg" />
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item label="验证码" name="code">
          <a-row>
            <a-col :span="15">
              <a-input v-model:value="Registerform.code" size="large">
              </a-input>
            </a-col>
            <a-col :span="8" :offset="1">
              <a-button :disabled="delay != 0" @click="getSMS">
                {{ delay == 0 ? "点击获取验证码" : `还有${delay}秒继续获取` }}
              </a-button>
            </a-col>
          </a-row>
        </a-form-item>
      </a-form>
    </a-modal>
  </a-layout>
</template>

<script>
import { httpPost } from "@/utils/http.js";
import { Login } from "@/api";
import { message } from "ant-design-vue";

import {
  UserOutlined,
  LockOutlined,
  PlusOutlined,
  LoadingOutlined,
} from "@ant-design/icons-vue";

// function getBase64(img, callback) {
//   const reader = new FileReader();
//   reader.addEventListener("load", () => callback(reader.result));
//   reader.readAsDataURL(img);
// }

export default {
  data() {
    let checkMobile = async (rule, value) => {
      if (value === "") {
        return Promise.reject("请输入您的手机号");
      } else if (!/^[1]([3-9])[0-9]{9}$/.test(value)) {
        // 如果邮箱格式错误 那么提示
        return Promise.reject("您的手机号格式错误!");
      } else {
        return Promise.resolve();
      }
    };
    let checkEmail = async (rule, value) => {
      if (value === "") {
        return Promise.reject("请输入您的邮箱号");
      } else if (
        !/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value)
      ) {
        // 如果邮箱格式错误 那么提示
        return Promise.reject("您的邮箱格式错误!");
      } else {
        return Promise.resolve();
      }
    };
    return {
      formInline: {
        phone: "18511111111",
        password: "12345678",
        code: "",
      },
      rules: {
        phone: [{ validator: checkMobile, trigger: "blur" }],
        email: [{ validator: checkEmail, trigger: "blur" }],
        code: {
          required: true,
          message: "Please input Activity name",
          trigger: "blur",
        },
        avatar: {
          required: true,
          message: "Please input Activity name",
          trigger: "blur",
        },
        rcode: {
          required: true,
          message: "Please input Activity name",
          trigger: "blur",
        },
        password: {
          required: true,
          message: "Please input Activity name",
          trigger: "blur",
        },
        username: {
          required: true,
          message: "Please input Activity name",
          trigger: "blur",
        },
      },
      checked: false,

      codeURL: process.env.VUE_APP_URL + "/captcha?type=login",

      // 注册
      modal1Visible: false,
      Registerform: {
        username: "",
        phone: "",
        email: "",
        avatar: "",
        password: "",
        rcode: "",
        code: "",
      },

      delay: 0,

      uploadUrl: process.env.VUE_APP_URL + "/uploads",
      headers: {
        token: window.sessionStorage.getItem("token"),
      },
      fileUrl: "",
      loading: false,
      imageUrl: "",
    };
  },
  methods: {
    // 登录
    Login() {
      this.$refs.ruleForm
        .validate()
        .then(() => {
          if (this.checked) {
            let pramas = {
              phone: this.formInline.phone,
              password: this.formInline.password,
              code: this.formInline.code,
            };
            httpPost(Login.login, pramas)
              .then((res) => {
                console.log(res);
                let { data, code } = res;
                if (code == 200) {
                  window.sessionStorage.setItem("token", data.token);
                  message.success("登录成功");
                  this.$router.push("/home");
                } else {
                  message.success("验证码错误");
                }
              })
              .catch((err) => {
                console.log(err);
              });
          }
        })
        .catch((error) => {
          console.log("error", error);
          message.warning("This is a warning message");
        });
    },

    // 注册用户
    register() {
      this.modal1Visible = true;
    },

    handleChange(file) {
      console.log(file);
      // 我们上传头像的时候，后台需要我们传image参数
      this.fileUrl = file;
      // 把上传的头像的地址给imageUrl，让他再页面上回显出来
      // this.imageUrl = URL.createObjectURL(file.raw);
      this.imageUrl = file.file.response.data.file_path;
      // 把后台返回的图片地址保存起来
      this.Registerform.avatar = file.file.response.data.file_path;
      console.log(this.Registerform.avatar);
      // 表单中 头像字段的校验
      // self.$refs["registerRef"].validateField("avatar");
    },

    // 头像上传成功前的回调
    beforeAvatarUpload(file) {
      const isJPG =
        file.type === "image/jpeg" || "image/png" || "image/gif" || "image/jpg";
      // 1024*1024 1mb
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        message.error("上传头像只能是图片格式");
      }
      if (!isLt2M) {
        message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },

    // handleChange(info) {
    //   console.log(info);
    //   if (info.file.status === "uploading") {
    //     this.loading = true;
    //     return;
    //   }
    //   if (info.file.status === "done") {
    //     getBase64(info.file.originFileObj, (imageUrl) => {
    //       this.imageUrl = imageUrl;
    //       this.loading = false;
    //       this.fileUrl = info.file;
    //     });
    //     this.Registerform.avatar = info.file.name;
    //   }
    //   if (info.file.status === "error") {
    //     this.loading = false;
    //   }
    // },
    // beforeUpload(file) {
    //   const isJpgOrPng =
    //     file.type === "image/jpeg" || file.type === "image/png";
    //   if (!isJpgOrPng) {
    //     message.error("You can only upload JPG file!");
    //   }
    //   const isLt2M = file.size / 1024 / 1024 < 2;
    //   if (!isLt2M) {
    //     message.error("Image must smaller than 2MB!");
    //   }
    //   return isJpgOrPng && isLt2M;
    // },

    setModal1Visible() {
      console.log(this.Registerform);
      this.$refs.refRegisterform
        .validate()
        .then(() => {
          let pramas = {
            username: this.Registerform.username,
            phone: this.Registerform.phone,
            email: this.Registerform.email,
            avatar: this.Registerform.avatar,
            password: this.Registerform.password,
            rcode: this.Registerform.rcode,
          };
          httpPost(`/register`, pramas)
            .then((res) => {
              console.log(res);
              let { data, code } = res;
              if (code == 200) {
                window.sessionStorage.setItem("token", data.token);
                message.success("注册成功");
                // this.$refs.refRegisterform.resetFields();
                this.modal1Visible = false;
              } else {
                message.success("注册失败");
              }
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((error) => {
          console.log("error", error);
          message.warning("This is a warning message");
        });
    },

    // 短信验证
    getSMS() {
      // 手机号校验
      const reg = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/;
      if (reg.test(this.Registerform.phone) != true) {
        this.$message.error("手机号格式不对哦，请重新输入");
        return;
      }
      // 图片验证码的校验
      if (this.Registerform.rcode.length != 4) {
        return this.$message.error("图片验证码的长度不对哦，请检查");
      }
      // 如果为0开启倒计时
      if (this.delay == 0) {
        this.delay = 60;
        const interId = setInterval(() => {
          // 时间的递减
          this.delay--;
          if (this.delay == 0) {
            // 清除定时器
            clearInterval(interId);
          }
        }, 100);
        // 调用接口
        httpPost(`/captcha?type=sendsms`, {
          code: this.Registerform.rcode,
          phone: this.Registerform.phone,
        })
          // httpGet(`/captcha?type=sendsms`)
          .then((res) => {
            console.log(res);
            if (res.code === 200) {
              message.success("验证码获取成功:" + res.data);
            } else {
              message.error(res.data);
            }
          })
          .catch((error) => {
            console.log("error", error);
          });
      }
    },

    //  验证码
    getImg() {
      this.codeURL =
        process.env.VUE_APP_URL + "/captcha?type=login&t=" + Date.now();
    },
  },
  components: {
    UserOutlined,
    LockOutlined,
    PlusOutlined,
    LoadingOutlined,
  },
};
</script>

<style>
#app .ant-layout {
  height: 100%;
  background-color: #3bb5f6;
}
.ant-layout-content {
  background-color: #3bb5f6;
  display: flex;
  align-items: center;
}
.ant-layout .ant-layout-header,
.ant-layout .ant-layout-footer {
  background-color: transparent;
}
.imgs {
  height: 550px;
  width: 100%;
}
.ant-layout-content .tabelbox {
  padding: 30px;
  /* margin: 0 15px; */
  width: 500px;
  background-color: #f5f5f5;
}
.tabelbox,
/* .codeImg, */
img {
  width: 100%;
  height: 100%;
}

.codeImg {
  width: 100%;
  height: 40px;
}

.topText {
  position: relative;
  display: flex;
  align-items: center;
  margin: 10px 0;
}
.topText::after {
  content: "|";
  position: absolute;
  left: 141px;
  top: -1px;
  font-size: 26px;
  color: #b3b1b1;
  font-weight: lighter;
}
.span1 {
  font-size: 26px;
  font-weight: 700px;
  margin: 0 10px;
}
.span2 {
  margin: 0 10px;
  font-size: 20px;
}
.logoImg {
  width: 20px;
  height: 20px;
}

.avatar-uploader > .ant-upload {
  width: 128px;
  height: 128px;
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}
.ant-upload img {
  width: 100px;
  height: 100px;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}

.ant-modal-content .ant-modal-header {
  background: #0ea1fc;
}
.ant-modal-header .ant-modal-title {
  text-align: center;
  color: #fff;
}
.ant-modal-close .ant-modal-close-x {
  color: #fff;
}

.ant-modal-footer div {
  text-align: center;
}

.ant-form-item-control .ant-upload-picture-card-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>