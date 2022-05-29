<template>
  <div class="stats">
    <q-card class="stats-card">
      <q-card-section>
        <div class="row">
          <div class="col text-center">
            <div class="stat-title">Users</div>
            <div class="stat" v-if="!isLoading && users !== null">
              {{ users.length }}
            </div>
            <q-spinner-dots v-if="isLoading" color="white" size="3.5em" />
          </div>
          <div class="col text-center">
            <div class="stat-title">Words</div>
            <div class="stat" v-if="!isLoadingWords && words !== null">
              {{ words.length }}
            </div>
            <q-spinner-dots v-if="isLoadingWords" color="white" size="3.5em" />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import { Notify } from "quasar";
import {
  saveLog,
  getUsers,
  getLocation,
} from "../shared/services/user.service";
import { getWords } from "../shared/services/word.service";

export default defineComponent({
  name: "StatsList",

  setup() {
    return {
      users: ref(null),
      words: ref(null),
      location: ref({}),

      isLoading: ref(false),
      isLoadingWords: ref(false),
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

          saveLog(payload)
            .then((response) => {})
            .catch((error) => {});
        })
        .catch((error) => {});
    },
    getAllUsers() {
      this.isLoading = true;
      getUsers()
        .then((response) => {
          this.users = response.data;
          this.isLoading = false;
        })
        .catch((error) => {
          this.users = [];
          this.isLoading = false;
          Notify.create({
            type: "negative",
            message: "CONNECTION REFUSED.",
            group: false,
            timeout: 5000,
          });
        });
    },

    getAllWords() {
      this.isLoadingWords = true;
      getWords()
        .then((response) => {
          this.words = response.data;
          this.isLoadingWords = false;
        })
        .catch((error) => {
          this.words = [];
          this.isLoadingWords = false;
        });
    },
  },

  mounted() {
    this.getVisitorIP();
    this.getAllUsers();
    this.getAllWords();
  },
});
</script>

<style lang="scss" scoped>
.stats-card {
  width: 100%;
  max-width: 100%;
  margin-top: 30px;
  height: 128px;
  color: #fff;
  background-color: rgba(12, 69, 176, 0.9);
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
  //
}
</style>
