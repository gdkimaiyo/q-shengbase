<template>
  <q-header id="navbar">
    <q-toolbar class="toolbar q-py-sm">
      <q-toolbar-title>
        <a @click="goHome()" class="logo-btn" clickable>ShengBase</a>
      </q-toolbar-title>

      <div>
        <div id="onDesktop">
          <q-btn
            no-caps
            flat
            to="/about"
            class="nav-btn"
            :class="{ 'active-link': currentRoute === '/about' }"
            label="About"
          />
          <q-btn
            v-if="!isAuthenticated"
            no-caps
            flat
            to="/register"
            class="nav-btn"
            label="Register"
          />
          <q-btn
            v-if="!isAuthenticated"
            no-caps
            flat
            to="/login"
            class="nav-btn"
            label="Sign In"
          />

          <q-btn
            v-if="isAuthenticated"
            no-caps
            flat
            to="/profile"
            class="nav-btn"
            :class="{ 'active-link': currentRoute === '/profile' }"
            label="My Profile"
          />

          <q-btn
            v-if="isAuthenticated"
            no-caps
            @click="doLogout()"
            flat
            class="nav-btn"
            label="Sign Out"
          />
        </div>

        <q-btn
          flat
          dense
          round
          id="onHandset"
          icon="menu"
          aria-label="Menu"
          @click="dropDownMenu = !dropDownMenu"
        >
          <q-menu auto-close>
            <q-list
              style="min-width: 100px; height: calc(100% - 0); margin-top: 0"
            >
              <q-item to="/about" exact clickable v-ripple>
                <q-item-section> About </q-item-section>
              </q-item>

              <q-item
                v-if="!isAuthenticated"
                to="/register"
                exact
                clickable
                v-ripple
              >
                <q-item-section> Register </q-item-section>
              </q-item>

              <q-item
                v-if="!isAuthenticated"
                to="/login"
                exact
                clickable
                v-ripple
              >
                <q-item-section> Sign In </q-item-section>
              </q-item>

              <q-item
                v-if="isAuthenticated"
                to="/profile"
                exact
                clickable
                v-ripple
              >
                <q-item-section> My Profile </q-item-section>
              </q-item>

              <q-item
                v-if="isAuthenticated"
                @click="doLogout()"
                exact
                clickable
                v-ripple
              >
                <q-item-section> Sign Out </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </div>
    </q-toolbar>
  </q-header>
</template>

<script>
import { defineComponent, ref } from "vue";
import { Notify } from "quasar";
import { useRoute } from "vue-router";
import { isVerified, saveActivityLogs } from "../utils/helpers.js";

export default defineComponent({
  name: "NavBar",

  setup() {
    return {
      dropDownMenu: ref(false),
      isAuthenticated: ref(false),
    };
  },

  async created() {
    this.isAuthenticated = await isVerified();
  },

  methods: {
    goHome() {
      this.$router.push("/");
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

      this.$router.push("/login");
    },
  },

  computed: {
    currentRoute() {
      return useRoute().path;
    },
  },
});
</script>

<style lang="scss" scoped>
// #navbar {
//   box-shadow: 0 3px 5px -1px #0003, 0 6px 10px #00000024, 0 1px 18px #0000001f;
// }
.toolbar {
  width: 100%;
  max-width: 1024px;
  margin: 0 auto;
}

.logo-btn {
  font-size: 1.7rem;
  font-weight: bold;
  color: #ffffff;
  cursor: pointer;
}
.logo-btn:hover {
  color: rgba(255, 255, 255, 0.6);
}
.nav-btn {
  color: #ffffff;
  font-weight: bold;
  font-size: 16px;
}
.nav-btn:hover {
  color: #1d1d1d;
}

.active-link {
  color: #1d1d1d;
}

#onHandset {
  display: none;
}

#onDesktop {
  display: block;
}

@media only screen and (max-width: 575px) {
  .logo-btn:hover {
    color: #ffffff;
  }
  #onHandset {
    display: block;
  }
  #onDesktop {
    display: none;
  }
}
</style>
