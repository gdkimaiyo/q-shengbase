<template>
  <q-item
    clickable
    v-for="word in words"
    :key="word._id"
    @click="wordDetails(word._id)"
  >
    <q-item-section>
      <q-item-label>
        <h6
          class="q-my-none default-color"
          :class="{ 'is-search-result text-weight-bold': isSearchResult }"
        >
          {{ word.word }}
        </h6>
      </q-item-label>
      <q-item-label
        class="word-meaning"
        v-for="(meaning, index) in word.meaning"
        :key="meaning._id"
      >
        <sup v-if="word.meaning.length > 1" style="color: #000000">
          {{ index + 1 }}
        </sup>
        <span>{{ meaning?.meaning }}</span>
      </q-item-label>
      <br />
      <q-item-label
        class="example-usage"
        v-for="(meaning, index) in word.meaning"
        :key="meaning._id"
      >
        <sup v-if="word.meaning.length > 1" style="color: #000000">
          {{ index + 1 }}
        </sup>
        <em>{{ meaning?.usage }}</em>
      </q-item-label>
      <br />
      <q-item-label class="author">
        <span>By </span>
        <span
          class="default-color text-weight-bold"
          :class="{ 'is-search-result': isSearchResult }"
        >
          {{ word.author }}
        </span>
        <span> On </span>
        <span
          class="default-color"
          :class="{ 'is-search-result text-weight-bold': isSearchResult }"
        >
          {{ addedDate(word.created) }}
        </span>
        <span>. Origin </span>
        <span
          class="default-color"
          :class="{ 'is-search-result text-weight-bold': isSearchResult }"
        >
          {{ word.origin }}
        </span>
      </q-item-label>
      <br />
      <q-item-label>
        <span class="likes">
          <q-btn
            flat
            round
            class="like-btn"
            :class="{ 'like-btn-2': isSearchResult }"
            @click.stop="likeUnlike(word._id, true)"
            :disabled="likePending || unlikePending"
          >
            <q-icon name="fas fa-thumbs-up" />
          </q-btn>
          <span v-if="!likePending">{{ 1233 }}</span>
          <q-spinner-dots
            v-if="likePending && wId === word._id"
            color="primary"
            size="2em"
          />
        </span>
        <span class="dislikes">
          <q-btn
            flat
            round
            class="q-ml-sm dislike-btn"
            @click.stop="likeUnlike(word._id, false)"
            :disabled="likePending || unlikePending"
          >
            <q-icon name="fas fa-thumbs-down flip-horizontal" />
          </q-btn>
          <span v-if="!unlikePending">{{ 122 }}</span>
          <q-spinner-dots
            v-if="unlikePending && wId === word._id"
            color="primary"
            size="2em"
          />
        </span>
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
import { defineComponent, ref } from "vue";
import { Notify } from "quasar";
import { date } from "quasar";

import { likeWord } from "../shared/services/word.service";
import { isVerified } from "../utils/helpers.js";

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
    };
  },

  methods: {
    wordDetails(wordId) {},

    async likeUnlike(wordId, like) {
      if (like) {
        console.log("LIKE", wordId);
      } else {
        console.log("DISLIKE", wordId);
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
        return;
      }

      const user = JSON.parse(localStorage.getItem("sb_user"));

      const payload = {
        like: like ? true : false,
        userId: user._id,
        wordId: wordId,
      };

      console.log(payload);
      // setTimeout(() => {
      //   this.likePending = false;
      //   this.unlikePending = false;
      // }, 3000);
      // return;
      await likeWord(payload)
        .then((res) => {
          console.log(res.data);
          Notify.create({
            type: "positive",
            message: "Success!",
            group: false,
          });
          this.likePending = false;
          this.unlikePending = false;
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

    addedDate(timeStamp) {
      return date.formatDate(new Date(timeStamp), "MMMM DD, YYYY");
    },
  },
});
</script>

<style lang="scss" scoped>
.word-meaning,
.author {
  span {
    color: #000000;
  }
  .default-color {
    color: #0c45b0;
  }
  .is-search-result {
    color: #000000;
  }
}
.example-usage {
  em {
    color: rgba(44, 62, 80, 0.85);
  }
}

.default-color,
.like-btn {
  color: #0c45b0;
}

.is-search-result {
  color: #000000;
}

.like-btn-2 {
  color: green;
}

.dislike-btn {
  color: rgba(0, 0, 0, 0.75);
}
@media only screen and (max-width: 575px) {
  //
}
</style>
