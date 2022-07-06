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
        <q-tabs v-model="tab" no-caps inline-label class="text-primary">
          <q-tab name="profile" icon="fas fa-user">
            <span class="gt-xs q-pl-sm">My Profile</span>
          </q-tab>
          <q-tab name="words" icon="fas fa-spell-check">
            <span class="gt-xs q-pl-sm">My Words</span>
          </q-tab>
          <q-tab name="awards" icon="fas fa-medal">
            <span class="gt-xs q-pl-sm">My Points</span>
          </q-tab>
        </q-tabs>
        <q-tab-panels
          v-model="tab"
          animated
          swipeable
          vertical
          transition-prev="jump-up"
          transition-next="jump-up"
        >
          <q-tab-panel name="profile">
            <q-list>
              <q-item class="q-my-md q-pl-none">
                <q-item-section avatar>
                  <q-avatar color="primary" text-color="white" size="72px">
                    <span class="user-initials">
                      {{ user.firstname.charAt(0)
                      }}{{ user.lastname.charAt(0) }}
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
                  <q-item-label caption lines="1" v-if="user?.mobile">
                    {{ user.mobile }}
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label class="q-pt-md" lines="1">
                    <span style="color: rgba(0, 0, 0, 0.54)">Joined: </span>
                    {{ dateFormatter(user.created) }} at
                    {{ registerTime(user.created) }}
                  </q-item-label>
                  <q-item-label class="q-pt-sm" lines="1">
                    <a
                      class="text-primary cursor-pointer"
                      @click="updateProfile"
                    >
                      Edit profile
                    </a>
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-tab-panel>

          <q-tab-panel name="words">
            <q-card class="trending-words">
              <q-card-section class="q-mt-md">
                <q-list v-if="uWords?.length > 0">
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
                <div v-if="uWords?.length === 0">
                  You have not added any sheng words yet!
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
            <div class="row justify-center q-mt-md">
              <q-btn no-caps flat class="text-primary" @click="viewHistory">
                History
                <q-tooltip
                  class="gt-xs bg-primary"
                  transition-show="scale"
                  transition-hide="scale"
                  :offset="[10, 10]"
                >
                  View points tallying history
                </q-tooltip>
              </q-btn>
              <q-btn no-caps flat class="text-primary" @click="redeemPoints">
                Redeem
              </q-btn>
              <q-btn
                no-caps
                flat
                class="text-primary"
                @click="showInfo = !showInfo"
              >
                <q-icon name="fas fa-circle-question" class="q-pr-sm" />
                <span v-if="showInfo">Hide Info</span>
                <span v-else>Show Info</span>
              </q-btn>
            </div>
            <q-separator inset />
            <div class="row justify-center text-center q-mt-md" v-if="showInfo">
              <p style="color: rgba(0, 0, 0, 0.64)" class="text-weight-bold">
                How do I get points?
              </p>
              <p>
                Every 5 words you add earns you 1 point. Also, every 5 likes of
                all cumulative likes from the words you add, earns you 1 point.
              </p>
              <p>
                Lastly, participating in
                <b style="color: rgba(0, 0, 0, 0.55)">ShengBase Trivia</b> and
                answering quizzes correctly earns you points.
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

import { getUser } from "../shared/services/user.service";
import { getWords } from "../shared/services/word.service";

import { isVerified, fetchNextPage, randomNumber } from "../utils/helpers.js";

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
      user: ref(null),
      userWords: ref(null),
      uWords: ref(null),
      isVerified: ref(false),
      tab: ref("profile"),
      page: ref(1),
      perPage: ref(10),
      totalPages: ref(1),
      points: ref(0),
      showInfo: ref(false),
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
          this.getUserWords(user._id);
          this.isLoading = false;
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
      getWords()
        .then((response) => {
          this.uWords = response.data?.filter(
            (word) => word?.authorId === userId
          );

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

          this.userWords = fetchNextPage(this.uWords, this.page, this.perPage);
          this.totalPages = ref(Math.ceil(this.uWords.length / this.perPage));
        })
        .catch((error) => {
          this.uWords = [];
        });
    },

    changePage() {
      this.userWords = fetchNextPage(this.uWords, this.page, this.perPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },

    dateFormatter(timeStamp) {
      return date.formatDate(new Date(timeStamp), "MMMM DD, YYYY");
    },

    registerTime(timeStamp) {
      return date.formatDate(new Date(timeStamp), "HH:mm");
    },

    updateProfile() {
      Notify.create({
        type: "info",
        message: "Edit profile feature coming soon...",
        color: "primary",
        group: false,
      });
    },

    viewHistory() {
      Notify.create({
        type: "info",
        message: "View points history coming soon...",
        color: "primary",
        group: false,
      });
      this.showInfo = false;
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
@media only screen and (max-width: 575px) {
  //
}
</style>
