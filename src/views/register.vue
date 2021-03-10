<template>
  <div class="login">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" label-width="70px" class="login-form">
      <h3 class="title">暨南大学毕业论文管理系统</h3>
          <el-form-item label="账号名" prop="userName">
            <el-input v-model="loginForm.userName" type="text" auto-complete="off" placeholder="请输入暨南大学教务系统账号">
            </el-input>
          </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          v-model="loginForm.password"
          type="password"
          auto-complete="off"
          placeholder="密码"
        >
        </el-input>
      </el-form-item>
      <el-form-item prop="nickName" label="姓名">
        <el-input v-model="loginForm.nickName" placeholder="姓名" />
      </el-form-item>
      <el-form-item label="角色" prop="isTeach">
        <el-select v-model="loginForm.isTeach" placeholder="请选择">
          <el-option
            v-for="dict in isTeachOptions"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="this.loginForm.isTeach === 0" prop="graduateTime" label="毕业年份">
        <el-input v-model="loginForm.graduateTime" placeholder="毕业年份" />
      </el-form-item>
      <el-form-item style="width:100%;" label-width="0">
        <el-button
          :loading="loading"
          size="medium"
          type="primary"
          style="width:100%;"
          @click.native.prevent="handleRegister"
        >
          <span v-if="!loading">注 册</span>
          <span v-else>注 册 中...</span>
        </el-button>
        <div class="text-foot">
          已有账号?
          <router-link to="/login" class="login-link">
            登 录
          </router-link>
        </div>
      </el-form-item>
    </el-form>
    <!--  底部  -->
    <div class="el-login-footer">
      <span>Copyright © 2020-2021 Hy All Rights Reserved.</span>
    </div>
  </div>
</template>

<script>
  import { register } from '@/api/login'
  import { encrypt, decrypt } from '@/utils/jsencrypt'

  export default {
    name: "Register",
    data() {
      return {
        isTeachOptions: [
          {value: 0, label: '学生'},
          {value: 1, label: '老师'},
        ],
        codeUrl: "",
        cookiePassword: "",
        loginForm: {
          userName: "",
          password: "",
          code: "",
          uuid: "",
          isTeach: 0
        },
        loginRules: {
          userName: [
            { required: true, trigger: "blur", message: "账号名不能为空" }
          ],
          password: [
            { required: true, trigger: "blur", message: "密码不能为空" }
          ],
          isTeach: [
            { required: true, trigger: "blur", message: "角色不能为空" }
          ],
          nickName: {
            required: true, trigger: "blur", message: "姓名不能为空"
          },
          graduateTime: {
            required: false,
            trigger: "blur",
            pattern:/^[0-9][0-9][0-9][0-9]$/,
            message: "请输入正确的毕业年份"
          }
        },
        loading: false,
        redirect: undefined
      };
    },
    watch: {
      $route: {
        handler: function(route) {
          this.redirect = route.query && route.query.redirect;
        },
        immediate: true
      }
    },
    methods: {
      handleRegister() {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.loading = true;
            register(this.loginForm).then( res => {
              if (res.code === 200) {
                this.msgSuccess("注册成功，请登录")
                this.$router.push({ path: '/login' })
              } else {
                this.msgError(res.msg);
                this.loading = false;
              }
            })
          }
        });
      }
    }
  };
</script>

<style rel="stylesheet/scss" lang="scss">
  .login {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    background-image: url("../assets/image/login-background1.jpg");
    background-size: cover;
  }
  .title {
    margin: 0px auto 30px auto;
    text-align: center;
    color: #707070;
  }

  .login-form {
    border-radius: 6px;
    background: #ffffff;
    width: 450px;
    padding: 25px 25px 5px 25px;
    .el-input {
      height: 38px;
      input {
        height: 38px;
      }
    }
    .input-icon {
      height: 39px;
      width: 14px;
      margin-left: 2px;
    }
  }
  .login-tip {
    font-size: 13px;
    text-align: center;
    color: #bfbfbf;
  }
  .login-code {
    width: 33%;
    height: 38px;
    float: right;
    img {
      cursor: pointer;
      vertical-align: middle;
    }
  }
  .el-login-footer {
    height: 40px;
    line-height: 40px;
    position: fixed;
    bottom: 0;
    width: 100%;
    text-align: center;
    color: #fff;
    font-family: Arial;
    font-size: 12px;
    letter-spacing: 1px;
  }
  .text-foot {
    text-align: center;
    padding: 10px;
    font-weight: 700;
    margin-top: 20px;
    color: var(--color-semidark);
  }

  .login-link {
    color: #0081c6;
    text-decoration: none;
    border-bottom: 1px dashed var(--color-semidark);
    margin-top: -3px;
    padding-bottom: 2px;
    background-color: transparent;
  }
</style>
