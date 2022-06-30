<template>
  <div class="trends">
    <q-card class="trending-words">
      <q-card-section class="card-header"> Most Liked </q-card-section>

      <q-card-section class="q-pt-none q-mt-md">
        <q-list v-if="!isLoading && mostLikes?.length > 0">
          <div v-for="(word, index) in mostLikes" :key="word._id">
            <q-item>
              <q-item-section>
                <q-item-label class="word text-primary">
                  {{ word.word }}
                </q-item-label>
                <q-item-label caption lines="2" class="meaning">
                  {{ word.rMeaning }}
                </q-item-label>
              </q-item-section>

              <q-item-section side top>
                <q-item-label caption>
                  <q-icon name="fas fa-thumbs-up" color="positive" />
                  {{ word.likes.likes.length }}
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-separator spaced inset v-if="index !== mostLikes.length - 1" />
          </div>
        </q-list>
        <div v-if="isLoading">
          <q-spinner-dots color="primary" size="2.5em" />
          <span class="q-pl-sm" style="color: rgba(0, 0, 0, 0.65)">
            Loading list
          </span>
        </div>
        <div v-if="!isLoading && mostLikes?.length === 0">
          <p style="color: rgba(0, 0, 0, 0.65)">List unavailable</p>
        </div>
      </q-card-section>
    </q-card>

    <q-card class="top-users">
      <q-card-section class="card-header"> Top Users </q-card-section>

      <q-card-section class="q-pt-none q-mt-md">
        <q-list v-if="!isLoading && topUsers?.length > 0">
          <div v-for="(user, index) in topUsers" :key="user._id">
            <q-item>
              <q-item-section top avatar>
                <q-avatar
                  color="primary"
                  text-color="white"
                  icon="fas fa-user"
                />
              </q-item-section>

              <q-item-section>
                <q-item-label>{{ user.author }}</q-item-label>
              </q-item-section>

              <q-item-section side top>
                <q-item-label caption>
                  <q-icon :name="user.badge" color="positive" />
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-separator
              spaced
              inset="item"
              v-if="index !== topUsers.length - 1"
            />
          </div>
        </q-list>
        <div v-if="isLoading">
          <q-spinner-dots color="primary" size="2.5em" />
          <span class="q-pl-sm" style="color: rgba(0, 0, 0, 0.65)">
            Loading top users
          </span>
        </div>
        <div v-if="!isLoading && topUsers?.length === 0">
          <p style="color: rgba(0, 0, 0, 0.65)">List unavailable</p>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
// import { Notify } from "quasar";
import { getWords } from "../shared/services/word.service";

export default defineComponent({
  name: "TrendsList",

  setup() {
    return {
      allWords: ref(null),
      mostLikes: ref(null),
      topUsers: ref(null),
      isLoading: ref(false),
    };
  },

  methods: {
    getAllWords() {
      this.isLoading = true;
      getWords()
        .then((response) => {
          // Sort by total word likes
          this.allWords = response.data?.sort((a, b) => {
            return b?.likes?.likes?.length - a?.likes?.likes?.length;
          });
          // Get only the top 5 words
          this.mostLikes = this.allWords?.slice(0, 5);
          // Randomly pick the word meaning
          this.mostLikes?.forEach((element) => {
            // Random number/index of word meaning.
            const rn = this.randomNumber(0, element?.meaning?.length - 1);
            element.rMeaning =
              element?.meaning[rn]?.meaning?.length > 0
                ? element.meaning[rn].meaning
                : element?.meaning[0].meaning;
          });
          // Get only the words with likes
          this.mostLikes = this.mostLikes?.filter(
            (word) => word?.likes?.likes?.length > 0
          );

          this.topUsers = [];
          this.allWords.forEach((wrd) => {
            this.topUsers.push({
              author: wrd.author,
              authorId: wrd.authorId,
            });
          });
          // Remove duplicates
          this.topUsers = [
            ...new Map(
              this.topUsers.map((item) => [item["authorId"], item])
            ).values(),
          ];
          // Get only the top 5 users
          this.topUsers = this.topUsers?.slice(0, 5);
          // Assign fontawesome badge icon
          let i = 1;
          this.topUsers.forEach((element) => {
            element.badge = `fas fa-${i}`;
            i++;
          });
          this.isLoading = false;
        })
        .catch((error) => {
          this.isLoading = false;
          this.allWords = [];
          this.mostLikes = [];
          this.topUsers = [];
        });
    },

    // HELPER FUNCTIONS
    randomNumber(min, max) {
      // min and max included
      return Math.floor(Math.random() * (max - min + 1) + min);
    },
  },

  mounted() {
    this.getAllWords();
  },
});
</script>

<style lang="scss" scoped>
.trending-words,
.top-users {
  width: 100%;
  max-width: 100%;
  margin-top: 24px;
}

.card-header {
  font-size: 1.35rem;
  font-weight: bold;
  color: rgba(255, 255, 255, 0.8);
  background-color: rgba(12, 69, 176, 0.9);
}

.word {
  font-size: 17px;
}
.meaning {
  font-size: 14px;
}

@media only screen and (max-width: 575px) {
  //
}
</style>
