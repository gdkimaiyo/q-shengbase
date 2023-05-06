<template>
  <q-page class="column q-pb-xl">
    <AfterNavBar :imageSrc="src" title="My Profile" :paths="paths" />
    <div class="main-page q-pa-md">
      <!-- <h5 class="q-mt-none">Profile Page</h5> -->
      <div class="loading-state" v-if="isLoading">
        <p>
          <span v-for="index in 4" :key="index">
            <q-spinner-puff color="primary" size="2rem" />
          </span>
        </p>
      </div>
      <div class="profile" v-if="!isLoading && user !== null">
        <q-tabs v-model="tab" no-caps class="text-primary">
          <q-tab name="profile">
            <q-icon name="fas fa-user" size="18px" />
            <span class="tab-label">Profile</span>
          </q-tab>
          <q-tab name="words">
            <q-icon name="fas fa-spell-check" size="18px" />
            <span class="tab-label">My Words</span>
          </q-tab>
          <q-tab name="awards">
            <q-icon name="fas fa-medal" size="18px" />
            <span class="tab-label">My Points</span>
          </q-tab>
        </q-tabs>
        <q-tab-panels
          v-model="tab"
          animated
          swipeable
          horizontal
          transition-prev="jump-up"
          transition-next="jump-up"
        >
          <q-tab-panel name="profile">
            <div v-if="!showUserLog">
              <q-list v-if="!showForm">
                <q-item class="q-mt-md q-mb-sm q-pl-none">
                  <q-item-section avatar>
                    <q-avatar color="primary" text-color="white" size="72px">
                      <span class="user-initials">
                        {{ user.firstname.charAt(0) }}
                        {{ user.lastname.charAt(0) }}
                      </span>
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-h6 text-weight-bold">
                      {{ user.firstname }} {{ user.lastname }}
                    </q-item-label>
                    <q-item-label lines="1">
                      {{ user.email }}
                    </q-item-label>
                    <q-item-label caption lines="1" v-if="user?.cellPhone">
                      {{ user.cellPhone }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label class="q-pt-sm" lines="1">
                      <span style="color: rgba(0, 0, 0, 0.54)">Joined: </span>
                      {{ dateFormatter(user.created) }} at
                      {{ timeFormatter(user.created) }}
                    </q-item-label>
                    <q-item-label class="row justify-between q-pt-lg" lines="1">
                      <div class="col">
                        <a
                          class="text-primary cursor-pointer"
                          @click="showForm = !showForm"
                        >
                          Edit Profile
                        </a>
                      </div>
                      <div class="col">
                        <a
                          class="text-primary cursor-pointer q-pr-md"
                          @click="showUserLog = !showUserLog"
                        >
                          Activity Log
                          <q-tooltip
                            class="gt-xs bg-primary"
                            transition-show="scale"
                            transition-hide="scale"
                            :offset="[10, 10]"
                          >
                            View my activity log
                          </q-tooltip>
                        </a>
                      </div>
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
              <div v-if="showForm">
                <div class="q-pt-sm">
                  <a
                    class="text-primary cursor-pointer"
                    style="padding-left: 4px"
                    @click="showForm = false"
                  >
                    <q-icon name="fas fa-arrow-left-long" size="22px" />
                  </a>
                </div>
                <div class="text-subtitle1 q-pt-md q-pb-sm text-weight-bold">
                  Update your profile
                </div>
                <UpdateProfileForm
                  :details="user"
                  @profileUpdated="onProfileUpdated"
                />
              </div>
            </div>
            <div v-if="showUserLog">
              <div class="q-pt-sm">
                <a
                  class="text-primary cursor-pointer"
                  style="padding-left: 4px"
                  @click="showUserLog = false"
                >
                  <q-icon name="fas fa-arrow-left-long" size="22px" />
                </a>
              </div>
              <div class="text-subtitle1 q-pt-md q-pb-sm text-weight-bold">
                Activity logs
              </div>
              <div>
                <q-input
                  dense
                  v-model="searchItem"
                  placeholder="e.g: Updated my profile"
                  class="q-mb-md"
                  @keyup="startSearch"
                  label="Search for an activity log"
                >
                  <template v-slot:prepend>
                    <q-btn
                      round
                      dense
                      flat
                      icon="search"
                      @click="startSearch"
                    />
                  </template>
                  <template v-slot:append>
                    <q-btn
                      v-if="searchItem !== ''"
                      round
                      dense
                      flat
                      icon="close"
                      @click="clearSearch"
                    />
                  </template>
                </q-input>
              </div>
              <q-list
                class="history-list"
                v-if="!loadingUserLogs && uLogs.length > 0"
              >
                <div v-for="(activity, idx) in userLogs" :key="idx">
                  <q-item class="q-my-sm" clickable v-ripple>
                    <q-item-section>
                      <q-item-label>{{ activity.action }}</q-item-label>
                      <q-item-label caption lines="2">
                        {{ dateFormatter(activity.created) }} at
                        {{ timeFormatter(activity.created) }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-separator
                    style="margin-right: 0; margin-left: 0"
                    inset
                    v-if="idx !== userLogs.length - 1"
                  />
                </div>
              </q-list>
              <q-pagination
                v-if="uLogs?.length > logsPerPage && beginSearch === false"
                class="q-mt-lg q-mb-md q-ml-sm"
                v-model="logPage"
                :max="userLogsPages"
                direction-links
                @update:model-value="changePage(uLogs?.length)"
              />
              <q-list
                class="history-list"
                v-if="!loadingUserLogs && uLogs.length === 0"
              >
                <q-item class="q-my-sm" clickable v-ripple>
                  <q-item-section>
                    <q-item-label> Activity log unavailable! </q-item-label>
                    <q-item-label caption lines="2">
                      Your activity log is yet to be recorded.
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>

              <q-list class="history-list" v-if="loadingUserLogs">
                <q-item class="q-my-sm" clickable v-ripple>
                  <q-item-section>
                    <q-item-label>
                      <span v-for="index in 3" :key="index">
                        <q-spinner-puff color="primary" size="1.5rem" />
                      </span>
                      Loading my activity logs...
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </q-tab-panel>

          <q-tab-panel name="words">
            <q-card class="trending-words">
              <q-card-section class="q-mt-md">
                <q-list v-if="!loadingWords && uWords?.length > 0">
                  <div v-for="(word, index) in userWords" :key="word._id">
                    <q-item>
                      <q-item-section>
                        <q-item-label class="word text-primary">
                          {{ word.word }}
                        </q-item-label>
                        <q-item-label lines="2" class="meaning">
                          {{ word.rMeaning }}
                        </q-item-label>
                        <q-item-label caption lines="1">
                          Added On
                          <span class="text-weight-bold">
                            {{ dateFormatter(word.created) }}
                          </span>
                        </q-item-label>
                      </q-item-section>

                      <q-item-section side top>
                        <q-item-label caption>
                          <q-icon name="fas fa-thumbs-up" color="positive" />
                          {{ word.likes.likes.length }}
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-separator
                      spaced
                      inset
                      v-if="index !== userWords.length - 1"
                    />
                  </div>
                  <q-pagination
                    v-if="uWords?.length > perPage"
                    class="q-mt-lg q-mb-md q-ml-sm"
                    v-model="page"
                    :max="totalPages"
                    direction-links
                    @update:model-value="changePage"
                  />
                </q-list>
                <div v-if="!loadingWords && uWords?.length === 0">
                  You have not added any sheng words yet!
                </div>
                <div v-if="loadingWords" class="q-mt-md">
                  <p>
                    <span v-for="index in 3" :key="index">
                      <q-spinner-puff color="primary" size="1.5rem" />
                    </span>
                    Loading my words
                  </p>
                </div>
              </q-card-section>
            </q-card>
          </q-tab-panel>

          <q-tab-panel name="awards">
            <div class="row justify-center text-positive q-mt-md">
              <q-icon name="fas fa-medal" color="positive" size="28px" />
              <div class="text-h6 q-pl-md text-weight-bold">
                {{ points }}
              </div>
            </div>
            <div class="row justify-center q-mt-lg">
              <a
                class="text-primary cursor-pointer q-pr-md"
                :class="{ 'active-link': viewPointsTallying === true }"
                @click="(viewPointsTallying = true), (showInfo = false)"
              >
                History
                <q-tooltip
                  class="gt-xs bg-primary"
                  transition-show="scale"
                  transition-hide="scale"
                  :offset="[10, 10]"
                >
                  History of points tallying
                </q-tooltip>
              </a>
              <a
                class="text-primary cursor-pointer q-pr-md"
                @click="redeemPoints"
              >
                Redeem
              </a>
              <a
                class="text-primary cursor-pointer q-pr-md"
                :class="{ 'active-link': showInfo === true }"
                @click="(showInfo = true), (viewPointsTallying = false)"
              >
                <q-icon name="fas fa-circle-question" class="q-pr-sm" />
                <span>How to?</span>
              </a>
            </div>
            <q-separator inset class="sep-inset q-mt-sm" />
            <div class="row q-mt-md" v-if="viewPointsTallying">
              <q-list
                class="history-list"
                v-if="!loadingWords && pointsHistory.length > 0"
              >
                <q-item
                  v-for="(history, idx) in pointsHistory"
                  :key="idx"
                  class="q-my-sm"
                  clickable
                  v-ripple
                >
                  <q-item-section>
                    <q-item-label>{{ history.origin }}</q-item-label>
                    <q-item-label caption lines="2">
                      {{ history.info }}
                    </q-item-label>
                  </q-item-section>

                  <q-item-section side>
                    <q-item-label>
                      <span
                        style="color: rgba(0, 0, 0, 0.64)"
                        class="text-positive"
                      >
                        +
                      </span>
                      <b class="text-positive">{{ history.points }}</b>
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
              <q-list
                class="history-list"
                v-if="!loadingWords && pointsHistory.length === 0"
              >
                <q-item class="q-my-sm" clickable v-ripple>
                  <q-item-section>
                    <q-item-label>
                      Points tallying history unavailable!
                    </q-item-label>
                    <q-item-label caption lines="2">
                      Start by adding sheng words to earn points.
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
              <q-list class="history-list" v-if="loadingWords">
                <q-item class="q-my-sm" clickable v-ripple>
                  <q-item-section>
                    <q-item-label>
                      <span v-for="index in 3" :key="index">
                        <q-spinner-puff color="primary" size="1.5rem" />
                      </span>
                      Loading points tallying history
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
            <div class="row q-mt-md" v-if="showInfo">
              <p style="color: rgba(0, 0, 0, 0.64)" class="text-weight-bold">
                How do I get points?
              </p>
              <p class="p-info">
                Every 5 words you add earns you 1 point. Also, every 5 likes of
                all cumulative likes from the words you add, earns you 1 point.
              </p>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref } from "vue";
import { date, Notify } from "quasar";
import AfterNavBar from "../components/AfterNavBar.vue";
import UpdateProfileForm from "../components/UpdateProfileForm.vue";
import { getUser, getUserLogs } from "../shared/services/user.service";
import { getWords } from "../shared/services/word.service";

import { isVerified, fetchNextPage, randomNumber } from "../utils/helpers.js";

export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Profile",

  components: {
    AfterNavBar,
    UpdateProfileForm,
  },

  setup() {
    return {
      src: ref("bg.jpg"),
      paths: ref(["Home", "Profile"]),
      isLoading: ref(false),
      loadingWords: ref(false),
      loadingUserLogs: ref(false),
      user: ref(null),
      userWords: ref(null),
      uWords: ref(null),
      userLogs: ref(null),
      uLogs: ref(null),
      isVerified: ref(false),
      tab: ref("profile"),

      page: ref(1),
      perPage: ref(10),
      totalPages: ref(1),
      logPage: ref(1),
      logsPerPage: ref(10),
      userLogsPages: ref(1),

      showInfo: ref(false),
      showForm: ref(false), // Show update profile form
      showUserLog: ref(false),
      viewPointsTallying: ref(true),

      points: ref(0),
      pointsHistory: ref([]),

      searchItem: ref(""),
      beginSearch: ref(false),
    };
  },

  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    },
  },
  created() {
    if (!this.loggedIn) {
      this.$router.push("/login");
    }
  },

  methods: {
    async getAUser() {
      this.isLoading = true;

      this.isVerified = await isVerified();

      const user = JSON.parse(localStorage.getItem("sb_user"));
      if (user === null || this.isVerified === false) {
        Notify.create({
          type: "info",
          message: "Unable to load profile, please sign in.",
          color: "primary",
          group: false,
        });
        this.$router.push("/login");
        return;
      }
      await getUser(user._id)
        .then((response) => {
          this.user = response.data;
          this.isLoading = false;
          this.getUserWords(user._id);
          this.getUserLogs(user._id);
        })
        .catch((error) => {
          if (error?.response?.status === 404) {
            this.$store.dispatch("auth/logout");
            Notify.create({
              type: "negative",
              message: "Unable to load profile, please sign in.",
              group: false,
            });
            this.$router.push("/login");
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

    getUserWords(userId) {
      this.loadingWords = true;
      getWords()
        .then((response) => {
          this.uWords = response.data?.filter(
            (word) => word?.author?._id === userId
          );

          // Record points history
          if (this.uWords?.length > 0) {
            this.pointsHistory.push({
              origin: `Points from ${this.uWords.length} words added.`,
              count: this.uWords.length,
              info: "Every 5 words added earns 1 point.",
              points: Math.floor(this.uWords?.length / 5),
            });
          }

          // Sort by total word likes
          this.uWords = this.uWords?.sort((a, b) => {
            return b?.likes?.likes?.length - a?.likes?.likes?.length;
          });

          this.points += Math.floor(this.uWords?.length / 5);
          let totalLikes = 0;

          // Randomly pick the word meaning
          this.uWords?.forEach((element) => {
            // Random number/index of word meaning.
            totalLikes += element?.likes?.likes?.length;
            const rn = randomNumber(0, element?.meaning?.length - 1);
            element.rMeaning =
              element?.meaning[rn]?.meaning?.length > 0
                ? element.meaning[rn].meaning
                : element?.meaning[0].meaning;
          });
          this.points += Math.floor(totalLikes / 5);

          // Record points history
          if (totalLikes > 0) {
            this.pointsHistory.push({
              origin: `Points from ${totalLikes} word likes.`,
              count: totalLikes,
              info: "Every 5 likes from all cumulative word likes, earns 1 point.",
              points: Math.floor(totalLikes / 5),
            });
          }

          this.userWords = fetchNextPage(this.uWords, this.page, this.perPage);
          this.totalPages = ref(Math.ceil(this.uWords.length / this.perPage));

          this.loadingWords = false;
        })
        .catch((error) => {
          this.uWords = [];
          this.loadingWords = false;
        });
    },

    getUserLogs(userId) {
      this.loadingUserLogs = true;
      getUserLogs()
        .then((response) => {
          this.uLogs = response.data?.filter((log) => log?.userId === userId);
          // Sort by date created
          this.uLogs = this.uLogs?.sort((a, b) => {
            return new Date(b.created) - new Date(a.created);
          });

          this.userLogs = fetchNextPage(
            this.uLogs,
            this.logPage,
            this.logsPerPage
          );
          this.userLogsPages = ref(
            Math.ceil(this.uLogs.length / this.logsPerPage)
          );
          this.loadingUserLogs = false;
        })
        .catch((error) => {
          this.uLogs = [];
          this.loadingUserLogs = false;
        });
    },

    clearSearch() {
      this.searchItem = "";
      this.beginSearch = false;
      this.userLogs = fetchNextPage(this.uLogs, this.logPage, this.logsPerPage);
    },

    startSearch() {
      if (this.searchItem !== "") {
        this.beginSearch = true;
        this.userLogs = this.uLogs?.filter((x) => {
          const action = x?.action?.toLocaleLowerCase();
          return action?.includes(this.searchItem?.toLocaleLowerCase());
        });
      } else {
        this.beginSearch = false;
        this.userLogs = fetchNextPage(
          this.uLogs,
          this.logPage,
          this.logsPerPage
        );
      }
    },

    changePage(length) {
      if (length && this.uLogs?.length === length) {
        this.userLogs = fetchNextPage(
          this.uLogs,
          this.logPage,
          this.logsPerPage
        );
      } else {
        this.userWords = fetchNextPage(this.uWords, this.page, this.perPage);
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    },

    dateFormatter(timeStamp) {
      return date.formatDate(new Date(timeStamp), "MMMM DD, YYYY");
    },

    timeFormatter(timeStamp) {
      return date.formatDate(new Date(timeStamp), "HH:mm");
    },

    onProfileUpdated() {
      this.showForm = false;
      this.getAUser();
    },

    activityLog() {
      Notify.create({
        type: "info",
        message: "My activity log coming soon...",
        color: "primary",
        group: false,
      });
    },

    redeemPoints() {
      Notify.create({
        type: "info",
        message: "Redeeming of points coming soon...",
        color: "primary",
        group: false,
      });
      this.showInfo = false;
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
  max-width: 575px;
  margin: 0 auto;
}

.loading-state {
  text-align: center;
}

.user-initials {
  font-weight: 500;
}

.tab-label {
  padding-top: 6px;
}

.active-link {
  color: #21ba45 !important;
}

.history-list {
  width: 100%;
  // .q-item {
  //   margin-right: 0;
  //   margin-left: 0;
  // }
}

.p-info {
  font-size: 15px;
}
@media only screen and (max-width: 575px) {
  .tab-label {
    padding-top: 3px;
  }
  .sep-inset {
    margin-right: 0;
    margin-left: 0;
  }
}
</style>
