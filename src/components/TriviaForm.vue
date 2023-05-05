<template>
  <div class="trends">
    <q-card class="trending-words">
      <q-card-section class="card-header"> ShengBase Trivia </q-card-section>

      <q-card-section class="q-pt-none q-mt-md">
        <q-list v-if="!isLoading && questions?.trivia?.length > 0">
          <q-item>
            <q-item-section>
              <q-item-label class="info q-mb-md">
                Answer the following to the best of your knowledge
              </q-item-label>
              <q-item-label>
                <q-form class="form" @submit.prevent="onSubmit">
                  <div v-for="question in questions.trivia" :key="question.id">
                    <div v-if="question.type === 'text'">
                      <div class="text-subtitle1 text-weight-bold">
                        {{ question.question }}
                      </div>
                      <q-input
                        class="q-py-md"
                        filled
                        v-model="question.model"
                        label="Answer *"
                        dense
                        :type="question.type"
                        lazy-rules
                        :rules="[
                          (val) =>
                            validateTextInput(val) || 'Answer cannot be blank',
                        ]"
                        @update:model-value="
                          updateTextAnswer(question.id, $event)
                        "
                      />
                    </div>
                  </div>
                  <div class="q-mt-md">
                    <q-btn
                      no-caps
                      :loading="isLoading"
                      type="submit"
                      color="primary"
                    >
                      Submit
                      <template v-slot:loading>
                        <q-spinner class="on-left" color="white" />
                      </template>
                    </q-btn>
                    <span v-if="isLoading" class="q-pl-md">Submiting...</span>
                  </div>
                </q-form>
              </q-item-label>
            </q-item-section>
          </q-item>
          <!-- <q-separator spaced inset /> -->
        </q-list>

        <q-list separator v-if="isLoading">
          <q-item>
            <q-item-section>
              <q-item-label class="info q-mb-md">
                <div v-for="index in 3" :key="index">
                  <q-skeleton type="text" />
                  <q-skeleton type="text" />
                  <q-skeleton type="QInput" height="30px" />
                  <br />
                </div>
                <q-skeleton type="QBtn" />
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
import { isVerified } from "../utils/helpers.js";
import { getTrivia } from "../shared/services/trivia.service";

export default defineComponent({
  name: "TriviaForm",

  setup() {
    return {
      questions: ref(null),
      answer: ref(null),
      answers: ref({}),
      isLoading: ref(false),
      isSubmiting: ref(false),
      isVerified: ref(false),
    };
  },

  methods: {
    getTriviaQuiz() {
      this.isLoading = true;
      getTrivia(1)
        .then((response) => {
          this.questions = response.data;
          this.isLoading = false;
        })
        .catch((error) => {
          this.questions = [];
        });
    },

    async onSubmit() {
      this.isSubmiting = true;
      this.isVerified = await isVerified();
      if (this.isVerified === false) {
        this.signInNotify();
        this.isSubmiting = false;
        return;
      }

      if (
        this.answers.ans1.toLowerCase() === "julie justice" &&
        this.answers.ans2.toLowerCase() === "mode"
      ) {
        Notify.create({
          type: "positive",
          message:
            "Congratulations! You have answered all the questions correctly.",
          group: false,
        });
      } else {
        Notify.create({
          type: "warning",
          message: "Try again",
          group: false,
        });
      }
      setTimeout(() => {
        this.isSubmiting = false;
      }, 3000);
    },

    updateTextAnswer(questionId, event) {
      if (questionId === 1) {
        this.answers.ans1 = event;
      } else if (questionId === 2) {
        this.answers.ans2 = event;
      } else {
        this.answers.ans3 = event;
      }
    },

    // HELPER Functions
    async validateTextInput(val) {
      this.isVerified = await isVerified();
      if (this.isVerified === false) {
        return true;
      } else {
        if (val && val.length > 0) {
          return true;
        } else {
          return false;
        }
      }
    },

    signInNotify() {
      Notify.create({
        type: "info",
        message: "Please sign in to participate in ShengBase Trivia.",
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
    },
  },

  mounted() {
    this.getTriviaQuiz();
  },
});
</script>

<style lang="scss" scoped>
.trending-words {
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

.info {
  font-size: 17px;
}
.meaning {
  font-size: 14px;
}

@media only screen and (max-width: 575px) {
  //
}
</style>
