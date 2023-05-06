<template>
  <footer id="footer" class="footer">
    <div class="quick-links">
      <div class="nav-btn">
        <a class="q-pr-sm" clickable @click="goHome()">ShengBase</a>
      </div>
      <div class="nav-btn">
        <a class="q-pr-sm" clickable @click="goTo('/about')"> About </a>
      </div>
      <div class="nav-btn" v-if="!isAuthenticated">
        <a class="q-pr-sm" clickable @click="goTo('/register')"> Register </a>
      </div>
      <div class="nav-btn" v-if="!isAuthenticated">
        <a class="q-pr-sm" clickable @click="goTo('/login')"> Sign In </a>
      </div>
      <div class="nav-btn" v-if="isAuthenticated">
        <a class="q-pr-sm" clickable @click="goTo('/profile')"> My Profile </a>
      </div>
      <div class="nav-btn" v-if="isAuthenticated">
        <a class="q-pr-sm" clickable @click="doLogout()"> Sign Out </a>
      </div>
    </div>

    <div class="copyright q-pt-lg">
      <q-separator spaced color="white" />
      <div class="q-mt-md">
        &copy;
        {{ year }}
        <q-icon
          name="fas fa-circle"
          color="white"
          size="5px"
          style="padding: 0 6px"
        />
        <a class="href-link" clickable @click="goHome()" style="color: #ffffff">
          ShengBase
        </a>
        <q-icon
          name="fas fa-circle"
          color="white"
          size="5px"
          style="padding: 0 6px"
        />
        <a
          href="https://www.linkedin.com/in/gideon-kimaiyo"
          target="_blank"
          rel="noopener noreferrer"
          class="href-link"
          style="color: #ffffff"
        >
          Gideon Kimaiyo
        </a>
        <q-icon
          name="fas fa-circle"
          color="white"
          size="5px"
          style="padding: 0 6px"
        />
        All Rights Reserved
      </div>
    </div>
  </footer>
</template>

<script>
import { defineComponent, ref } from "vue";
import { Notify } from "quasar";
import { isVerified, saveActivityLogs } from "../utils/helpers.js";

export default defineComponent({
  name: "FooterBar",

  setup() {
    return {
      isAuthenticated: ref(false),
      year: ref(new Date().getFullYear()),
    };
  },

  async created() {
    this.isAuthenticated = await isVerified();
  },

  methods: {
    goHome() {
      this.$router.push("/");
    },

    goTo(route) {
      this.$router.push(route);
    },

    doLogout() {
      const user = JSON.parse(localStorage.getItem("sb_user"));
      this.$store.dispatch("auth/logout");
      Notify.create({
        type: "positive",
        message: "Success! Logout successful.",
        group: false,
      });

      // Save user activity log
      const userAction = {
        userId: user?._id,
        action: `Signed out of your account`,
      };
      saveActivityLogs(userAction);

      this.$router.push("/");
    },
  },
});
</script>

<style lang="scss" scoped>
.footer {
  bottom: 0;
  width: 100%;
  color: #ffffff;
  background-color: rgba(83, 183, 129, 0.87);
}
.href-link {
  text-decoration: none;
  cursor: pointer;
}
.nav-btn {
  padding: 6px;
  padding-left: 0;
  display: inline-block;
}
.nav-btn a {
  cursor: pointer;
}
.nav-btn a:hover {
  text-decoration: underline;
}
.quick-links,
.copyright {
  width: 100%;
  max-width: 1024px;
  padding: 16px;
  margin: 0 auto;
}

.quick-links {
  padding-top: 48px;
}

.copyright {
  padding-bottom: 42px;
}

@media only screen and (max-width: 575px) {
  .quick-links {
    padding-top: 38px;
  }
}
</style>
