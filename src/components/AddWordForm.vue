<template>
  <q-card class="card-form">
    <q-card-section class="row items-center q-pb-none">
      <div class="text-h6 text-primary">Add Sheng Word</div>
      <q-space />
      <q-btn icon="close" color="primary" flat round dense v-close-popup />
    </q-card-section>

    <q-card-section>
      <q-form class="form" @submit.prevent="onSubmit">
        <q-input
          class="q-py-md"
          v-model="word"
          label="Sheng word *"
          spellcheck="false"
          type="text"
          filled
          dense
          :readonly="wordExists || checking"
          @change="checkIfExists(word)"
          lazy-rules
          :rules="[
            (val) =>
              (val && val.trim().length > 0) || 'Please provide the sheng word',
          ]"
        />
        <q-input
          class="q-py-md"
          v-model="variants"
          label="Other forms of the word. Separate each with a comma , (Optional)"
          placeholder="e.g Rada, Radanisha."
          spellcheck="false"
          type="text"
          filled
          dense
          :readonly="checking"
        />
        <q-separator />
        <q-input
          v-model="meaning1"
          class="q-py-md"
          spellcheck="false"
          label="Sheng word meaning *"
          dense
          filled
          :readonly="wordExists || checking"
          autogrow
          lazy-rules
          :rules="[
            (val) =>
              (val && val.trim().length > 0) ||
              'Please provide meaning of the sheng word',
          ]"
        />
        <q-input
          v-model="usage1"
          class="q-py-md"
          spellcheck="false"
          label="Example usage *"
          placeholder="e.g Tom alitoka nje ndio awashe nare"
          dense
          filled
          autogrow
          :readonly="wordExists || checking"
          lazy-rules
          :rules="[
            (val) =>
              (val && val.trim().length > 0) ||
              'Please provide example usage for the sheng word',
          ]"
        />
        <q-separator />
        <q-input
          v-model="meaning2"
          class="q-py-md"
          spellcheck="false"
          :label="meaning2Label"
          dense
          filled
          autogrow
          :readonly="checking"
          lazy-rules
          :rules="[
            (val) => validateVal(val) || 'Please provide second meaning',
          ]"
        />
        <q-input
          v-model="usage2"
          class="q-py-md"
          spellcheck="false"
          :label="usage2Label"
          placeholder="e.g Tom aliwasha nare darasani."
          dense
          filled
          autogrow
          :readonly="checking"
          lazy-rules
          :rules="[(val) => validateVal(val) || 'Please provide example usage']"
        />
        <q-separator />
        <q-input
          class="q-py-md"
          filled
          v-model="origin"
          label="Word Origin *"
          placeholder="e.g Nairobi"
          dense
          :readonly="wordExists || checking"
          type="text"
          lazy-rules
          :rules="[
            (val) =>
              (val && val.trim().length > 0) ||
              'Please provide origin of the sheng word',
          ]"
        />
        <q-input
          class="q-py-md"
          filled
          v-model="authorName"
          label="Author *"
          dense
          readonly
        />
        <div class="q-mt-md q-mb-lg">
          <q-btn no-caps :loading="isLoading" type="submit" color="primary">
            <span v-if="wordExists">Update Word</span>
            <span v-else>Add Word</span>
            <template v-slot:loading>
              <q-spinner class="on-left" color="white" />
            </template>
          </q-btn>
          <span v-if="isLoading" class="q-pl-md">Adding...</span>
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script>
import { defineComponent, ref } from "vue";
import { Notify } from "quasar";
import { addNewWord, getWord, uWord } from "../shared/services/word.service";
import { BANNED_WORDS } from "../utils/contants.js";

export default defineComponent({
  name: "AddWordForm",

  setup() {
    const author = JSON.parse(localStorage.getItem("sb_user"));

    return {
      word: ref(null),
      variants: ref(null),
      wordId: ref(null), // If the word provided exists, get the word id
      origin: ref(null),
      meaning1: ref(null),
      usage1: ref(null),
      meaning2: ref(null),
      usage2: ref(null),
      isLoading: ref(false),
      author: ref(author),
      authorName: ref(`${author?.firstname} ${author?.lastname}`),

      meaning2Label: ref("Second meaning (Optional)"),
      usage2Label: ref("Second example usage (Optional)"),

      oldMeaning: ref(null),

      wordExists: ref(false),
      isSameCoAuthor: ref(false),
      checking: ref(false),

      bannedWords: ref(BANNED_WORDS),
    };
  },

  methods: {
    async onSubmit() {
      this.isLoading = true;

      let meaning = [
        {
          meaning: this.meaning1.trim(),
          usage: this.usage1.trim(),
        },
      ];

      if (this.usage2 !== null) {
        meaning.push({
          meaning: this.meaning2 !== null ? this.meaning2.trim() : "",
          usage: this.usage2.trim(),
        });
      }

      let is_banned = false;
      if (
        this.isBanned(this.word) ||
        this.isBanned(this.variants) ||
        this.isBanned(this.meaning1) ||
        this.isBanned(this.meaning2) ||
        this.isBanned(this.usage1) ||
        this.isBanned(this.usage2) ||
        this.isBanned(this.origin)
      ) {
        is_banned = true;
      }

      if (this.wordExists === true) {
        let payload = {
          wordId: this.wordId,
          meaning: [],
          variants: this.variants !== null ? this.variants : "",
          status: is_banned ? 1 : 0,
        };
        if (this.isSameCoAuthor === true) {
          payload.meaning = [
            ...this.oldMeaning,
            { meaning: this.meaning2.trim(), usage: this.usage2.trim() },
          ];
        } else {
          payload.meaning = [
            ...this.oldMeaning,
            {
              meaning: this.meaning2.trim(),
              usage: this.usage2.trim(),
              coAuthor: this.author._id,
            },
          ];
        }

        // Update word by adding second meaning
        await uWord(payload)
          .then((res) => {
            Notify.create({
              type: "positive",
              message: is_banned
                ? "Success! Word updates are currently under review."
                : "Success! Word updated successfully.",
              group: false,
            });

            this.isLoading = false;
            this.$emit("wordAdded", true);
            this.$router.push("/");
          })
          .catch((error) => {
            Notify.create({
              type: "negative",
              message: "Something went wrong while updating word.",
              group: false,
            });
            this.isLoading = false;
          });
      } else {
        const payload = {
          author: this.author._id,
          word: this.word,
          variations: this.variants !== null ? this.variants : "",
          origin: this.origin,
          meaning: meaning,
          status: is_banned ? 1 : 0,
        };

        await addNewWord(payload)
          .then((res) => {
            Notify.create({
              type: "positive",
              message: is_banned
                ? "Success! Word added is under review."
                : "Success! Word added successfully.",
              group: false,
            });
            this.isLoading = false;
            this.$emit("wordAdded", true);
            this.$router.push("/");
          })
          .catch((error) => {
            Notify.create({
              type: "negative",
              message: "Error! Something went wrong while adding word.",
              group: false,
            });
            this.isLoading = false;
          });
      }
    },

    async checkIfExists(word) {
      if (word?.length > 0) {
        this.checking = true;

        const notif = Notify.create({
          spinner: true,
          color: "primary",
          message: "Checking if word exists",
          group: false,
        });

        notif({ timeout: 0 });

        await getWord(word)
          .then((res) => {
            this.checking = false;
            if (!this.checking) {
              setTimeout(() => {
                if (res.data?.length > 0) {
                  this.wordExists = true;
                  this.updateWord(res.data);
                  notif({
                    spinner: false,
                    icon: "check",
                    color: "primary",
                    message: `Check complete. '${this.word}' already exists. Please add second meaning.`,
                    timeout: 3000,
                  });
                } else {
                  notif({
                    spinner: false,
                    icon: "check",
                    color: "primary",
                    message: "Check complete. Word can be added.",
                    timeout: 2500,
                  });
                }
              }, 1000);
            }
          })
          .catch((error) => {
            Notify.create({
              type: "warning",
              message: "Something went wrong or lost internet connection.",
              group: false,
            });
            this.checking = false;
          });
      }
    },

    validateVal(val) {
      if (this.wordExists === false) {
        return true;
      } else {
        if (val && val.trim().length > 0) {
          return true;
        } else {
          return false;
        }
      }
    },

    updateWord(data) {
      this.meaning2Label = "Second meaning *";
      this.usage2Label = "Example usage *";
      const existingWord = data[0];
      this.oldMeaning = existingWord?.meaning;
      this.meaning1 = existingWord?.meaning[0]?.meaning;
      this.usage1 = existingWord?.meaning[0]?.usage;
      this.origin = existingWord?.origin;
      this.word = existingWord?.word;
      this.variants = existingWord?.variations;
      if (existingWord?.author?._id === this.author._id) {
        this.isSameCoAuthor = true;
      }
      this.authorName = `${existingWord?.author?.firstname} ${existingWord?.author?.lastname}`;
      this.wordId = existingWord?._id;
    },

    // HELPER FUNCTIONS
    isBanned(phrase) {
      phrase = phrase?.length > 0 ? phrase.toLowerCase() : "good";
      let is_bw = false; // Banned word?
      for (let i = 0; i < this.bannedWords.length; i++) {
        const found = phrase.match(this.bannedWords[i]);
        if (found !== null) {
          is_bw = true;
          break;
        }
      }
      return is_bw;
    },
  },
});
</script>

<style lang="scss" scoped>
.card-form {
  width: 600px;
  max-width: 600px;
}
@media only screen and (max-width: 575px) {
  //
}
</style>
