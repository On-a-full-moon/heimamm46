<template>
  <div class="aoutBox">
    <div class="toplist">
      <a-form
        layout="inline"
        :rules="Listrules"
        :model="Listform"
        ref="refListform"
      >
        <a-form-item label="用户名" name="username">
          <a-input
            v-model:value="Listform.username"
            placeholder="用户名"
            size="large"
          />
        </a-form-item>
        <a-form-item label="邮箱" name="email">
          <a-input
            v-model:value="Listform.email"
            placeholder="邮箱"
            size="large"
          />
        </a-form-item>
        <a-form-item label="角色" name="role_id">
          <a-select
            v-model:value="Listform.role_id"
            style="width: 150px"
            placeholder="角色"
            size="large"
            ref="select"
            @change="statusChange"
          >
            <a-select-option value="所有"> 所有 </a-select-option>
            <a-select-option value="超级管理员"> 超级管理员 </a-select-option>
            <a-select-option value="管理员"> 管理员 </a-select-option>
            <a-select-option value="老师"> 老师 </a-select-option>
            <a-select-option value="学生"> 学生 </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="searchlist" size="large">
            搜索
          </a-button>
        </a-form-item>
        <a-form-item>
          <a-button type="default" @click="clearinput" size="large">
            清除
          </a-button>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" size="large" @click="addUser">
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

    <!-- 添加用户 -->
    <a-modal
      title="添加用户"
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
        :wrapper-col="{ span: 21 }"
      >
        <a-form-item label="昵称" required name="username">
          <a-input v-model:value="addform.username" size="large" />
        </a-form-item>
        <a-form-item label="邮箱" required name="email">
          <a-input v-model:value="addform.email" size="large" />
        </a-form-item>
        <a-form-item label="手机" required name="phone">
          <a-input v-model:value="addform.phone" size="large" />
        </a-form-item>
        <a-form-item label="角色" required name="role_id">
          <a-select
            v-model:value="addform.role_id"
            style="width: 100%"
            ref="select"
            :size="large"
            @change="handleChange"
          >
            <a-select-option value="管理员"> 管理员 </a-select-option>
            <a-select-option value="老师"> 老师 </a-select-option>
            <a-select-option value="学生"> 学生 </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="状态">
          <a-select
            v-model:value="addform.status"
            ref="select"
            style="width: 100%"
            :size="large"
            @change="handleChange"
          >
            <a-select-option value="老师"> 1 </a-select-option>
            <a-select-option value="学生"> 0 </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="备注">
          <a-input v-model:value="addform.remark" size="large" />
        </a-form-item>
      </a-form>
    </a-modal>
    <!-- 编辑用户 -->
    <a-modal
      title="编辑用户"
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
        <!-- <a-form-item label="用户编号" required name="rid">
          <a-input v-model:value="editform.rid" size="large" />
        </a-form-item> -->
        <a-form-item label="用户名称" required name="username">
          <a-input v-model:value="editform.username" size="large" />
        </a-form-item>
        <a-form-item label="用户phone" required name="phone">
          <a-input v-model:value="editform.phone" size="large" />
        </a-form-item>
        <a-form-item label="用户邮箱" required name="email">
          <a-input v-model:value="editform.email" size="large" />
        </a-form-item>
        <a-form-item label="用户角色" required name="role_id">
          <!-- <a-input v-model:value="editform.role_id" size="large" /> -->

          <a-select
            v-model:value="editform.role_id"
            style="width: 100px"
            placeholder="角色"
            ref="select"
            @change="statusChange"
          >
            <a-select-option value="超级管理员"> 超级管理员 </a-select-option>
            <a-select-option value="管理员"> 管理员 </a-select-option>
            <a-select-option value="老师"> 老师 </a-select-option>
            <a-select-option value="学生"> 学生 </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="用户备注">
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
    return {
      Listform: {
        username: "",
        email: "",
        role_id: "所有",
      },
      Listrules: {},

      // 表格列配置
      tableColumns: [
        { title: "序号", key: "index", slots: { customRender: "index" } },
        { title: "用户名", dataIndex: "username", key: "username" },
        { title: "电话", dataIndex: "phone", key: "phone" },
        { title: "邮箱", dataIndex: "email", key: "email" },
        { title: "角色", dataIndex: "role", key: "role" },
        { title: "备注", dataIndex: "remark", key: "remark" },
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

      // addmodel
      addVisible: false,

      addrules: {
        phone: [{ validator: checkMobile, trigger: "blur" }],
        email: [{ validator: checkEmail, trigger: "blur" }],
        username: {
          required: true,
          message: "Please input Activity name",
          trigger: "blur",
        },
        role_id: {
          required: true,
          message: "Please input Activity name",
          trigger: "blur",
        },
      },
      addform: {
        username: "",
        phone: "",
        email: "",
        role_id: "",
        status: "",
        remark: "",
      },

      /// 编辑学科.等变量
      editVisible: false,
      editrules: {},
      editform: {
        username: "",
        phone: "",
        email: "",
        role_id: "",
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
      if (this.Listform.role_id != "所有") {
        newstatus =
          this.Listform.role_id == "超级管理员"
            ? 1
            : this.Listform.role_id == "管理员"
            ? 2
            : this.Listform.role_id == "老师"
            ? 3
            : 4;
      }
      let pramas = {
        username: this.Listform.username,
        email: this.Listform.email,
        role_id: newstatus,
        page: this.current,
        limit: this.limit,
      };
      console.log(pramas);
      httpGet(`/user/list`, pramas)
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
    },

    // 清除
    clearinput() {
      this.$refs.refListform.resetFields();
      this.getUsers();
    },

    // 添加用户
    addUser() {
      this.addVisible = true;
    },
    setModal1Visible() {
      this.$refs.refaddform
        .validate()
        .then(() => {
          let pramas = {
            username: this.addform.username,
            phone: this.addform.phone,
            email: this.addform.email,
            role_id: this.addform.role_id,
            status: this.addform.status,
            remark: this.addform.remark,
          };
          httpPost(`/user/add`, pramas)
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

    // 修改用户状态
    eidlStatus(id) {
      httpPost(`/user/status`, { id: id })
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
          httpPost(`/user/remove`, { id: id })
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
      let lostatus =
        record.role_id == 1
          ? "超级管理员"
          : record.role_id == 2
          ? "管理员"
          : record.role_id == 3
          ? "老师"
          : "学生";
      // console.log(this.newrecord);
      this.editform.username = record.username;
      this.editform.phone = record.phone;
      this.editform.email = record.email;
      this.editform.role_id = lostatus;
      this.editform.remark = record.remark;
    },
    editok() {
      let newstatus =
        this.editform.role_id == "超级管理员"
          ? 1
          : this.editform.role_id == "管理员"
          ? 2
          : this.editform.role_id == "老师"
          ? 3
          : 4;
      this.newrecord.username = this.editform.username;
      this.newrecord.phone = this.editform.phone;
      this.newrecord.email = this.editform.email;
      this.newrecord.role_id = newstatus;
      this.newrecord.remark = this.editform.remark;
      // console.log(this.newrecord);
      httpPost(`/user/edit`, this.newrecord)
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
      this.Listform.role_id = value;
    },
  },
  computed: {
    //  statusText(){
    //    if (record.status==0) {
    //    return "禁用"
    //   }
    //   return "启用"
    //  }
  },
  components: {
    PlusOutlined,
  },
};
</script>

<style>
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