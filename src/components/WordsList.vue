<template>
  <div class="words q-mr-md q-pa-md">
    <div class="row q-mb-sm q-ml-sm">
      <div class="col-8">
        <q-input
          rounded
          outlined
          dense
          v-model="searchTerm"
          placeholder="Word search"
          class="q-mr-sm"
          @keyup.enter="startSearch"
        >
          <template v-slot:prepend>
            <q-btn round dense flat icon="search" @click="startSearch" />
          </template>
          <template v-slot:append>
            <q-btn
              v-if="searchTerm !== ''"
              round
              dense
              flat
              icon="close"
              @click="clearSearch"
            />
          </template>
        </q-input>
      </div>
      <div class="col-4 text-right">
        <q-btn
          no-caps
          rounded
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

    <q-list class="q-mb-xl" bordered separator v-if="beginSearch">
      <q-item v-if="inProgress">
        <q-item-section>
          <q-item-label>
            <h6 class="q-mt-md q-mb-sm text-primary">
              <span style="color: rgba(12, 69, 176, 0.87)">Searching for </span>
              <b class="q-pr-sm">{{ searchPhrase }}</b>
              <q-spinner-dots size="1.5em" />
            </h6>
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-item v-if="!inProgress && results?.length > 0">
        <q-item-section>
          <q-item-label>
            <h6 class="q-mt-md q-mb-sm text-primary">
              <span style="color: rgba(12, 69, 176, 0.87)">
                Showing results for
              </span>
              <b>{{ searchPhrase }}</b>
            </h6>
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-item clickable v-if="!inProgress && results?.length === 0">
        <q-item-section class="q-my-xl">
          <q-item-label class="text-center">
            <h4 class="q-my-none">
              <b>Search Results Not Found!</b>
            </h4>
            <p class="q-my-none" style="color: #6c757d">
              Sorry, but the word <b>{{ searchPhrase }}</b> was not found in the
              <b>ShengBase</b> dictionary. Please add it
              <a @click="openFormDialog" class="text-primary">
                here <q-icon name="fas fa-arrow-right-long" color="primary" />
              </a>
            </p>
          </q-item-label>
        </q-item-section>
      </q-item>

      <div v-if="!inProgress && results?.length > 0">
        <WordHolder :words="results" :isSearchResult="true" />
      </div>
    </q-list>

    <q-list bordered separator v-if="!isLoading && words?.length > 0">
      <WordHolder :words="words" />
    </q-list>

    <q-list bordered separator v-if="isLoading">
      <q-item clickable v-ripple>
        <q-item-section class="q-my-xl">
          <q-item-label class="text-center">
            <q-spinner color="primary" size="2.5em" /> <br />
            <h6 class="q-my-none text-primary">
              <b>Loading sheng words ... </b>
            </h6>
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
            <h6 class="q-my-none">
              <b>No sheng words available</b>
            </h6>
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import { Notify } from "quasar";
import AddWordForm from "./AddWordForm.vue";
import WordHolder from "./WordHolder.vue";

import { isVerified } from "../utils/helpers.js";
import { getWords, searchWord } from "../shared/services/word.service";

export default defineComponent({
  name: "WordsList",

  components: { AddWordForm, WordHolder },

  setup() {
    return {
      isOpen: ref(false),
      isVerified: ref(false),
      isLoading: ref(false),
      beginSearch: ref(false),
      inProgress: ref(false),
      words: ref(null),
      results: ref(null),
      searchTerm: ref(""),
      searchPhrase: ref(null),
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

          const user = JSON.parse(localStorage.getItem("sb_user"));
          if (user !== null) {
            this.words.forEach((word) => {
              let liked = word.likes.likes?.includes(user._id);
              let disliked = word.likes.dislikes?.includes(user._id);
              if (liked === true) {
                word.liked = true;
              }
              if (disliked === true) {
                word.disliked = true;
              }
            });
          }
          // console.log(JSON.parse(JSON.stringify(this.words)));
          this.isLoading = false;
        })
        .catch((error) => {
          this.isLoading = false;
          this.words = [];
          Notify.create({
            type: "negative",
            message: "CONNECTION REFUSED.",
            group: false,
            timeout: 5000,
          });
        });
    },

    clearSearch() {
      this.searchTerm = "";
      this.beginSearch = false;
    },

    startSearch() {
      if (this.searchTerm !== "") {
        this.searchPhrase = this.searchTerm;
        this.beginSearch = true;
        this.inProgress = true;
        searchWord(this.searchTerm)
          .then((response) => {
            this.results = response.data;

            const user = JSON.parse(localStorage.getItem("sb_user"));
            if (user !== null) {
              this.results.forEach((word) => {
                let liked = word.likes.likes?.includes(user._id);
                let disliked = word.likes.dislikes?.includes(user._id);
                if (liked === true) {
                  word.liked = true;
                }
                if (disliked === true) {
                  word.disliked = true;
                }
              });
            }
            this.inProgress = false;
          })
          .catch((error) => {
            this.inProgress = false;
            this.results = [];
            Notify.create({
              type: "info",
              color: "primary",
              message: "Search didn't complete. Connection lost.",
              group: false,
              timeout: 5000,
            });
          });
      }
    },
  },

  mounted() {
    this.getAllWords();
  },
});
</script>

<style lang="scss" scoped>
.search-input {
  display: none;
  width: 17vw;
}
.toggle-input {
  display: inline-block;
}
.cancel-icon {
  color: rgba(0, 0, 0, 0.7);
}
.cancel-icon:hover {
  color: rgba(193, 0, 21, 0.9);
}
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
  .search-input {
    width: 50vw;
  }
  .words {
    margin-right: 0;
    padding: 0;
  }
}
</style>
