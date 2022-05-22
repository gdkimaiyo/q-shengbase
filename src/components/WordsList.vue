<template>
  <div class="words q-mr-md q-pa-md">
    <div class="row q-mb-sm q-ml-sm">
      <div class="col text-right">
        <q-btn flat round color="primary">
          <q-icon name="fas fa-magnifying-glass" />
        </q-btn>
        <q-btn
          no-caps
          unelevated
          color="primary"
          class="gt-sm q-ml-md"
          @click="openFormDialog"
        >
          <q-icon name="fas fa-plus" />
          <span class="q-pl-sm">Add Word</span>
        </q-btn>

        <q-btn
          round
          color="primary"
          class="lt-md q-ml-md"
          @click="openFormDialog"
        >
          <q-icon name="fas fa-plus" />
        </q-btn>
      </div>

      <div class="q-pa-md q-gutter-sm">
        <q-dialog v-model="isOpen" persistent>
          <AddWordForm @wordAdded="onAddWord" />
        </q-dialog>
      </div>
    </div>
    <q-list bordered separator v-if="!isLoading && words?.length > 0">
      <q-item
        clickable
        v-for="word in words"
        :key="word._id"
        @click="wordDetails(word._id)"
      >
        <q-item-section>
          <q-item-label>
            <h6 class="q-my-none text-primary">{{ word.word }}</h6>
          </q-item-label>
          <q-item-label
            class="word-meaning"
            v-for="(meaning, index) in word.meaning"
            :key="meaning._id"
          >
            <sup v-if="word.meaning.length > 1" class="text-primary">
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
            <sup v-if="word.meaning.length > 1" class="text-primary">
              {{ index + 1 }}
            </sup>
            <em>{{ meaning?.usage }}</em>
          </q-item-label>
          <br />
          <q-item-label class="author">
            <span>By </span>
            <span class="text-primary text-weight-bold">
              {{ word.author }}
            </span>
            <span> On </span>
            <span class="text-primary">
              {{ addedDate(word.created) }}
            </span>
            <span>. Origin </span>
            <span class="text-primary">
              {{ word.origin }}
            </span>
          </q-item-label>
          <br />
          <q-item-label>
            <span class="likes">
              <q-btn flat round color="primary" @click.stop="like(word._id)">
                <q-icon name="fas fa-thumbs-up" />
              </q-btn>
              <span>{{ 1233 }}</span>
            </span>
            <span class="dislikes">
              <q-btn
                flat
                round
                color="negative"
                class="q-ml-sm"
                @click.stop="dislike(word._id)"
              >
                <q-icon name="fas fa-thumbs-down flip-horizontal" />
              </q-btn>
              <span class="text-negative">{{ 122 }}</span>
            </span>
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>

    <q-list bordered separator v-if="isLoading">
      <q-item clickable v-ripple>
        <q-item-section class="q-my-xl">
          <q-item-label class="text-center">
            <q-spinner color="primary" size="1.5em" />
            <span class="text-primary"> Loading sheng words ... </span>
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>

    <q-list bordered separator v-if="!isLoading && words?.length === 0">
      <q-item clickable v-ripple>
        <q-item-section class="q-my-xl">
          <div class="text-center">
            <q-icon name="fas fa-bars" size="100px" color="secondary" />
          </div>
          <q-item-label class="text-center text-primary q-mt-xl">
            No sheng words available
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import { date, Notify } from "quasar";
import AddWordForm from "./AddWordForm.vue";

import { isVerified } from "../utils/helpers.js";
import { getWords } from "../shared/services/word.service";

export default defineComponent({
  name: "WordsList",

  components: { AddWordForm },

  setup() {
    return {
      isOpen: ref(false),
      isVerified: ref(false),
      isLoading: ref(false),
      words: ref(null),
    };
  },

  methods: {
    async openFormDialog() {
      this.isVerified = await isVerified();
      if (this.isVerified === false) {
        Notify.create({
          type: "info",
          message: "Please sign in to be able to add a word.",
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
      this.isOpen = true;
    },

    onAddWord() {
      // Close dialog when a word is successfully added
      this.isOpen = false;
    },

    getAllWords() {
      this.isLoading = true;
      getWords()
        .then((response) => {
          this.words = response.data;
          // console.log(JSON.parse(JSON.stringify(this.words)));
          this.isLoading = false;
        })
        .catch((error) => {
          this.isLoading = false;
          this.words = [];
          Notify.create({
            type: "info",
            color: "primary",
            message: "Unable to loads wheng words.",
            group: false,
            timeout: 5000,
          });
        });
    },

    wordDetails(wordId) {},

    like(wordId) {
      console.log("LIKE");
    },

    dislike(wordId) {
      console.log("DISLIKE");
    },

    addedDate(timeStamp) {
      return date.formatDate(new Date(timeStamp), "MMMM DD, YYYY");
    },
  },

  mounted() {
    this.getAllWords();
  },
});
</script>

<style lang="scss" scoped>
.word-meaning,
.author {
  span {
    color: #000000;
  }
}
.example-usage {
  em {
    color: rgba(44, 62, 80, 0.85);
  }
}

@media only screen and (max-width: 575px) {
  .words {
    margin-right: 0;
    padding: 0;
  }
}
</style>
