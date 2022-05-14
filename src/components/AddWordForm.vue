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
          autogrow
          lazy-rules
          :rules="[
            (val) =>
              (val && val.length > 0) ||
              'Please provide meaning the sheng word',
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
          label="Second meaning (Optional)"
          dense
          filled
          autogrow
        />
        <q-input
          v-model="usage2"
          class="q-py-md"
          spellcheck="false"
          label="Example usage (Optional)"
          placeholder="e.g Tom alitoka nje ndio awashe nare"
          dense
          filled
          autogrow
        />
        <q-separator />
        <q-input
          class="q-py-md"
          filled
          v-model="origin"
          label="Word Origin *"
          placeholder="e.g Nairobi"
          dense
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
import { addNewWord } from "../shared/services/word.service";

export default defineComponent({
  name: "AddWordForm",

  setup() {
    const author = JSON.parse(localStorage.getItem("sb_user"));

    return {
      word: ref(null),
      origin: ref(null),
      meaning1: ref(null),
      usage1: ref(null),
      meaning2: ref(null),
      usage2: ref(null),
      isLoading: ref(false),
      author: ref(author),
      authorName: ref(`${author?.firstname} ${author?.lastname}`),
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
        })
        .catch((error) => {
          console.log(error);
          this.isLoading = false;
          Notify.create({
            type: "negative",
            message: "Error! Something went wrong while adding word.",
            group: false,
          });
        });
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
