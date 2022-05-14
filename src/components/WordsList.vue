<template>
  <div class="words q-mr-md q-pa-md">
    <div class="row q-mb-sm q-ml-sm">
      <div class="col text-h5 text-primary">Words</div>
      <div class="col text-right">
        <q-btn flat round color="primary">
          <q-icon name="fas fa-magnifying-glass" />
        </q-btn>
        <q-btn
          no-caps
          unelevated
          color="primary"
          class="q-ml-md"
          @click="openFormDialog"
        >
          <q-icon name="fas fa-plus" />
          <span class="q-pl-sm">Add Word</span>
        </q-btn>
      </div>

      <div class="q-pa-md q-gutter-sm">
        <q-dialog v-model="isOpen" persistent>
          <AddWordForm @wordAdded="onAddWord" />
        </q-dialog>
      </div>
    </div>
    <q-list bordered separator>
      <q-item clickable v-ripple>
        <q-item-section>
          <q-item-label>
            <h6 class="q-my-none" style="color: #44aa3c">Nare</h6>
          </q-item-label>
          <q-item-label>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum
            velit veniam obcaecati vero doloribus repellat nulla inventore
            dolore nihil. In qui veniam exercitationem placeat reiciendis! Nulla
            minima molestiae iure aperiam.
          </q-item-label>
          <q-item-label caption>Like</q-item-label>
        </q-item-section>
      </q-item>

      <q-item clickable v-ripple>
        <q-item-section>
          <q-item-label>
            <h6 class="q-my-none" style="color: #44aa3c">Stima</h6>
          </q-item-label>
          <q-item-label>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </q-item-label>
          <q-item-label caption>Like</q-item-label>
        </q-item-section>
      </q-item>

      <q-item clickable v-ripple>
        <q-item-section>
          <q-item-label>
            <h6 class="q-my-none" style="color: #44aa3c">Nare</h6>
          </q-item-label>
          <q-item-label>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum
            velit veniam obcaecati vero doloribus repellat
          </q-item-label>
          <q-item-label caption>Like</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import { Notify } from "quasar";
import AddWordForm from "./AddWordForm.vue";

export default defineComponent({
  name: "WordsList",

  components: { AddWordForm },

  setup() {
    return {
      isOpen: ref(false),
    };
  },

  methods: {
    openFormDialog() {
      const user = JSON.parse(localStorage.getItem("sb_user"));
      if (user === null) {
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
  },
});
</script>

<style lang="scss" scoped>
@media only screen and (max-width: 575px) {
  .words {
    margin-right: 0;
    padding: 0;
  }
}
</style>
