<template>
  <q-page class="column q-pb-xl">
    <AfterNavBar :imageSrc="src" title="My Profile" :paths="paths" />
    <div class="main-page q-pa-md">
      <!-- <h5 class="q-mt-none">Profile Page</h5> -->
      <div class="loading-state" v-if="isLoading">
        <p>
          <q-spinner-puff color="primary" size="2rem" />
          <q-spinner-puff color="primary" size="2rem" />
          <q-spinner-puff color="primary" size="2rem" />
          <q-spinner-puff color="primary" size="2rem" />
          <!-- Loading... -->
        </p>
      </div>
      <div class="profile" v-if="!isLoading && user !== null">
        <q-list>
          <q-item class="q-my-md q-pl-none">
            <q-item-section avatar>
              <q-avatar color="primary" text-color="white" size="56px">
                {{ user.firstname.charAt(0) }}{{ user.lastname.charAt(0) }}
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-bold">
                {{ user.firstname }} {{ user.lastname }}
              </q-item-label>
              <q-item-label lines="1">{{ user.email }}</q-item-label>
              <q-item-label caption lines="1">
                <!-- <span class="text-weight-bold">Joined: </span> -->
                {{ registerDate(user.created) }} at
                {{ registerTime(user.created) }}
              </q-item-label>
            </q-item-section>

            <q-item-section side class="gt-xs">
              <q-btn outline color="primary" @click="updateProfile">
                Update
              </q-btn>
            </q-item-section>
          </q-item>

          <q-item class="lt-sm q-my-md q-pl-none">
            <q-item-section>
              <q-btn outline color="primary" @click="updateProfile">
                Update
              </q-btn>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref } from "vue";
import { date, Notify } from "quasar";
import AfterNavBar from "../components/AfterNavBar.vue";
import { getUser } from "../shared/services/user.service";

export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Profile",

  components: {
    AfterNavBar,
  },

  setup() {
    return {
      src: ref("bg.jpg"),
      paths: ref(["Home", "Profile"]),

      isLoading: ref(false),
      id: ref(undefined),
      user: ref(null),
    };
  },

  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    },
  },
  created() {
    if (!this.loggedIn) {
      this.$router.push("/");
    }
  },

  methods: {
    async getAUser() {
      this.isLoading = true;
      const user = JSON.parse(localStorage.getItem("sb_user"));
      await getUser(user._id)
        .then((response) => {
          this.user = response.data;
          this.isLoading = false;
        })
        .catch((error) => {
          console.log(error);
          if (error?.response?.status === 404) {
            this.$store.dispatch("auth/logout");
            Notify.create({
              type: "negative",
              message: "Error! Unable to load profile.",
              group: false,
            });
            this.$router.push("/");
          } else {
            Notify.create({
              type: "warning",
              message: error?.response?.data?.message
                ? error.response.data.message
                : "Something went wrong. Please check your network connection.",
              group: false,
            });
          }
          this.isLoading = false;
        });
    },

    registerDate(timeStamp) {
      return date.formatDate(new Date(timeStamp), "MMMM, DD YYYY");
    },

    registerTime(timeStamp) {
      return date.formatDate(new Date(timeStamp), "HH:mm");
    },

    updateProfile() {
      Notify.create({
        type: "info",
        message: "Update Profile coming soon...",
        group: false,
      });
    },
  },

  mounted() {
    this.getAUser();
  },
});
</script>

<style lang="scss" scoped>
.main-page {
  width: 100%;
  max-width: 960px;
  margin: 0 auto;
}

@media only screen and (max-width: 575px) {
  .loading-state {
    text-align: center;
  }
}
</style>
