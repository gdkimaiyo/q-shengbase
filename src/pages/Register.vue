<template>
  <q-page class="bg-grey-3 column q-py-xl">
    <div class="main-page q-pa-md">
      <div class="register-section">
        <div class="register-info">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minima
            molestiae maxime unde harum quidem nobis, alias, voluptatum cumque
            blanditiis tempore nostrum? Libero eos magnam dolores similique, est
            delectus quia modi?
          </p>
        </div>
        <div class="register-form">
          <h5 class="logo-btn href-link q-my-none q-pb-md" @click="navigateTo('/')">ShengBase</h5>
          <div class="text-h5 q-pb-sm text-weight-bold">Create your Account</div>
          <div class="text-subtitle2 q-pb-md text-weight-bold">
            Already have an account?
            <a class="href-link" @click="navigateTo('/login')">Sign In</a>
          </div>
          <RegisterForm />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import RegisterForm from "../components/RegisterForm.vue";

export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Register",

  components: {
    RegisterForm,
  },

  methods: {
    navigateTo(route) {
      this.$router.push(route);
    },
  },
});
</script>

<style lang="scss" scoped>
.main-page {
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

.register-section {
  min-height: 65vh;
  border-radius: 12px;
  background: #ffffff;
  display: flex;
  justify-content: center;
  // box-shadow: 0 3px 5px -1px #0003, 0 6px 10px #00000024, 0 0 4px #42b983;
  // box-shadow: 0px 1px 9px 2px rgba(0, 0, 0, 0.15);
}
.register-info {
  width: 45%;
  display: block;
  background-image: url("../assets/sky.png");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
  margin-left: 0;
  color: #ffffff;
  border-radius: 12px 0 0 12px;

  p {
    padding: 24px;
  }
}
.register-form {
  width: 55%;
  margin-left: 32px;
  padding: 24px;
}

@media only screen and (max-width: 575px) {
  .main-page {
    padding: 8px;
  }
  .register-section {
    border-radius: 4px;
  }
  .logo-btn:hover {
    color: #0c45b0;
  }
  .register-info {
    display: none;
  }
  .register-form {
    width: 100%;
    max-width: 100%;
    margin-left: 0;
  }
}
</style>
