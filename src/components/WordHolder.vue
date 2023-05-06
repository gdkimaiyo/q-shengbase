<template>
  <q-item v-for="word in sWords" :key="word._id" @click="wordDetails(word._id)">
    <q-item-section>
      <q-item-label>
        <div
          class="word text-dark text-weight-bold q-mt-md q-mb-sm default-color"
          :class="{ 'is-search-result': isSearchResult }"
        >
          {{ word.word }}
          <span
            class="text-positive"
            style="font-size: 15px"
            v-if="word?.variations?.length > 0"
          >
            ({{ word.variations }})
          </span>
        </div>
      </q-item-label>
      <q-item-label
        class="word-meaning"
        v-for="(meaning, index) in word.meaning"
        :key="meaning._id"
        :class="{ 'q-mb-lg': index === word.meaning?.length - 1 }"
      >
        <sup
          v-if="word.meaning.length > 1 && meaning?.meaning?.length > 0"
          style="color: #000000"
        >
          {{ index + 1 }}
        </sup>
        <span v-if="meaning?.meaning?.length > 0">{{ meaning?.meaning }}</span>
      </q-item-label>
      <q-item-label
        class="example-usage"
        v-for="(meaning, index) in word.meaning"
        :key="meaning._id"
        :class="{ 'q-mb-lg': index === word.meaning?.length - 1 }"
      >
        <sup
          v-if="word.meaning.length > 1 && meaning?.usage?.length > 0"
          style="color: #000000"
        >
          {{ index + 1 }}
        </sup>
        <em v-if="meaning?.usage?.length > 0">{{ meaning?.usage }}</em>
      </q-item-label>
      <q-item-label caption style="font-size: 0.85rem" class="q-mb-lg">
        <span>By </span>
        <span
          class="text-weight-bold"
          :class="{ 'is-search-result': isSearchResult }"
        >
          {{ word.author.firstname }} {{ word.author.lastname }}
        </span>
        <span> On </span>
        <span
          class="text-weight-bold"
          :class="{ 'is-search-result text-weight-bold': isSearchResult }"
        >
          {{ addedDate(word.created) }}
        </span>
        <span>. Origin </span>
        <span
          class="text-weight-bold"
          :class="{ 'is-search-result text-weight-bold': isSearchResult }"
        >
          {{ word.origin }}
        </span>
      </q-item-label>
      <q-item-label>
        <span class="likes">
          <q-btn
            flat
            round
            class="like-btn"
            :class="{
              'dislike-btn': isSearchResult,
              'dislike-btn-2': isSearchResult && word?.liked,
              'dislike-btn-3': isSearchResult && liked && wId === word._id,
              'like-btn-2': word?.liked,
              'like-btn-3': liked && wId === word._id,
            }"
            @click.stop="likeUnlike(word._id, true, word?.liked)"
            :disabled="likePending || unlikePending"
          >
            <q-icon name="fas fa-thumbs-up" />
          </q-btn>
          <span v-if="likePending && wId === word._id">
            <q-spinner-dots color="primary" size="2em" />
          </span>
          <span v-else>
            <span
              v-if="word?.likes?.likes?.length > 0"
              :class="{
                'dislike-btn': isSearchResult,
                'dislike-btn-2': isSearchResult && word?.liked,
                'dislike-btn-3': isSearchResult && liked && wId === word._id,
                'liked-text': word?.liked,
                'liked-text-1': liked && wId === word._id,
              }"
            >
              {{ word?.likes?.likes?.length }}
            </span>
          </span>
        </span>
        <span class="dislikes">
          <q-btn
            flat
            round
            class="q-ml-sm dislike-btn"
            :class="{
              'dislike-btn': isSearchResult,
              'dislike-btn-2': word?.disliked,
              'dislike-btn-3': disliked && wId === word._id,
            }"
            @click.stop="likeUnlike(word._id, false, word?.disliked)"
            :disabled="likePending || unlikePending"
          >
            <q-icon name="fas fa-thumbs-down flip-horizontal" />
          </q-btn>
          <span v-if="unlikePending && wId === word._id">
            <q-spinner-dots color="grey-9" size="2em" />
          </span>
          <span v-else>
            <span
              v-if="word?.likes?.dislikes?.length > 0"
              :class="{
                'dislike-btn': isSearchResult,
                'dislike-btn-2': word?.disliked,
                'dislike-btn-3': disliked && wId === word._id,
              }"
            >
              {{ word?.likes?.dislikes?.length }}
            </span>
          </span>
        </span>
      </q-item-label>
    </q-item-section>
  </q-item>
  <q-separator spaced v-if="words?.length > perPage" />
  <q-pagination
    v-if="words?.length > perPage"
    class="q-mt-lg q-mb-md q-ml-sm"
    v-model="page"
    :max="totalPages"
    direction-links
    @update:model-value="changePage"
  />
</template>

<script>
import { defineComponent, ref } from "vue";
import { Notify } from "quasar";
import { date } from "quasar";

import { likeWord } from "../shared/services/word.service";
import {
  isVerified,
  fetchNextPage,
  saveActivityLogs,
} from "../utils/helpers.js";

export default defineComponent({
  name: "WordHolder",

  props: {
    words: Array,

    isSearchResult: {
      type: Boolean,
      default: false,
    },
  },

  setup() {
    return {
      wId: ref(null), // Liked or unliked word id
      isVerified: ref(false),
      likePending: ref(false),
      unlikePending: ref(false),
      liked: ref(false),
      disliked: ref(false),
      page: ref(1),
      perPage: ref(20),
      totalPages: ref(1),
      sWords: ref(null),
    };
  },

  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    },
  },

  created() {
    if (this.loggedIn) {
      this.isVerified = false;
    }
    this.sWords = fetchNextPage(this.words, this.page, this.perPage);
    this.totalPages = ref(Math.ceil(this.words.length / this.perPage));
  },

  methods: {
    wordDetails(wordId) {},

    async likeUnlike(wordId, like, likeStatus) {
      if (likeStatus === true) {
        // If user already liked or disliked word, abort
        return;
      }

      this.wId = wordId;
      this.likePending = like ? true : false;
      this.unlikePending = like ? false : true;

      let i_txt = like ? "like" : "unlike";

      this.isVerified = await isVerified();
      if (this.isVerified === false) {
        Notify.create({
          type: "info",
          message: `Please sign in to be able to ${i_txt} a word.`,
          color: "primary",
          group: false,
          actions: [
            {
              label: "Sign In",
              color: "yellow",
              handler: () => {
                this.$router.push("/login");
              },
            },
            {
              label: "Dismiss",
              color: "white",
              handler: () => {},
            },
          ],
        });

        this.likePending = false;
        this.unlikePending = false;
        return;
      }

      const user = JSON.parse(localStorage.getItem("sb_user"));

      const payload = {
        like: like ? true : false,
        userId: user._id,
        wordId: wordId,
      };
      await likeWord(payload)
        .then((res) => {
          this.likePending = false;
          this.unlikePending = false;
          this.liked = like ? true : false;
          this.disliked = like ? false : true;
          let likedWord;
          this.sWords.forEach((word) => {
            if (word._id === wordId) {
              likedWord = word.word;
              if (like === true) {
                word.liked = true;
                word.disliked = false;
                word.likes.likes.push(user._id);
                word.likes.dislikes = word.likes.dislikes?.filter(
                  (id) => id !== user._id
                );
              } else {
                word.disliked = true;
                word.liked = false;
                word.likes.dislikes.push(user._id);
                word.likes.likes = word.likes.likes?.filter(
                  (id) => id !== user._id
                );
              }
            }
          });

          // Save user activity log
          const userAction = {
            userId: payload.userId,
            action: `${
              like === true ? "Liked" : "Unliked"
            } sheng word: ${likedWord}`,
          };
          saveActivityLogs(userAction);
        })
        .catch((error) => {
          Notify.create({
            type: "negative",
            message: "Something went wrong while updating likes.",
            group: false,
          });
          this.likePending = false;
          this.unlikePending = false;
        });
    },

    changePage() {
      this.sWords = fetchNextPage(this.words, this.page, this.perPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },

    // HELPER Functions
    addedDate(timeStamp) {
      return date.formatDate(new Date(timeStamp), "MMMM DD, YYYY");
    },
  },
});
</script>

<style lang="scss" scoped>
.example-usage {
  em {
    color: rgba(44, 62, 80, 0.85);
  }
}

.word {
  font-size: 18px;
}
.q-item {
  padding: 8px 4px;
}

.default-color,
.like-btn {
  color: #1d1d1d;
}

.is-search-result {
  color: #000000;
}

.like-btn-2,
.like-btn-3 {
  color: green;
}
.liked-text,
.liked-text-1 {
  color: #56b353;
  font-weight: bold;
}

.dislike-btn {
  color: rgba(0, 0, 0, 0.6);
}
.dislike-btn-2,
.dislike-btn-3 {
  color: rgba(0, 0, 0);
  font-weight: bold;
}
@media only screen and (max-width: 575px) {
  //
}
</style>
