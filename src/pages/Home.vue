<template>
  <q-page class="column q-pb-xl">
    <AfterNavBar
      :show_paths="false"
      desc="Add or find trending sheng words in our ShengBase dictionary"
    />
    <div class="main-page q-pa-md">
      <div class="stats">
        <!-- Number of Users -->
        <div class="stats-card text-center q-pt-md">
          <span class="stat-title">Users </span><br />
          <div v-if="isLoading" class="q-pt-sm">
            <q-spinner-dots color="white" size="2.5em" />
          </div>
          <div v-if="!isLoading && users !== null">
            <span class="stat">{{ users.length }}</span>
          </div>
        </div>
        <!-- Number of Words -->
        <div class="stats-card text-center q-pt-md">
          <span class="stat-title">Words </span><br />
          <div v-if="isLoading" class="q-pt-sm">
            <q-spinner-dots color="white" size="2em" />
          </div>
          <div v-if="!isLoading && users !== null">
            <span class="stat">12202</span>
          </div>
        </div>
      </div>

      <div class="words q-mt-lg">
        <p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eaque quod
          et incidunt maiores animi. Veritatis magnam fuga ducimus laudantium!
          Ad tempora inventore maiores a ullam necessitatibus cupiditate earum
          quis odit!
        </p>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref } from "vue";
import { Notify } from "quasar";
import AfterNavBar from "../components/AfterNavBar.vue";
import {
  getLocation,
  getUsers,
  saveLog,
} from "../shared/services/user.service";

export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Home",

  components: {
    AfterNavBar,
  },

  setup() {
    return {
      location: ref({}),
      isLoading: ref(false),
      users: ref(null),
    };
  },

  methods: {
    async getVisitorIP() {
      getLocation()
        .then((response) => {
          this.location = response;

          const payload = {
            city: this.location?.city,
            country: this.location?.countryName,
            countryCode: this.location?.countryCode,
            ipAddress: this.location?.ipAddress,
          };

          // saveLog(payload)
          //   .then((response) => {
          //     console.log(response);
          //   })
          //   .catch((error) => {
          //     console.log(error);
          //   });
        })
        .catch((error) => {
          console.log(error);
        });
    },

    getAllUsers() {
      this.isLoading = true;
      getUsers()
        .then((response) => {
          this.users = response.data;
          this.isLoading = false;
          console.log(JSON.parse(JSON.stringify(this.users)));
        })
        .catch((error) => {
          console.log(error);
          this.isLoading = false;
          Notify.create({
            type: "negative",
            message: "Error! Something went wrong or no internet connection.",
            group: false,
          });
        });
    },
  },

  mounted() {
    this.getVisitorIP();
    this.getAllUsers();
  },
});
</script>

<style lang="scss" scoped>
.main-page {
  width: 100%;
  max-width: 960px;
  margin: 0 auto;
}
.stats {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.stats-card {
  height: 120px;
  width: 15%;
  max-width: 15%;
  margin: 12px 24px;
  padding: 12px;
  padding-top: 16px;
  border-radius: 8px;
  color: #fff;
  background-color: rgba(12, 69, 176, 0.9);
  box-shadow: 0px 1px 9px -2px rgba(0, 0, 0, 0.25);
}
.stat-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: rgba(255, 255, 255, 0.8);
}
.stat {
  font-size: 2.5rem;
  font-weight: 700;
}

@media only screen and (max-width: 575px) {
  .stats-card {
    height: 110px;
    width: 40%;
    max-width: 40%;
    margin: 12px;
    border-radius: 4px;
  }
  .stat-title {
    font-size: 1.3rem;
  }
}
</style>
