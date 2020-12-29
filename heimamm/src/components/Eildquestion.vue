<template>
  <a-modal v-model:visible="eildvisible" title="Basic Modal" @ok="eildhandleOk">
    <a-layout>
      <a-layout-header><span>新增题库</span></a-layout-header>
      <!-- 表单 -->
      <a-layout-content>
        <a-form
          style="width: 500px"
          layout="horizontal"
          :rules="addrules"
          :model="addform"
          ref="refaddform"
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 16 }"
        >
          <a-form-item label="学科" required name="subject">
            <a-select
              v-model:value="addform.subject"
              ref="select"
              size="large"
              @change="subjectChange"
            >
              <a-select-option value="语文"> 语文 </a-select-option>
              <a-select-option value="数学"> 数学 </a-select-option>
              <a-select-option value="外语"> 外语 </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="阶段" required name="step">
            <a-select
              v-model:value="addform.step"
              ref="select"
              size="large"
              @change="stepChange"
            >
              <!-- <a-select-option value="阶段"> 阶段 </a-select-option> -->
              <a-select-option value="初级"> 初级 </a-select-option>
              <a-select-option value="中级"> 中级 </a-select-option>
              <a-select-option value="高级"> 高级 </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="企业" required name="enterprise">
            <a-select
              v-model:value="addform.enterprise"
              ref="select"
              size="large"
              @change="enterpriseChange"
            >
              <a-select-option value="阿里"> 阿里 </a-select-option>
              <a-select-option value="字节跳动"> 字节跳动 </a-select-option>
              <a-select-option value="华为"> 华为 </a-select-option>
              <a-select-option value="黑马"> 黑马 </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="城市" required name="city">
            <a-select
              v-model:value="addform.city"
              ref="select"
              size="large"
              @change="cityChange"
            >
              <a-select-option value="长沙"> 长沙 </a-select-option>
              <a-select-option value="魔都"> 魔都 </a-select-option>
              <a-select-option value="地厦"> 地厦 </a-select-option>
            </a-select>
          </a-form-item>
          <!-- 题型 -->
          <a-form-item label="题型" required name="type">
            <a-radio-group v-model:value="addform.type" @change="typeonChange">
              <a-radio :value="1"> 单选 </a-radio>
              <a-radio :value="2"> 多选 </a-radio>
              <a-radio :value="3"> 简答 </a-radio>
            </a-radio-group>
          </a-form-item>
          <!-- 难度 -->
          <a-form-item label="难度" required name="difficulty">
            <a-radio-group
              v-model:value="addform.difficulty"
              @change="difficultyonChange"
            >
              <a-radio :value="1"> 简单 </a-radio>
              <a-radio :value="2"> 一般 </a-radio>
              <a-radio :value="3"> 困难 </a-radio>
            </a-radio-group>
          </a-form-item>
          <!-- 分割线 -->
          <a-divider />
          <!-- 标题 -->
          <a-form-item
            label="试题标题"
            required
            name="title"
            :wrapper-col="{ span: 20 }"
          >
            <ckeditor
              :editor="editor"
              v-model="addform.title"
              :config="editorConfig"
            ></ckeditor>
          </a-form-item>
          <!-- 题 -->
          <a-form-item
            :label="
              addform.type == 1 ? '单选' : addform.type == 2 ? '多选' : '简答'
            "
            :wrapper-col="{ span: 20 }"
          >
            <a-radio-group
              v-if="addform.type == 1"
              v-model:value="addform.single_select_answer"
              @change="singleonChange"
            >
              <a-radio
                :value="item.label"
                v-for="(item, index) in addform.select_options"
                :key="index"
              >
                <span>{{ item.label }}</span>
                <a-input class="tinputm" :value="item.text" />
              </a-radio>
            </a-radio-group>

            <a-checkbox-group
              v-else-if="addform.type == 2"
              v-model:value="addform.multiple_select_answer"
              name="checkboxgroup"
              @change="multipleonChange"
            >
              <a-checkbox
                :value="item.label"
                v-for="(item, index) in addform.select_options"
                :key="index"
              >
                <span>{{ item.label }}</span>
                <a-input class="tinputm" :value="item.text" />
              </a-checkbox>
            </a-checkbox-group>
            <a-textarea
              v-else-if="addform.type == 3"
              v-model:value="addform.short_answer"
              placeholder="Autosize height with minimum and maximum number of lines"
              :auto-size="{ minRows: 2, maxRows: 5 }"
            />
          </a-form-item>
          <!-- 分割线 -->
          <a-form-item label="解析视频" name="video">
            <a-upload
              v-model:fileList="video"
              name="file"
              :multiple="true"
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              :headers="headers"
              @change="handleChange"
            >
              <a-button type="primary"> 点击上传</a-button>
              <p>只能上传视频文件，且不超过2mb</p>
            </a-upload>
            <video class="video" :src="videoURL" controls></video>
          </a-form-item>
          <!-- 答案解析 -->
          <!-- 标题 -->
          <a-form-item
            label="答案解析"
            required
            name="answer_analyze"
            :wrapper-col="{ span: 20 }"
          >
            <ckeditor
              :editor="editor"
              v-model="addform.answer_analyze"
              :config="editorConfig"
            ></ckeditor>
          </a-form-item>
          <!-- 试题备注 -->
          <a-form-item
            label="试题备注"
            required
            name="remark"
            :wrapper-col="{ span: 20 }"
          >
            <a-textarea
              v-model:value="addform.remark"
              placeholder="Autosize height with minimum and maximum number of lines"
              :auto-size="{ minRows: 2, maxRows: 5 }"
            />
          </a-form-item>
        </a-form>
      </a-layout-content>
      <!-- 底部  -->
      <a-layout-footer>
        <a-button type="primary" @click="adduplods">确定</a-button>
        <a-button> 取消 </a-button>
      </a-layout-footer>
    </a-layout>
  </a-modal>
</template>

<script>
// 富文本
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import { httpPost } from "@/utils/http.js";

import { message } from "ant-design-vue";

const plainOptions = ["Apple", "Pear", "Orange"];

export default {
  data() {
    return {
      addrules: {},
      eidlform: {
        title: "",
        subject: "",
        step: "",
        enterprise: "",
        city: "",
        type: 1,
        difficulty: 1,
        single_select_answer: "",
        multiple_select_answer: [],
        short_answer: "",
        video: "",
        answer_analyze: "",
        remark: "",
        select_options: [],
      },

      //    模态框
      eildvisible: false,

      plainOptions,
      //    富文本
      editor: ClassicEditor,
      // editorData: "<p>Content of the editor.</p>",
      editorConfig: {
        // The configuration of the editor.
      },
    };
  },
  methods: {
    adduplods() {
      this.$refs.refaddform
        .validate()
        .then(() => {
          if (this.addform.type == 1) {
            this.addform.multiple_select_answer = null;
            this.addform.short_answer = null;
          } else if (this.addform.type == 2) {
            this.addform.single_select_answer = null;
            this.addform.short_answer = null;
          } else {
            this.addform.multiple_select_answer = null;
            this.addform.single_select_answer = null;
          }
          let nwesubject_name =
            this.addform.step == "1"
              ? "初级"
              : this.addform.step == "2"
              ? "中级"
              : "高级";
          // let nweenterprise_name =
          this.addform.enterprise == "阿里"
            ? 20
            : this.addform.enterprise == "字节跳动"
            ? 30
            : this.addform.enterprise == "华为"
            ? 40
            : 50;
          let pramas = {
            title: this.addform.title,
            type: this.addform.type,
            subject: this.addform.subject,
            subject_name: nwesubject_name,
            step: this.addform.step,
            enterprise: this.addform.enterprise,
            // enterprise_name: nweenterprise_name,
            difficulty: this.addform.difficulty,
            single_select_answer: this.addform.single_select_answer,
            video: this.addform.video,
            remark: this.addform.remark,
            city: Array(this.addform.city),
            answer_analyze: this.addform.answer_analyze,
            select_options: this.addform.select_options,
            multiple_select_answer: this.addform.multiple_select_answer,
            short_answer: this.addform.short_answer,
          };
          console.log(pramas);
          httpPost(`/question/add`, pramas)
            .then((response) => {
              console.log(response);
              let { code } = response;
              if (code == 200) {
                this.$router.push("/question");
                message.success("发布成功");
              }
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          console.log("error", error);
        });
    },

    // 学科
    subjectChange(value) {
      let single = value;
      // let addformsingle = this.addform.single_select_answer;
      this.addform.subject = single == "语文" ? 11 : single == "数学" ? 12 : 13;
    },
    // 企业
    enterpriseChange(value) {
      let single = value;
      // let addformsingle = this.addform.single_select_answer;
      this.addform.enterprise =
        single == "阿里"
          ? 20
          : single == "字节跳动"
          ? 30
          : single == "华为"
          ? 40
          : 50;
    },
    // 阶段
    stepChange(value) {
      let single = value;
      console.log(single);
      // let addformsingle = this.addform.single_select_answer;
      this.addform.step = single == "初级" ? "1" : single == "中级" ? "2" : "3";
    },
    // 单选答案
    singleonChange(e) {
      console.log(e.target.value);
      // let single = e.target.value;
      // // let addformsingle = this.addform.single_select_answer;
      // this.addform.single_select_answer =
      //   single == 0 ? "A" : single == 1 ? "B" : single == 2 ? "C" : "D";
      console.log(this.addform.single_select_answer);
    },
    // 多选答案
    multipleonChange() {
      // let multiple = this.addform.multiple_select_answer;
      // console.log(multiple);
    },

    eildhandleOk() {
      this.eildvisible = false;
    },
  },
};
</script>

<style scoped>
#app .ant-layout,
.ant-layout-content {
  flex: none;
  background-color: #ffffff;
}

.ant-form {
  width: 700px;
  padding: 24px 0;
}
.ant-layout-header {
  display: flex;
  align-items: center;
  height: 45px;
  color: #eaf9fd;
  font-size: 16px;
  background-color: #0aaaf9;
}
.ant-layout-content {
  /* text-align: center; */
  display: flex;
  justify-content: center;
}
/* .ant-form-item-control .ant-select {
  border-radius: 10px;
} */

.tinputm {
  margin-left: 30px;
}
.uplodsimg {
  width: 50px;
  height: 50px;
}

.ant-layout-footer button {
  float: right;
  margin: 5px;
}
</style>