<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="类别名称" prop="techType">
        <el-input
          v-model="queryParams.techType"
          placeholder="请输入类别名称"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="paperList">
      <el-table-column label="类别编号" prop="id" width="120"/>
      <el-table-column label="技术类别" prop="techType" :show-overflow-tooltip="true" width="150" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 修改论文技术类别信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="类别名称" prop="techType">
          <el-input v-model="form.techType" placeholder="请输入学生姓名" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { listSkill, updatePaper, delPaper, getPaper } from "@/api/paper/paperInfo/paper";

export default {
  name: "PaperTech",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 表格数据
      paperList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,

      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        techType: undefined
      },
      // 表单参数
      form: {},
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询论文技术类别基本信息列表 */
    getList() {
      this.loading = true;
      listSkill(this.queryParams).then(
        response => {
          this.paperList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },

    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },

    // 表单重置
    reset() {
      this.form = {
        techType: undefined,
      };
      this.resetForm("form");
    },

    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },

    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },

    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const paperId = row.id;
      console.log("paperId", paperId);
      getPaper(paperId).then(response => {
        console.log(paperId);
        this.form = response.data;
        this.open = true;
        this.title = "修改论文基本信息";
      });
    },

    /** 修改提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(() => {
        updatePaper(this.form).then(response => {
          if (response.code === 200) {
            this.msgSuccess("修改成功");
            this.open = false;
            this.getList();
          } else {
            this.msgError(response.msg);
          }
        });
      });
    },

    /** 删除按钮操作 */
    handleDelete(row) {
      const userName = row.userName;
      const id = row.id;
      this.$confirm('是否确认删除类别名称为' + techType + '的信息?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delPaper(id);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
  }
};
</script>
