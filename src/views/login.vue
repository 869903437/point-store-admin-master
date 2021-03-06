<template>
  <div class="login">
    <div id="el-login-container">
      <el-form
        ref="Form"
        :model="form"
        :rules="rules"
        label-position="left"
        label-width="0px"
        class="login-form"
      >
        <h3 class="title">
          超市 后台管理系统
        </h3>
        <el-form-item prop="username">
          <el-input
            v-model="form.username"
            type="text"
            auto-complete="off"
            placeholder="账号"
          >
            <svg-icon
              slot="prefix"
              icon-class="user"
              class="el-input__icon input-icon"
            />
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password"
            auto-complete="off"
            placeholder="密码"
            @keyup.enter.native="submitForm"
          >
            <svg-icon
              slot="prefix"
              icon-class="password"
              class="el-input__icon input-icon"
            />
          </el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-input
            v-model="form.code"
            auto-complete="off"
            placeholder="验证码"
            style="width: 63%"
            @keyup.enter.native="submitForm"
          >
            <svg-icon
              slot="prefix"
              icon-class="validCode"
              class="el-input__icon input-icon"
            />
          </el-input>
          <div class="login-code">
            <img :src="codeUrl" @click="getCode" alt="验证码" />
          </div>
        </el-form-item>
        <el-checkbox v-model="isRememberMe" style="margin:0 0 25px 0;">
          记住我
        </el-checkbox>
        <el-form-item class="w-100">
          <el-button
            :loading="isLoading"
            type="primary"
            class="w-100"
            @click.native.prevent="submitForm"
          >
            <span v-if="!isLoading">登 录</span>
            <span v-else>登 录 中...</span>
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { loginApi, getCodeApi } from "../api/login";
import { encrypt } from "../utils/encrypt";
import { generateRouter } from "../router";
import { footerTxt, caseNumber } from "../settings";

export default {
  name: "Login",
  data() {
    return {
      isLoading: false,
      isRememberMe: false,
      codeUrl: "",
      form: {
        username: "",
        password: "",
        code: "",
        uuid: ""
      },
      rules: {
        username: { required: true, message: "请输入账号", trigger: "blur" },
        password: { required: true, message: "请输入密码", trigger: "blur" },
        code: { required: true, message: "请输入验证码", trigger: "blur" }
      }
    };
  },
  computed: {
    footerTxt() {
      return footerTxt;
    },
    caseNumber() {
      return caseNumber;
    },
    isShowFooter() {
      return this.$storeGet.setting.isShowFooter;
    }
  },
  mounted() {
    this.getCode();
    this.form.username = this.$storeGet.username;
    this.isRememberMe = this.$storeGet.rememberMe;
  },
  methods: {
    getCode() {
      getCodeApi().then(result => {
        this.codeUrl = result.resultParam.img;
        this.form.uuid = result.resultParam.uuid;
      });
    },
    submitForm() {
      this.$refs["Form"].validate(valid => {
        if (valid) {
          this.isLoading = true;
          const data = { ...this.form };
          data.password = encrypt(data.password);
          loginApi(data)
            .then(result => {
              const { token } = result.resultParam;
              const { user } = result.resultParam;
              this.$storeSet("setUser", user);
              this.$storeSet("setToken", token);
              // 动态拉取路由和菜单
              return generateRouter();
            })
            .then(() => {
              this.$storeSet("setRememberMe", {
                rememberMe: this.isRememberMe,
                username: this.form.username
              });
              this.$router.push({ name: "home" });
              this.isLoading = false;
            })
            .catch(() => {
              this.getCode();
              this.form.code = "";
              this.isLoading = false;
            });
        } else {
          return false;
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
  background: url("../assets/home.png") no-repeat center center;
  background-size: cover;

  .title {
    margin: 0 auto 30px auto;
    text-align: center;
    font-size: 18px;
    font-weight: 600;
  }

  .login-form {
    border-radius: 6px;
    background: white;
    width: 350px;
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

    .el-input__inner {
      color: #1e1e1e;
      background-color: rgba(255, 255, 255, 0.92);
    }
  }

  .login-tip {
    font-size: 13px;
    text-align: center;
    color: #bfbfbf;
  }

  .login-code {
    width: 33%;
    display: inline-block;
    height: 38px;
    float: right;

    img {
      cursor: pointer;
      vertical-align: middle;
      border-radius: 4px;
      height: 38px;
    }
  }

  #el-login-footer {
    height: 40px;
    line-height: 40px;
    position: fixed;
    bottom: 0;
    width: 100%;
    text-align: center;
    color: #e8d5d5;
    font-family: Arial, serif;
    font-size: 12px;
    letter-spacing: 1px;
  }
}
</style>
