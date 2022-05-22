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
            (val) => (val && val.length > 0) || 'Please provide the sheng word',
          ]"
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
              (val && val.length > 0) ||
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
              (val && val.length > 0) ||
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
              (val && val.length > 0) ||
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
        <div class="q-mt-md">
          <q-btn no-caps :loading="isLoading" type="submit" color="primary">
            Add Word
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

export default defineComponent({
  name: "AddWordForm",

  setup() {
    const author = JSON.parse(localStorage.getItem("sb_user"));

    return {
      word: ref(null),
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
      usage2Label: ref("Example usage (Optional)"),

      oldMeaning: ref(null),

      wordExists: ref(false),
      isSameCoAuthor: ref(false),
      checking: ref(false),
    };
  },

  methods: {
    async onSubmit() {
      this.isLoading = true;

      let meaning = [
        {
          meaning: this.meaning1,
          usage: this.usage1,
        },
      ];

      if (this.meaning2 !== null) {
        meaning.push({
          meaning: this.meaning2,
          usage: this.usage2,
        });
      }

      if (this.wordExists === true) {
        let payload = { wordId: this.wordId, meaning: [] };
        if (this.isSameCoAuthor === true) {
          payload.meaning = [
            ...this.oldMeaning,
            { meaning: this.meaning2, usage: this.usage2 },
          ];
        } else {
          payload.meaning = [
            ...this.oldMeaning,
            {
              meaning: this.meaning2,
              usage: this.usage2,
              coAuthorId: this.author._id,
              coAuthor: `${this.author?.firstname} ${this.author?.lastname}`,
            },
          ];
        }

        // Update word by adding second meaning
        await uWord(payload)
          .then((res) => {
            Notify.create({
              type: "positive",
              message: "Success! Word updated successfully.",
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
          authorId: this.author._id,
          word: this.word,
          origin: this.origin,
          author: `${this.author?.firstname} ${this.author?.lastname}`,
          meaning: meaning,
        };

        await addNewWord(payload)
          .then((res) => {
            Notify.create({
              type: "positive",
              message: "Success! Word added successfully.",
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
        if (val && val.length > 0) {
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
      if (existingWord.authorId === this.author._id) {
        this.isSameCoAuthor = true;
      }
      this.authorName = existingWord?.author;
      this.wordId = existingWord?._id;
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
