<template>
  <div class="aoutBox">
    <div class="toplist">
      <a-form
        layout="inline"
        :rules="Listrules"
        :model="Listform"
        ref="refListform"
      >
        <a-form-item label="学课编号" name="rid">
          <a-input v-model:value="Listform.rid" placeholder="企业编号" />
        </a-form-item>
        <a-form-item label="学课名称" name="name">
          <a-input v-model:value="Listform.name" placeholder="企业名称" />
        </a-form-item>
        <a-form-item label="创建者" name="username">
          <a-input v-model:value="Listform.username" placeholder="创建者" />
        </a-form-item>
        <a-form-item label="状态" name="status">
          <a-select
            v-model:value="Listform.status"
            style="width: 100px"
            ref="select"
            @change="statusChange"
          >
            <a-select-option value="所有"> 所有 </a-select-option>
            <a-select-option value="禁用"> 禁用 </a-select-option>
            <a-select-option value="启用"> 启用 </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="searchlist"> 搜索 </a-button>
        </a-form-item>
        <a-form-item>
          <a-button type="default" @click="clearinput"> 清除 </a-button>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" size @click="addUser">
            <PlusOutlined />
            新增用户
          </a-button>
        </a-form-item>
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

        <template #status="{ record }">
          <span v-if="record.status == 1">启用</span>
          <span v-else style="color: red">禁用</span>
        </template>

        <template #operation="{ record }">
          <span class="operTeber" @click="editsubject(record)">编辑</span>
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

    <!-- 添加学科 -->
    <a-modal
      title="添加学科"
      style="top: 20px"
      cancelText="取消"
      okText="确定"
      v-model:visible="addVisible"
      @ok="setModal1Visible"
      :afterClose="afterClose"
    >
      <a-form
        layout="horizontal"
        :rules="addrules"
        :model="addform"
        ref="refaddform"
        :label-col="{ span: 0 }"
        :wrapper-col="{ span: 18 }"
      >
        <a-form-item label="学科编号" required name="rid">
          <a-input v-model:value="addform.rid" size="large" />
        </a-form-item>
        <a-form-item label="学科名称" required name="name">
          <a-input v-model:value="addform.name" size="large" />
        </a-form-item>
        <a-form-item label="学科简称" required name="short_name">
          <a-input v-model:value="addform.short_name" size="large" />
        </a-form-item>
        <a-form-item label="学科简介" required name="intro">
          <a-input v-model:value="addform.intro" size="large" />
        </a-form-item>
        <a-form-item label="学科备注">
          <a-row>
            <a-col :span="24" :offset="1">
              <a-input v-model:value="addform.remark" size="large" />
            </a-col>
          </a-row>
        </a-form-item>
      </a-form>
    </a-modal>
    <!-- 编辑学科 -->
    <a-modal
      title="编辑学科"
      style="top: 20px"
      cancelText="取消"
      okText="确定"
      v-model:visible="editVisible"
      @ok="editok"
    >
      <a-form
        layout="horizontal"
        :rules="editrules"
        :model="editform"
        ref="refaddform"
        :label-col="{ span: 0 }"
        :wrapper-col="{ span: 18 }"
      >
        <a-form-item label="学科编号" required name="rid">
          <a-input v-model:value="editform.rid" size="large" />
        </a-form-item>
        <a-form-item label="学科名称" required name="name">
          <a-input v-model:value="editform.name" size="large" />
        </a-form-item>
        <a-form-item label="学科简称" required name="short_name">
          <a-input v-model:value="editform.short_name" size="large" />
        </a-form-item>
        <a-form-item label="学科简介" required name="intro">
          <a-input v-model:value="editform.intro" size="large" />
        </a-form-item>
        <a-form-item label="学科备注">
          <a-row>
            <a-col :span="24" :offset="1">
              <a-input v-model:value="editform.remark" size="large" />
            </a-col>
          </a-row>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { httpGet, httpPost } from "@/utils/http.js";

import { message } from "ant-design-vue";

import { createVNode } from "vue";
import { Modal } from "ant-design-vue";

import { PlusOutlined, ExclamationCircleOutlined } from "@ant-design/icons-vue";

export default {
  data() {
    return {
      Listform: {
        rid: "",
        name: "",
        status: "所有",
        username: "",
      },
      Listrules: {},

      // 表格列配置
      tableColumns: [
        { title: "序号", key: "index", slots: { customRender: "index" } },
        { title: "学科编号", dataIndex: "rid", key: "rid" },
        { title: "学科名称", dataIndex: "name", key: "name" },
        { title: "简称", dataIndex: "short_name", key: "short_name" },
        { title: "创建者", dataIndex: "username", key: "username" },
        { title: "创建日期", dataIndex: "create_time", key: "create_time" },
        { title: "状态", key: "status", slots: { customRender: "status" } },
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

      // 添加学科.等变量
      addVisible: false,
      addrules: {
        rid: {
          required: true,
          message: "Please input Activity name",
          trigger: "blur",
        },
        name: {
          required: true,
          message: "Please input Activity name",
          trigger: "blur",
        },
        short_name: {
          required: true,
          message: "Please input Activity name",
          trigger: "blur",
        },
        intro: {
          required: true,
          message: "Please input Activity name",
          trigger: "blur",
        },
      },
      addform: {
        rid: "",
        name: "",
        short_name: "",
        intro: "",
        remark: "",
      },

      // 编辑学科.等变量
      editVisible: false,
      editrules: {},
      editform: {
        rid: "",
        name: "",
        short_name: "",
        intro: "",
        remark: "",
      },
      newrecord: "",
    };
  },
  created() {
    this.getUsers();
  },
  methods: {
    // 获取用户数据
    getUsers() {
      let newstatus = null;
      if (this.Listform.status != "所有") {
        newstatus = this.Listform.status == "启用" ? 1 : 0;
      }
      let pramas = {
        rid: this.Listform.rid,
        name: this.Listform.name,
        intro: this.Listform.intro,
        remark: this.Listform.remark,
        status: newstatus,
        page: this.current,
        limit: this.limit,
      };
      console.log(pramas);
      httpGet(`/subject/list`, pramas)
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
      this.getUsers(current, pageSize);
    },
    // 页码改变的回调，参数是改变后的页码及每页条数
    handlePageChange(current, pageSize) {
      this.getUsers(current, pageSize);
    },

    // 搜索
    searchlist() {
      this.getUsers();
    },

    // 清除
    clearinput() {
      this.$refs.refListform.resetFields();
      this.getUsers();
    },

    // 添加学科
    addUser() {
      this.addVisible = true;
    },
    setModal1Visible() {
      this.$refs.refaddform
        .validate()
        .then(() => {
          let pramas = {
            rid: this.addform.rid,
            name: this.addform.name,
            short_name: this.addform.short_name,
            intro: this.addform.intro,
            remark: this.addform.remark,
          };
          httpPost(`/subject/add`, pramas)
            .then((response) => {
              console.log(response);
              let { code } = response;
              if (code == 200) {
                this.getUsers();
                this.addVisible = false;
                message.success("添加成功");
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
    afterClose() {
      console.log(this.addform);
      this.$refs.refaddform.resetFields();
    },

    // 修改学科状态
    eidlStatus(id) {
      httpPost(`/subject/status`, { id: id })
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

    // 删除该学科
    removeUser(id) {
      let that = this;
      Modal.confirm({
        title: "删除",
        content: "确定删除！！",
        icon: createVNode(ExclamationCircleOutlined),
        okText: "确认",
        cancelText: "取消",
        onOk() {
          httpPost(`/subject/remove`, { id: id })
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

    //编辑学科
    editsubject(record) {
      this.editVisible = true;
      this.newrecord = record;
      // console.log(this.newrecord);
      this.editform.rid = record.rid;
      this.editform.name = record.name;
      this.editform.short_name = record.short_name;
      this.editform.intro = record.intro;
      this.editform.remark = record.remark;
    },
    editok() {
      this.newrecord.rid = this.editform.rid;
      this.newrecord.name = this.editform.name;
      this.newrecord.short_name = this.editform.short_name;
      this.newrecord.intro = this.editform.intro;
      this.newrecord.remark = this.editform.remark;
      // console.log(this.newrecord);
      httpPost(`/subject/edit`, this.newrecord)
        .then((response) => {
          console.log(response);
          let { code } = response;
          if (code == 201) {
            message.warning(response.message);
          }
          if (code == 200) {
            this.getUsers();
            this.editVisible = false;
            message.success("编辑成功");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    // 变量状态选择
    statusChange(value) {
      this.Listform.status = value;
    },
  },
  components: {
    PlusOutlined,
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
  height: 90px;
  border-radius: 5px;
  margin-bottom: 12px;
  padding: 20px;
  background-color: #fff;
}
.buttonlist {
  background-color: #fff;
  border-radius: 5px;
  padding: 24px;
}
.ant-pagination {
  text-align: center;
}
.operTeber {
  color: #34a2fe;
  margin: 0 5px;
}

.operTeber:hover {
  color: #0d1cee;
}
</style>