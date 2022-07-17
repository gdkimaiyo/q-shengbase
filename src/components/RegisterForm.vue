<template>
  <q-form class="form" @submit.prevent="onSubmit">
    <q-input
      class="q-py-md"
      filled
      v-model="fullname"
      label="Full Name *"
      dense
      type="text"
      lazy-rules
      :rules="[
        (val) =>
          validateFullName(val) || 'Please provide firstname and lastname',
      ]"
    />
    <q-input
      class="q-py-md"
      filled
      v-model="email"
      label="Email Address *"
      dense
      type="email"
      lazy-rules
      :rules="[
        (val) => validateEmail(val) || 'Please provide a valid email address',
      ]"
    />
    <q-input
      class="q-py-md"
      filled
      v-model="password"
      label="Password *"
      dense
      :type="isPwd ? 'password' : 'text'"
      lazy-rules
      :rules="[
        (val) => validatePass(val) || 'Password should be 4 characters long',
      ]"
    >
      <template v-slot:append>
        <q-icon
          :name="isPwd ? 'visibility_off' : 'visibility'"
          class="cursor-pointer"
          @click="isPwd = !isPwd"
        />
      </template>
    </q-input>
    <q-input
      class="q-py-md"
      filled
      v-model="confirmPassword"
      label="Confirm Password *"
      dense
      :type="isPwdConfirm ? 'password' : 'text'"
      lazy-rules
      :rules="[(val) => validateConfirm(val) || 'Passwords must match']"
    >
      <template v-slot:append>
        <q-icon
          :name="isPwdConfirm ? 'visibility_off' : 'visibility'"
          class="cursor-pointer"
          @click="isPwdConfirm = !isPwdConfirm"
        />
      </template>
    </q-input>
    <div class="q-mt-md">
      <q-btn no-caps :loading="isLoading" type="submit" color="primary">
        Register
        <template v-slot:loading>
          <q-spinner class="on-left" color="white" />
        </template>
      </q-btn>
      <span v-if="isLoading" class="q-pl-md">Registering...</span>
    </div>
  </q-form>
</template>

<script>
import { defineComponent, ref } from "vue";
import { Notify } from "quasar";

import {
  validateEmail,
  validateFullName,
  getName,
  saveActivityLogs,
} from "../utils/helpers.js";

export default defineComponent({
  name: "RegisterForm",

  setup() {
    return {
      isPwd: ref(true),
      isPwdConfirm: ref(true),
      fullname: ref(null),
      email: ref(null),
      password: ref(null),
      confirmPassword: ref(null),
      isLoading: ref(false),
    };
  },

  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    },
  },

  created() {
    if (this.loggedIn) {
      this.$router.push("/");
    }
  },

  methods: {
    async onSubmit() {
      this.isLoading = true;

      const data = {
        firstname: this.getName("first", this.fullname),
        lastname: this.getName("last", this.fullname),
        email: this.email,
        password: this.password,
      };

      await this.$store.dispatch("auth/register", data).then(
        (res) => {
          Notify.create({
            type: "positive",
            message: "Success! Registration successful.",
            group: false,
          });

          // Save user activity log
          const userAction = {
            userId: res?._id,
            action: `Registered for an account`,
          };
          saveActivityLogs(userAction);

          this.isLoading = false;
          this.$router.push("/login");
        },
        (error) => {
          if (error?.response?.status === 409) {
            Notify.create({
              type: "warning",
              message: "Error! Email is already registered.",
              group: false,
            });
          } else {
            Notify.create({
              type: "negative",
              message: error?.response?.data?.message
                ? error.response.data.message
                : "Something went wrong while registering.",
              group: false,
            });
          }
          this.isLoading = false;
        }
      );
      // this.clearForm();
    },

    validateFullName,
    validateEmail,
    getName,

    validatePass(pass) {
      if (pass && pass.length > 3) {
        return true;
      } else {
        return false;
      }
    },

    validateConfirm(pass) {
      if (pass && pass.length > 3 && pass === this.password) {
        return true;
      } else {
        return false;
      }
    },

    clearForm() {
      this.fullname = null;
      this.email = null;
      this.password = null;
      this.confirmPassword = null;
    },
  },
});
</script>

<style lang="scss" scoped>
@media only screen and (max-width: 575px) {
  //
}
</style>
