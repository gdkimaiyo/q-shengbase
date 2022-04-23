<template>
  <q-form class="form" @submit="onSubmit">
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
      :rules="[(val) => (val && val.length > 0) || 'Password cannot be empty!']"
    >
      <template v-slot:append>
        <q-icon
          :name="isPwd ? 'visibility_off' : 'visibility'"
          class="cursor-pointer"
          @click="isPwd = !isPwd"
        />
      </template>
    </q-input>
    <div class="q-mt-md">
      <q-btn no-caps :loading="isLoading" type="submit" color="primary">
        Sign In
        <template v-slot:loading>
          <q-spinner class="on-left" color="white" />
        </template>
      </q-btn>
      <span v-if="isLoading" class="q-pl-md">Signing In...</span>
    </div>
  </q-form>
</template>

<script>
import { defineComponent, ref } from "vue";
import { Notify } from "quasar";
import { registerUser } from "../shared/services/UserService";

export default defineComponent({
  name: "LoginForm",

  setup() {
    return {
      isPwd: ref(true),
      email: ref(null),
      password: ref(null),
      isLoading: ref(false),
    };
  },

  methods: {
    async onSubmit() {
      this.isLoading = true;

      const data = {
        email: this.email,
        password: this.password,
      };

      // console.log(data);
      setTimeout(() => {
        this.isLoading = false;
        Notify.create({
          type: "warning",
          message: "Sign In feature coming soon.",
          group: false,
        });
      }, 3000);
      return;

      await registerUser(data)
        .then((response) => {
          if (response.message === "email already registered") {
            Notify.create({
              type: "warning",
              message: "Error! Email is already registered.",
              group: false,
            });
            this.isLoading = false;
          } else {
            Notify.create({
              type: "positive",
              message: "Success! Successfully registered.",
              group: false,
            });
            this.$router.push("/");
            this.isLoading = false;
          }
        })
        .catch((error) => {
          console.log(error);
          Notify.create({
            type: "negative",
            message: "Error! Something went wrong while registering.",
            group: false,
          });
          this.isLoading = false;
        });
    },

    validateEmail(email) {
      if (email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
      } else {
        return false;
      }
    },
  },
});
</script>

<style lang="scss" scoped>
@media only screen and (max-width: 575px) {
  //
}
</style>
