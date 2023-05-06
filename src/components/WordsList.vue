<template>
  <div class="words q-mr-md q-pa-md">
    <q-input
      borderless
      bg-color="grey-3"
      v-model="searchTerm"
      label-color="text-black"
      placeholder="Word search"
      standout="bg-dark text-black"
      class="search-input font-weight-bold"
      @keyup.enter="startSearch"
    >
      <template v-slot:prepend>
        <q-btn
          round
          flat
          icon="search"
          class="search-icon"
          @click="startSearch"
        />
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
        <q-btn
          unelevated
          color="primary"
          class="search-btn"
          label="Search"
          @click="startSearch"
        />
      </template>
    </q-input>

    <div class="q-pa-md q-gutter-sm">
      <q-dialog v-model="isOpen" persistent>
        <AddWordForm @wordAdded="onAddWord" />
      </q-dialog>
    </div>

    <q-card class="my-card q-mb-xl" v-if="beginSearch">
      <q-card-section class="q-pt-none q-mt-md">
        <q-list separator v-if="beginSearch">
          <q-item v-if="inProgress" class="q-py-none">
            <q-item-section>
              <q-item-label>
                <h6 class="q-mt-md q-mb-none text-primary">
                  <span style="color: rgba(12, 69, 176, 0.87)">
                    Searching for
                  </span>
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

          <q-item v-if="!inProgress && results?.length === 0">
            <q-item-section class="q-my-xl">
              <q-item-label class="text-center">
                <h5 class="q-my-none">
                  <b>Search Results Not Found!</b>
                </h5>
                <p class="q-my-none" style="color: #6c757d">
                  Sorry, but the word <b>{{ searchPhrase }}</b> was not found in
                  the <b>ShengBase</b> dictionary. Please add it
                  <a
                    @click="openFormDialog"
                    class="cursor-pointer text-primary"
                  >
                    here
                    <q-icon name="fas fa-arrow-right-long" color="primary" />
                  </a>
                </p>
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>

        <q-list
          separator
          v-if="!inProgress && results?.length > 0 && beginSearch"
          class="q-pb-md"
        >
          <WordHolder :words="results" :isSearchResult="true" />
        </q-list>
      </q-card-section>
    </q-card>

    <q-card class="my-card">
      <q-card-section class="card-header">
        <div class="row">
          <div class="col">Sheng Words</div>
          <div class="col text-right">
            <q-btn
              no-caps
              rounded
              unelevated
              color="white"
              text-color="dark"
              class="gt-sm q-ml-md"
              @click="openFormDialog"
            >
              <q-icon name="fas fa-plus" />
              <span class="q-pl-sm">Add Word</span>
            </q-btn>

            <q-btn
              round
              color="white"
              text-color="primary"
              class="lt-md q-ml-md"
              @click="openFormDialog"
            >
              <q-icon name="fas fa-plus" />
            </q-btn>
          </div>
        </div>
      </q-card-section>
      <q-card-section class="q-pt-none q-mt-md">
        <q-list separator v-if="!isLoading && words?.length > 0">
          <WordHolder :words="words" />
        </q-list>

        <q-list separator v-if="isLoading">
          <q-item v-for="index in 20" :key="index">
            <q-item-section>
              <q-item-label class="row">
                <q-skeleton type="text" class="q-mr-md" width="30%" />
                <q-skeleton type="text" class="q-mr-sm" width="8%" />
                <q-skeleton type="text" class="q-mr-sm" width="8%" />
                <q-skeleton type="text" class="q-mr-sm" width="8%" />
              </q-item-label>
              <q-item-label>
                <q-skeleton type="text" />
                <q-skeleton type="text" width="80%" />
              </q-item-label>
              <br />
              <q-item-label class="row" caption>
                <q-btn flat round>
                  <q-icon
                    name="fas fa-thumbs-up"
                    style="padding-right: 4px"
                    color="grey"
                  />
                </q-btn>
                <q-skeleton type="text" width="20px" />
                <q-btn flat round class="q-ml-sm">
                  <q-icon
                    name="fas fa-thumbs-down flip-horizontal"
                    style="padding-left: 4px"
                    color="grey"
                  />
                </q-btn>
                <q-skeleton type="text" width="20px" />
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>

        <q-list separator v-if="!isLoading && words?.length === 0">
          <q-item clickable v-ripple>
            <q-item-section class="q-my-xl">
              <div class="text-center">
                <q-icon name="fas fa-bars" size="100px" color="dark" />
              </div>
              <q-item-label class="text-center text-dark q-mt-xl">
                <h6 class="q-my-none">
                  <b>Connection REFUSED...</b>
                </h6>
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
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
      this.getAllWords();
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
  border-radius: 32px !important;
  // background-color: #ffffff;
}
.search-icon {
  margin-left: 16px;
}
.search-btn {
  margin-right: 16px;
}

.card-header {
  font-size: 1.35rem;
  font-weight: bold;
  color: rgba(255, 255, 255, 0.8);
  // background-color: rgba(12, 69, 176, 0.9);
  background-color: rgba(83, 183, 129);
  padding-top: 8px;
  padding-bottom: 8px;
}

.my-card {
  box-shadow: none;
  border: 1px solid rgba(0, 0, 0, 0.12);
}

.q-item {
  padding: 8px 4px;
}

@media only screen and (max-width: 575px) {
  .search-input {
    margin-bottom: 16px;
  }
  .search-icon {
    margin-left: 4px;
  }
  .search-btn {
    margin-right: 8px;
  }
  .words {
    margin-right: 0;
  }
}
</style>
