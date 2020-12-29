<template>
  <div class="aoutBox">
    <div class="toplist">
      <a-form
        layout="inline"
        :rules="Listrules"
        :model="Listform"
        ref="refListform"
      >
        <!-- 1 -->
        <a-row class="titilRow">
          <a-col :span="4">
            <a-form-item label="学科" name="subject">
              <a-select
                v-model:value="Listform.subject"
                style="width: 150px"
                ref="select"
                @change="handleChange"
              >
                <a-select-option value="所有学科"> 所有学科 </a-select-option>
                <a-select-option value="语文"> 语文 </a-select-option>
                <a-select-option value="数学"> 数学 </a-select-option>
                <a-select-option value="外语"> 外语 </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="4">
            <a-form-item label="阶段" name="step">
              <a-select
                v-model:value="Listform.step"
                style="width: 150px"
                ref="select"
                placeholder="请选择阶段"
                @change="handleChange"
              >
                <a-select-option value="初级"> 初级 </a-select-option>
                <a-select-option value="中级"> 中级 </a-select-option>
                <a-select-option value="高级"> 高级 </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="4">
            <a-form-item label="企业" name="enterprise">
              <a-select
                v-model:value="Listform.enterprise"
                style="width: 150px"
                ref="select"
                @change="handleChange"
              >
                <a-select-option value="所有企业"> 所有企业 </a-select-option>
                <a-select-option value="阿里"> 阿里 </a-select-option>
                <a-select-option value="字节跳动"> 字节跳动 </a-select-option>
                <a-select-option value="华为"> 华为 </a-select-option>
                <a-select-option value="黑马"> 黑马 </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="4">
            <a-form-item label="题型" name="type">
              <a-select
                v-model:value="Listform.type"
                style="width: 150px"
                ref="select"
                placeholder="请选择题型"
                @change="handleChange"
              >
                <a-select-option value=" 单选"> 单选 </a-select-option>
                <a-select-option value=" 多选"> 多选</a-select-option>
                <a-select-option value=" 简答"> 简答</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <!-- 2 -->
        <a-row class="titilRow">
          <a-col :span="4">
            <a-form-item label="难度" name="difficulty">
              <a-select
                v-model:value="Listform.difficulty"
                style="width: 150px"
                ref="select"
                placeholder="请选择难度"
                @change="handleChange"
              >
                <a-select-option value=" 简单"> 简单 </a-select-option>
                <a-select-option value=" 一般"> 一般</a-select-option>
                <a-select-option value=" 困难"> 困难</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="4">
            <a-form-item label="作者" name="username">
              <a-select
                v-model:value="Listform.username"
                style="width: 150px"
                ref="select"
                placeholder="审批人"
                @change="handleChange"
              >
                <a-select-option value="管理员"> 管理员 </a-select-option>
                <a-select-option value="老师"> 老师 </a-select-option>
                <a-select-option value="学生"> 学生 </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="4">
            <a-form-item label="状态" name="status">
              <a-select
                v-model:value="Listform.status"
                style="width: 150px"
                ref="select"
                placeholder="请选择状态"
                @change="handleChange"
              >
                <a-select-option value="所有"> 所有 </a-select-option>
                <a-select-option value="禁用"> 禁用 </a-select-option>
                <a-select-option value="启用"> 启用 </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="4">
            <a-form-item label="日期" name="create_date">
              <a-time-picker
                v-model:value="Listform.create_date"
                :default-open-value="moment('00:00:00', 'HH:mm:ss')"
                @change="onChangeTime"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <!-- 3 -->
        <a-row class="titilRow">
          <a-col :span="8">
            <a-form-item label="标题" name="title">
              <a-input
                style="width: 350px"
                v-model:value="Listform.title"
                placeholder="请选择标题"
              >
              </a-input>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item>
              <a-button type="primary" @click="searchlist"> 搜索 </a-button>
            </a-form-item>
            <a-form-item>
              <a-button type="default" @click="clearinput"> 清除 </a-button>
            </a-form-item>
            <a-form-item>
              <a-button type="primary" :size="small" @click="addUser">
                <PlusOutlined />
                新增用户
              </a-button>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!--  -->
    <div class="buttonlist">
      <a-table
        :row-key="(record) => record.id"
        :columns="tableColumns"
        :data-source="tableData"
        :pagination="false"
        bordered
      >
        <template #index="{ index }">
          {{ index + 1 }}
        </template>

        <template #step="{ record }">
          <span>{{
            record.step == 1 ? "前段" : record.step == 2 ? "中段" : "后段"
          }}</span>
        </template>

        <template #enterprise="{ record }">
          <span>{{
            record.enterprise == 20
              ? "阿里"
              : record.enterprise == 30
              ? "字节跳动"
              : record.enterprise == 40
              ? "华为"
              : "黑马"
          }}</span>
        </template>

        <template #type="{ record }">
          <span>{{
            record.type == 1 ? "单选" : record.type == 2 ? "多选" : "简答"
          }}</span>
        </template>

        <template #status="{ record }">
          <span v-if="record.status == 1">启用</span>
          <span v-else style="color: red">禁用</span>
        </template>

        <template #operation="{ record }">
          <span class="operTeber" @click="eidlquestion(record)">编辑</span>
          <span class="operTeber" @click="eidlStatus(record.id)">{{
            record.status == 1 ? "禁用" : "启用"
          }}</span>
          <span class="operTeber" @click="removeUser(record.id)">删除</span>
        </template>
      </a-table>
      <!--  -->
      <a-pagination
        style="margin-top: 25px"
        v-model:current="current"
        v-model:pageSize="limit"
        :total="total"
        :show-total="(total) => `共 ${total} 条`"
        show-size-changer
        @showSizeChange="onShowSizeChange"
        :page-size-options="pageSizeOptions"
        :defaultPageSize="2"
        @change="handlePageChange"
        show-quick-jumper
      />
    </div>
    <!-- <Eildquestion ref="eildquestion"></Eildquestion> -->
    <!-- 编辑 -->
    <a-modal v-model:visible="eildvisible" title="编辑" @ok="eildhandleOk">
      <a-layout>
        <!-- <a-layout-header><span>新增题库</span></a-layout-header> -->
        <!-- 表单 -->
        <a-layout-content>
          <a-form
            style="width: 500px"
            layout="horizontal"
            :rules="eidlrules"
            :model="eidlform"
            ref="refaddform"
            :label-col="{ span: 4 }"
            :wrapper-col="{ span: 16 }"
          >
            <a-form-item label="学科" required name="subject">
              <a-select
                v-model:value="eidlform.subject"
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
                v-model:value="eidlform.step"
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
                v-model:value="eidlform.enterprise"
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
                v-model:value="eidlform.city"
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
              <a-radio-group
                v-model:value="eidlform.type"
                @change="typeonChange"
              >
                <a-radio :value="1"> 单选 </a-radio>
                <a-radio :value="2"> 多选 </a-radio>
                <a-radio :value="3"> 简答 </a-radio>
              </a-radio-group>
            </a-form-item>
            <!-- 难度 -->
            <a-form-item label="难度" required name="difficulty">
              <a-radio-group
                v-model:value="eidlform.difficulty"
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
                v-model="eidlform.title"
                :config="editorConfig"
              ></ckeditor>
            </a-form-item>
            <!-- 题 -->
            <a-form-item
              :label="
                eidlform.type == 1
                  ? '单选'
                  : eidlform.type == 2
                  ? '多选'
                  : '简答'
              "
              :wrapper-col="{ span: 20 }"
            >
              <a-radio-group
                v-if="eidlform.type == 1"
                v-model:value="eidlform.single_select_answer"
                @change="singleonChange"
              >
                <a-radio
                  :value="item.label"
                  v-for="(item, index) in eidlform.select_options"
                  :key="index"
                >
                  <span>{{ item.label }}</span>
                  <a-input class="tinputm" :value="item.text" />
                </a-radio>
              </a-radio-group>

              <a-checkbox-group
                v-else-if="eidlform.type == 2"
                v-model:value="eidlform.multiple_select_answer"
                name="checkboxgroup"
                @change="multipleonChange"
              >
                <a-checkbox
                  :value="item.label"
                  v-for="(item, index) in eidlform.select_options"
                  :key="index"
                >
                  <span>{{ item.label }}</span>
                  <a-input class="tinputm" :value="item.text" />
                </a-checkbox>
              </a-checkbox-group>
              <a-textarea
                v-else-if="eidlform.type == 3"
                v-model:value="eidlform.short_answer"
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
                v-model="eidlform.answer_analyze"
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
                v-model:value="eidlform.remark"
                placeholder="Autosize height with minimum and maximum number of lines"
                :auto-size="{ minRows: 2, maxRows: 5 }"
              />
            </a-form-item>
          </a-form>
        </a-layout-content>
        <!-- 底部 
        <a-layout-footer>
          <a-button type="primary" @click="adduplods">确定</a-button>
          <a-button> 取消 </a-button>
        </a-layout-footer> -->
      </a-layout>
    </a-modal>
  </div>
</template>

<script>
import { httpGet, httpPost } from "@/utils/http.js";

import { message } from "ant-design-vue";

// 富文本
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import { createVNode } from "vue";
import { Modal } from "ant-design-vue";

import moment from "moment";

import { PlusOutlined, ExclamationCircleOutlined } from "@ant-design/icons-vue";
// 导入 编辑对话框
// import Eildquestion from "../components/Eildquestion.vue";
const plainOptions = ["Apple", "Pear", "Orange"];

export default {
  data() {
    return {
      Listform: {
        title: "",
        subject: "所有学科",
        enterprise: "所有企业",
        type: "",
        step: "",
        username: "",
        status: "所有",
        difficulty: "",
        create_date: null,
      },

      // 编辑
      eildId: "",
      eidlform: {
        title: "",
        subject: "",
        step: "",
        enterprise: "",
        city: "",
        type: "",
        difficulty: "",
        single_select_answer: "",
        multiple_select_answer: [],
        short_answer: "",
        video: "",
        answer_analyze: "",
        remark: "",
        select_options: [],
      },

      eidlrules: {
        // 标题
        title: {
          required: true,
          message: "Please input Activity name",
          trigger: "blur",
        },
        // 学科
        subject: {
          type: "number",
          required: true,
          message: "Please input Activity name",
          trigger: "blur",
        },
        // 阶段
        step: {
          // type: "number",
          required: true,
          message: "Please input Activity name",
          trigger: "blur",
        },
        // 企业
        enterprise: {
          type: "number",
          required: true,
          message: "Please input Activity name",
          trigger: "blur",
        },
        // 城市
        city: {
          required: true,
          message: "Please input Activity name",
          trigger: "blur",
        },
        // 题型
        type: {
          type: "number",
          required: true,
          message: "Please input Activity name",
          trigger: "blur",
        },
        // 答案备注
        remark: {
          required: true,
          message: "Please input Activity name",
          trigger: "blur",
        },
        // 难度
        difficulty: {
          type: "number",
          required: true,
          message: "Please input Activity name",
          trigger: "blur",
        },
        // 答案解析
        answer_analyze: {
          required: true,
          message: "Please input Activity name",
          trigger: "blur",
        },
      },
      select_options: [
        {
          label: "A",
          text: "狗不理",
          image: "upload/20191129/fd5f03a07d95e3948860240564b180e4.jpeg",
        },
        {
          label: "B",
          text: "猫不理",
          image: "upload/20191129/e93e7bb72accda7f3159cdabc4203991.jpeg",
        },
        {
          label: "C",
          text: "麻花",
          image: "upload/20191129/b7caf98be9d0aa6764b0112ba0dfa19e.jpeg",
        },
        {
          label: "D",
          text: "炸酱面",
          image: "upload/20191129/4067f19ab53a5e8388ad3459e23110f0.jpeg",
        },
      ],

      plainOptions,

      //    富文本
      editor: ClassicEditor,
      // editorData: "<p>Content of the editor.</p>",
      editorConfig: {
        // The configuration of the editor.
      },

      //    模态框
      eildvisible: false,

      // Listrules: {

      // },

      // 表格列配置
      tableColumns: [
        { title: "序号", key: "index", slots: { customRender: "index" } },
        { title: "题目", dataIndex: "answer_analyze", key: "answer_analyze" },
        { title: "学科.阶段", key: "step", slots: { customRender: "step" } },
        { title: "题型", key: "type", slots: { customRender: "type" } },
        {
          title: "企业",
          key: "enterprise",
          slots: { customRender: "enterprise" },
        },
        { title: "创建者", dataIndex: "username", key: "username" },
        { title: "状态", key: "status", slots: { customRender: "status" } },
        { title: "访问量", dataIndex: "reads", key: "reads" },
        {
          title: "操作",
          key: "operation",
          slots: { customRender: "operation" },
        },
      ],
      // 表格数据
      tableData: [],
      // 分页
      current: 1,
      limit: 2,
      total: 0,
      // 指定每页可以显示多少条
      pageSizeOptions: ["1", "2", "5", "10"],
    };
  },
  created() {
    this.getUsers();
  },
  methods: {
    moment,
    // 获取用户数据
    getUsers() {
      let newstatus = null;
      if (this.Listform.status != "所有") {
        newstatus = this.Listform.status == "启用" ? 1 : 0;
      }
      let newsubject = null;
      if (this.Listform.subject != "所有学科") {
        newsubject =
          this.Listform.subject == "语文"
            ? 11
            : this.Listform.subject == "数学"
            ? 12
            : 13;
      }
      let newenterprise = null;
      if (this.Listform.enterprise != "所有企业") {
        newenterprise =
          this.Listform.enterprise == "阿里"
            ? 20
            : this.Listform.enterprise == "字节跳动"
            ? 30
            : this.Listform.enterprise == "华为"
            ? 40
            : 50;
      }
      let newstep = null;
      if (this.Listform.step != "") {
        newstep =
          this.Listform.step == "初级"
            ? 1
            : this.Listform.step == "中级"
            ? 2
            : 3;
      }
      let newtype = null;
      if (this.Listform.type != "") {
        newtype =
          this.Listform.type == "单选"
            ? 1
            : this.Listform.type == "多选"
            ? 2
            : 3;
      }
      let params = {
        title: this.Listform.title,
        type: newtype,
        subject: newsubject,
        step: newstep,
        enterprise: newenterprise,
        difficulty: this.Listform.difficulty,
        status: newstatus,
        page: this.current,
        limit: this.limit,
      };
      console.log(params);
      httpGet(`/question/list`, params)
        .then((response) => {
          console.log(response);
          let { code, data } = response;
          if (code == 200) {
            this.tableData = data.items;
            this.current = data.pagination.page;
            this.total = data.pagination.total;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // 根据每页显示多少条数据不同 重新渲染表格
    onShowSizeChange(current, pageSize) {
      // console.log(current, pageSize);
      this.getUsers(current, pageSize);
    },
    // 页码改变的回调，参数是改变后的页码及每页条数
    handlePageChange(current, pageSize) {
      this.getUsers(current, pageSize);
    },

    // 搜索
    searchlist() {
      this.getUsers();
      console.log(this.Listform);
    },

    // 清除
    clearinput() {
      this.$refs.refListform.resetFields();
      this.getUsers();
    },

    // 添加搜索
    addUser() {
      this.$router.push("/addquestion");
    },

    // 修改用户状态
    eidlStatus(id) {
      httpPost(`/question/status`, { id: id })
        .then((response) => {
          console.log(response);
          let { code } = response;
          if (code == 200) {
            this.getUsers();
            message.success("修改状态成功");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    // 删除用户
    removeUser(id) {
      let that = this;
      Modal.confirm({
        title: "删除",
        content: "确定删除！！",
        icon: createVNode(ExclamationCircleOutlined),
        okText: "确认",
        cancelText: "取消",
        onOk() {
          httpPost(`/question/remove`, { id: id })
            .then((response) => {
              console.log(response);
              let { code } = response;
              if (code == 200) {
                that.getUsers();
                message.success("删除用户成功");
              }
            })
            .catch((error) => {
              console.log(error);
            });
        },
      });
    },

    // 编辑
    eidlquestion(record) {
      this.eildvisible = true;
      record.step =
        record.step == 1 ? "初级" : record.step == 2 ? "中级" : "高级";
      // console.log(record);
      this.eidlform = record;
      // console.log(record);
      this.eildId = record.id;
      this.eidlform.select_options = this.select_options;
    },

    // 学科
    subjectChange(value) {
      let single = value;
      this.eidlform.subject =
        single == "语文" ? 11 : single == "数学" ? 12 : 13;
    },
    // 企业
    enterpriseChange(value) {
      let single = value;
      this.eidlform.enterprise =
        single == "阿里"
          ? 20
          : single == "字节跳动"
          ? 30
          : single == "华为"
          ? 40
          : 50;
    },
    // 阶段
    stepChange() {
      // let single = value;
      // console.log(single);
      // this.eidlform.step =
      //   single == "初级" ? "1" : single == "中级" ? "2" : "3";
    },

    eildhandleOk() {
      this.$refs.refaddform
        .validate()
        .then(() => {
          if (this.eidlform.type == 1) {
            this.eidlform.multiple_select_answer = null;
            this.eidlform.short_answer = null;
          } else if (this.eidlform.type == 2) {
            this.eidlform.single_select_answer = null;
            this.eidlform.short_answer = null;
          } else {
            this.eidlform.multiple_select_answer = null;
            this.eidlform.single_select_answer = null;
          }
          let nwesubject_name =
            this.eidlform.subject == 11
              ? "语文"
              : this.eidlform.subject == 12
              ? "数学"
              : "外语";
          // let nweenterprise_name =
          this.eidlform.enterprise == "阿里"
            ? 20
            : this.eidlform.enterprise == "字节跳动"
            ? 30
            : this.eidlform.enterprise == "华为"
            ? 40
            : 50;

          let newstep =
            this.eidlform.step == "初级"
              ? 1
              : this.eidlform.step == "中级"
              ? 2
              : 3;
          console.log(this.eidlform);

          let params = {
            id: String(this.eildId),
            user_id: String(this.eidlform.user_id),
            title: this.eidlform.title,
            type: String(this.eidlform.type),
            subject: this.eidlform.subject,
            subject_name: nwesubject_name,
            step: Number(newstep),
            enterprise: this.eidlform.enterprise,
            // enterprise_name: nweenterprise_name,
            difficulty: this.eidlform.difficulty,
            single_select_answer: String(this.eidlform.single_select_answer),
            video: this.eidlform.video,
            remark: this.eidlform.remark,
            city: Array(this.eidlform.city),
            answer_analyze: this.eidlform.answer_analyze,
            select_options: this.eidlform.select_options,
            multiple_select_answer: this.eidlform.multiple_select_answer,
            short_answer: this.eidlform.short_answer,
          };
          console.log(params);
          httpPost(`/question/edit`, params)
            .then((response) => {
              console.log(response);
              let { code } = response;
              if (code == 200) {
                this.eildvisible = false;
                message.success("编辑用户成功");
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

    // 选择器
    handleChange(value) {
      console.log(`selected ${value}`);
    },
    // 日期
    onChangeTime(time, timeString) {
      console.log(time, timeString);
    },
  },
  components: {
    PlusOutlined,
    // Eildquestion,
  },
};
</script>

<style scoped>
.aoutBox {
  width: 100%;
  height: 100%;
}
.toplist {
  width: 100%;
  height: 180px;
  border-radius: 5px;
  margin-bottom: 12px;
  padding: 10px;
  background-color: #fff;
}
.operTeber {
  color: #34a2fe;
  margin: 0 5px;
}
.titilRow {
  margin: 10px;
}

#app .ant-layout,
.ant-layout-content {
  flex: none;
  background-color: #ffffff;
}
</style>