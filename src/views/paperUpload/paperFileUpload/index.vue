<template>
  <div class="app-container">

    <el-button
      size="small"
      type="primary"
      icon="el-icon-plus"
      @click="handleUpload()"
    >新建</el-button>

    <el-table v-loading="loading" :data="paperList" style="padding-top: 15px">
      <el-table-column label="论文编号" prop="id" width="120"/>
      <el-table-column label="老师姓名" prop="teacher" :show-overflow-tooltip="true" width="150" />
      <el-table-column label="课题来源" prop="titleSource" :formatter="sourceFormat" width="150" />
      <el-table-column label="论文题目" prop="title" width="200" />
      <el-table-column label="技术类别" prop="techType" width="120" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >编辑</el-button>
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

    <!-- 上传论文信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="论文名字" prop="title">
          <el-input v-model="form.title" placeholder="请输入论文名字" />
        </el-form-item>
        <el-form-item label="老师姓名" prop="teacher">
          <el-input v-model="form.teacher" placeholder="请输入老师姓名" />
        </el-form-item>
        <el-form-item label="课题来源" prop="titleSource">
          <el-select
            v-model="queryParams.titleSource"
            placeholder="请选择课题来源"
            clearable
            size="small"
            style="width: 240px"
          >
            <el-option
              v-for="dict in titleSource"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="技术类别" prop="techType">
          <el-input v-model="form.techType" placeholder="请输入技术类别名称" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-upload
          style="padding-bottom: 60px"
          class="upload-paper"
          action="#"
          :http-request="httpRequest"
          :before-upload="beforeFileUpload"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :multiple="false"
          :limit="1"
          accept="*.doc*.docx"
          :on-exceed="handleExceed"
          :file-list="fileList">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传doc/docx文件，且不超过50M</div>
        </el-upload>
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 修改论文信息对话框 -->
    <el-dialog :title="title" :visible.sync="openEdit" width="500px">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="论文名字" prop="title">
          <el-input v-model="form.title" placeholder="请输入论文名字" />
        </el-form-item>
        <el-form-item label="老师姓名" prop="teacher">
          <el-input v-model="form.teacher" placeholder="请输入老师姓名" />
        </el-form-item>
        <el-form-item label="技术类别" prop="techType">
          <el-input v-model="form.techType" placeholder="请输入技术类别名称" />
        </el-form-item>
        <el-form-item label="课题来源" prop="titleSource">
          <el-select
            v-model="form.titleSource"
            placeholder="请选择课题来源"
            clearable
            size="small"
            style="width: 240px"
          >
            <el-option
              v-for="dict in this.titleSource"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="submitEditForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </el-dialog>

  </div>
</template>

<script>
  import { listPaper, uploadPaper, delPaper, getPaper, uploadFile, updatePaper } from "@/api/paper/paperInfo/paper";

  export default {
    name: "Paper",
    data() {
      return {
        // 上传
        fileList: [],

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
        openEdit: false,
        file:'',
        fileUrl: '',

        // 课题来源数据字典
        titleSource: [
          {value: "1", label: '教师科研'},
          {value: "2", label: '社会生产实践'},
          {value: "3", label: '教学'},
          {value: "4", label: '其他'},
        ],

        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          techType: undefined,
          teacher: undefined,
          title: undefined,
          titleSource: undefined
        },
        // 表单参数
        form: {},
      };
    },
    created() {
      this.getList();
    },
    methods: {
      // 课题来源映射
      sourceFormat(row) {
        const sourceId = row.titleSource;
        let sourceName;
        switch(sourceId) {
          case '1':
            sourceName = '教师科研';
            break;
          case '2':
            sourceName = '社会生产实践';
            break;
          case '3':
            sourceName = '教学';
            break;
          default:
            sourceName = '其他';
        }
        return sourceName;
      },

      sourceChange(techId) {
        console.log("techId",techId);
        let sourceName;
        switch(techId) {
          case '1':
            sourceName = '教师科研';
            break;
          case '2':
            sourceName = '社会生产实践';
            break;
          case '3':
            sourceName = '教学';
            break;
          default:
            sourceName = '其他';
        }
        return sourceName;
      },

      // 上传
      beforeFileUpload (file) {
        this.file = file;
        const isAccept = file.name.endsWith('doc') || file.name.endsWith('docx');
        const isLt50M = file.size / 1024 / 1024 < 50;
        console.log(isAccept);
        if (!isAccept) {
          this.$message.error('上传文件只能是 doc 或 docx 格式!')
        }
        if (!isLt50M) {
          this.$message.error('上传文件大小不能超过 50MB!')
        }
        return (isAccept) && isLt50M
      },

      handlePreview() {

      },

      // handleRemove() {
      //
      // },

      httpRequest (data) {
        let _this = this;
        let rd = new FileReader(); // 创建文件读取对象
        let file = data.file;
        rd.readAsDataURL(file); // 文件读取装换为base64类型
        rd.onloadend = function (e) {
          _this.data.fileUrl = this.result // this指向当前方法onloadend的作用域
        }
      },

      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },

      handleRemove(file) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },

      /** 查询论文基本信息列表 */
      getList() {
        this.loading = true;
        listPaper(this.queryParams).then(
          response => {
            this.paperList = response.rows;
            this.total = response.total;
            this.loading = false;
          }
        );
      },

      // 取消新建按钮
      cancel() {
        this.open = false;
      },

      // 取消修改按钮
      cancel() {
        this.openEdit = false;
      },

      // 表单重置
      reset() {
        this.form = {
          userName: undefined,
          techType: undefined,
          teacher: undefined,
          title: undefined,
          titleSource: "0",
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
          this.openEdit = true;
          this.title = "修改论文基本信息";
        });
      },

      /** 新增论文确定按钮 */
      submitForm: function() {
        console.log(this.file);
        let formData = new FormData();
        formData.append('file',this.file);
        uploadFile(formData);
        this.$refs["form"].validate(() => {
          uploadPaper(this.form).then(response => {
            if (response.code === 200) {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            } else {
              this.msgError(response.msg);
            }
          });
        });
      },

      /** 修改确定按钮 */
      submitEditForm: function() {
        this.$refs["form"].validate(() => {
          updatePaper(this.form).then(response => {
            if (response.code === 200) {
              this.msgSuccess("修改成功");
              this.openEdit = false;
              this.getList();
            } else {
              this.msgError(response.msg);
            }
          });
        });
      },

      /**上传论文附带信息**/
      handleUpload() {
        this.open = true;
      },

      /** 删除按钮操作 */
      handleDelete(row) {
        const userName = row.userName;
        const id = row.id;
        this.$confirm('是否确认删除学号为' + userName + '的论文信息?', "警告", {
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
