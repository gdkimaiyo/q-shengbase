<template>
  <q-page class="bg-grey-3 page column q-pt-xl">
    <div class="section q-pa-md">
      <div class="login-section">
        <div class="login-form q-mt-xl">
          <h5 class="logo-btn q-my-none q-pb-md" @click="navigateTo('/')">
            <span class="href-link">ShengBase</span>
          </h5>
          <div class="text-h5 q-pb-sm text-weight-bold">
            Sign in to your account
          </div>
          <div class="text-subtitle2 q-pb-md text-weight-bold">
            Don't have an account?
            <a class="href-link" @click="navigateTo('/register')">
              Register here
            </a>
          </div>
          <LoginForm />
        </div>

        <div class="login-info q-pt-xl"></div>
      </div>
      <div class="copyright text-center q-mb-lg q-pt-md">
        <p class="q-my-none q-py-md q-px-lg">
          &copy;{{ currentYear }},
          <span style="color: rgba(0, 0, 0, 0.6)"> All Rights Reserved.</span>
          <a @click="navigateTo('/')" class="text-weight-medium cursor-pointer">
            ShengBase.
          </a>
          <a @click="navigateTo('/')" class="text-primary cursor-pointer">
            Privary and Terms
          </a>
        </p>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref } from "vue";
import LoginForm from "../components/LoginForm.vue";

import { isVerified } from "../utils/helpers.js";

export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Login",

  components: {
    LoginForm,
  },

  setup() {
    return {
      isVerified: ref(false),
    };
  },

  async created() {
    this.isVerified = await isVerified();
    if (this.isVerified === true) {
      this.$router.push("/");
    }
  },

  methods: {
    navigateTo(route) {
      this.$router.push(route);
    },
  },

  computed: {
    currentYear() {
      const date = new Date();
      return date.getFullYear();
    },
  },
});
</script>

<style lang="scss" scoped>
.section {
  width: 100%;
  max-width: 960px;
  margin: 0 auto;
}
.href-link {
  color: #0c45b0;
  cursor: pointer;
}
.logo-btn {
  font-size: 1.7rem;
  font-weight: bold;
}
.href-link:hover {
  color: rgba(12, 69, 176, 0.85);
}

.login-section {
  min-height: 65vh;
  border-radius: 12px;
  background: #ffffff;
  display: flex;
  justify-content: center;
  // box-shadow: 0 3px 5px -1px #0003, 0 6px 10px #00000024, 0 0 4px #42b983;
  // box-shadow: 0px 1px 9px 2px rgba(0, 0, 0, 0.15);
}
.login-info {
  background-image: url("../assets/board.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
  color: #ffffff;
}
.login-form {
  width: 40%;
  margin-left: 18px;
  margin-right: 32px;
  padding: 24px;
}
.login-info {
  width: 60%;
  display: block;
  margin-left: 0;
  border-radius: 0 12px 12px 0;

  p {
    padding: 24px;
  }
}

.copyright {
  font-size: 14px;
}

@media only screen and (max-width: 575px) {
  .page {
    margin-top: 0 !important;
    background-color: #ffffff !important;
  }
  .section {
    padding: 0;
  }
  .login-section {
    border-radius: 4px;
  }
  .logo-btn:hover {
    color: #0c45b0;
  }
  .login-info {
    display: none;
  }
  .login-form {
    width: 100%;
    max-width: 100%;
    margin-left: 0;
    margin-right: 0;
  }
  .copyright {
    text-align: left;
  }
}
</style>
