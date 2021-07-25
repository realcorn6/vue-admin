<template>
  <div class="login">
    <div class="login-wrap">
      <ul class="menu-tab">
        <li
          :class="{ current: item.current }"
          v-for="item in menuTab"
          :key="item.id"
          @click="toggleMenu(item)"
        >
          {{ item.txt }}
        </li>
      </ul>
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        class="login-form"
        size="medium"
      >
        <el-form-item prop="username" class="item-form">
          <label for="username">邮箱</label>
          <el-input
            id="username"
            type="text"
            v-model="ruleForm.username"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password" class="item-form">
          <label for="password">密码</label>
          <el-input
            id="password"
            type="password"
            v-model="ruleForm.password"
            autocomplete="off"
            minlength="6"
            maxlength="20"
          ></el-input>
        </el-form-item>
        <el-form-item
          prop="passwords"
          class="item-form"
          v-show="model === 'register'"
        >
          <label for="passwords">重复密码</label>
          <el-input
            id="passwords"
            type="password"
            v-model="ruleForm.passwords"
            autocomplete="off"
            minlength="6"
            maxlength="20"
          ></el-input>
        </el-form-item>
        <el-form-item prop="code" class="item-form">
          <label for="code">验证码</label>
          <el-row :gutter="10">
            <el-col :span="15">
              <el-input
                id="code"
                v-model="ruleForm.code"
                minlength="6"
                maxlength="6"
              ></el-input>
            </el-col>
            <el-col :span="9">
              <el-button
                type="success"
                class="block"
                @click="getSms()"
                :disabled="codeButton.status"
                >{{ codeButton.text }}</el-button
              >
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-button
            type="danger"
            @click="submitForm('ruleForm')"
            class="login-btn block"
            :disabled="loginButtonStatus"
            >{{ model === "login" ? "登录" : "注册" }}</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {
  stripscript,
  validateEmail,
  validatePass,
  validateVCode,
} from "@/utils/validate";
import { GetSms, Register, Login } from "@/api/login";
import sha1 from "js-sha1";

export default {
  name: "index.vue",
  data() {
    // 验证用户名为邮箱
    var validateUsername = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入用户名"));
      } else if (!validateEmail(value)) {
        callback(new Error("用户名格式有误"));
      } else {
        callback();
      }
    };
    // 验证密码
    var validatePassword = (rule, value, callback) => {
      this.ruleForm.password = stripscript(value);
      value = this.ruleForm.password;
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (!validatePass(value)) {
        callback(new Error("密码为6-20位数字+字母"));
      } else {
        callback();
      }
    };
    // 验证重复密码
    var validatePasswords = (rule, value, callback) => {
      if (this.model === "login") {
        callback();
      }
      this.ruleForm.passwords = stripscript(value);
      value = this.ruleForm.passwords;
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value != this.ruleForm.password) {
        callback(new Error("重复密码不正确"));
      } else {
        callback();
      }
    };
    // 验证验证码
    var validateCode = (rule, value, callback) => {
      this.ruleForm.code = stripscript(value);
      value = this.ruleForm.code;
      if (value === "") {
        callback(new Error("请输入验证码"));
      } else if (!validateVCode(value)) {
        callback(new Error("验证码格式有误"));
      } else {
        callback();
      }
    };
    return {
      menuTab: [
        { txt: "登录", current: true, type: "login" },
        { txt: "注册", current: false, type: "register" },
      ],
      model: "login",
      // 登录按钮禁用状态
      loginButtonStatus: true,
      // 获取验证码按钮禁用状态
      codeButton: {
        status: false,
        text: "获取验证码",
      },
      // 倒计时
      timer: null,
      ruleForm: {
        username: "",
        password: "",
        passwords: "",
        code: "",
      },
      rules: {
        username: [{ validator: validateUsername, trigger: "blur" }],
        password: [{ validator: validatePassword, trigger: "blur" }],
        passwords: [{ validator: validatePasswords, trigger: "blur" }],
        code: [{ validator: validateCode, trigger: "blur" }],
      },
    };
  },
  methods: {
    /**
     * 切换登录注册
     */
    toggleMenu(data) {
      this.menuTab.forEach((elem) => {
        elem.current = false;
      });
      data.current = true;
      this.model = data.type;
      this.$refs["ruleForm"].resetFields();
      this.clearCountDown();
    },
    /**
     * 获取验证码
     */
    getSms() {
      if (this.ruleForm.username === "") {
        this.$message.error("邮箱不能为空");
        return false;
      }
      if (!validateEmail(this.ruleForm.username)) {
        this.$message.error("邮箱格式有误，请重新输入");
        return false;
      }
      this.codeButton.status = true;
      this.codeButton.text = "发送中";
      let requestData = {
        username: this.ruleForm.username,
        module: this.model,
      };
      setTimeout(() => {
        GetSms(requestData)
          .then((response) => {
            let data = response.data;
            this.$message({
              message: data.message,
              type: "success",
            });
            this.loginButtonStatus = false;
            this.countDown(60);
          })
          .catch((error) => {
            console.log(error);
          });
      }, 3000);
    },
    /**
     * 提交表单
     */
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.model === "login" ? this.login() : this.register();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    /**
     * 登录
     */
    login() {
      let requestData = {
        username: this.ruleForm.username,
        password: sha1(this.ruleForm.password),
        code: this.ruleForm.code,
      };
      Login(requestData)
        .then((response) => {
          let data = response.data;
          this.$message({
            message: data.message,
            type: "success",
          });
          this.clearCountDown();
          this.$router.push({
            name: "Console",
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    /**
     * 注册
     */
    register() {
      let requestData = {
        username: this.ruleForm.username,
        password: sha1(this.ruleForm.password),
        code: this.ruleForm.code,
      };
      Register(requestData)
        .then((response) => {
          let data = response.data;
          this.$message({
            message: data.message,
            type: "success",
          });
          this.toggleMenu(this.menuTab[0]);
          this.clearCountDown();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    /**
     * 获取验证码倒计时
     */
    countDown(number) {
      if (this.timer) {
        clearInterval(this.timer);
      }
      let time = number;
      this.timer = setInterval(() => {
        time--;
        if (time === 0) {
          clearInterval(this.timer);
          this.codeButton.status = false;
          this.codeButton.text = "重新获取";
        } else {
          this.codeButton.text = "倒计时" + time + "秒";
        }
      }, 1000);
    },
    /**
     * 清除验证码倒计时
     */
    clearCountDown() {
      this.codeButton.status = false;
      this.codeButton.text = "获取验证码";
      clearInterval(this.timer);
    },
  },
};
</script>

<style lang="scss" scoped>
.login {
  background-color: #344a5f;
  /* vh做单位，相当于可视区的百分比 */
  height: 100vh;
}
.login-wrap {
  width: 330px;
  margin: auto;
}
.menu-tab {
  text-align: center;
  li {
    display: inline-block;
    width: 88px;
    line-height: 36px;
    font-size: 14px;
    color: #fff;
    border-radius: 2px;
    cursor: pointer;
  }
  .current {
    background-color: rgba(0, 0, 0, 0.1);
  }
}
.login-form {
  margin-top: 29px;

  label {
    display: block;
    font-size: 14px;
    color: #fff;
    margin-bottom: 3px;
  }
  .item-form {
    margin-bottom: 13px;
  }
  .block {
    width: 100%;
    display: block;
  }
  .login-btn {
    margin-top: 19px;
  }
}
</style>
