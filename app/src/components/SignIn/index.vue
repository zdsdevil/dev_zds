<template>
  <div class="sign-in">
    <Popup
      title="登录"
      width="300px"
      :show="show"
      lock
      :showCloseBtn="true"
      @close="handlerClose"
    >
      <input
        v-model="params.username"
        class="common-input"
        type="text"
        placeholder="用户名、或邮箱"
        style="width: 260px"
        @keyup.enter="login"
      />

      <input
        v-model="params.password"
        class="common-input"
        type="password"
        placeholder="密码"
        style="width: 260px"
        @keyup.enter="login"
      />
      <div style="text-align: right">
        <span
          style="font-size: 12px; color: #999; cursor: pointer"
          @click="handleForgetPwd"
        >
          忘记密码？
        </span>
      </div>
      <div class="btn" slot="footer">
        <btn theme="gradient" :loading="loading" long @click="login"
          >确定登录
        </btn>
        <btn :style="{ marginTop: '10px' }" long @click="register"
          >我要注册
        </btn>
      </div>
    </Popup>
  </div>
</template>

<script>
import Popup from "../Popup/index.vue";
import Btn from "../Btn";
import { mapActions } from "vuex";
import { login } from "@/api/userManager";

export default {
  components: { Popup, Btn },
  data() {
    return {
      params: {
        username: null,
        password: null,
      },
      loading: false,
    };
  },
  methods: {
    ...mapActions(["toggleSignInPopup", "toggleSignUpPopup", "initGetInfo"]),
    login() {
      this.validateForm().then(async (valid) => {
        if (valid) {
          const res = await login(this.params);
          await this.initGetInfo(res.result.token);
          this.handlerClose();
          this.$message.success("登录成功!");
          this.$emit('passJoin')
        }
      });
    },
    handleForgetPwd() {
      this.$message.warning("暂时不支持找回您的密码哟");
    },
    register() {
      this.toggleSignInPopup(false);
      this.toggleSignUpPopup(true);
    },
    handlerClose() {
      this.toggleSignInPopup(false);
    },
    validateForm() {
      return new Promise((resolve) => {
        const { username, password } = this.params;
        if (!username || !password) {
          this.$message.error("请输入您的账号密码");
          resolve(false);
        }
        if (username.length > 32 || username.length < 2) {
          this.$message.error("请输入2-32位数的账号");
          resolve(false);
        }
        if (password.length > 8 || password.length < 2) {
          this.$message.error("密码在6-32位数之间哟");
          resolve(false);
        }
        resolve(true);
      });
    },
  },
  created() {},
  mounted() {},
  watch: {},
  computed: {
    show() {
      return this.$store.state.chat.showSignInPopup;
    },
  },
};
</script>
<style lang="less" scoped>
.sign-in {
  .login {
    // width: 100%;
  }
  .btn {
    width: 100%;
    padding: 0 10px;
  }
}
</style>
