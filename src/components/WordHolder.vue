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
            @click.stop="like(word._id)"
          >
            <q-icon name="fas fa-thumbs-up" />
          </q-btn>
          <span>{{ 1233 }}</span>
        </span>
        <span class="dislikes">
          <q-btn
            flat
            round
            class="q-ml-sm dislike-btn"
            @click.stop="dislike(word._id)"
          >
            <q-icon name="fas fa-thumbs-down flip-horizontal" />
          </q-btn>
          <span>{{ 122 }}</span>
        </span>
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
import { defineComponent } from "vue";
import { date } from "quasar";

export default defineComponent({
  name: "WordHolder",

  props: {
    words: Array,

    isSearchResult: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    wordDetails(wordId) {},

    like(wordId) {
      console.log("LIKE", wordId);

      const payload = {
        like: true,
      };
    },

    dislike(wordId) {
      console.log("DISLIKE", wordId);
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
