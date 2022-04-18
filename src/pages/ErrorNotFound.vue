<template>
  <div class="fullscreen bg-primary text-white text-center q-pa-md q-mt-xl">
    <div>
      <div style="font-size: 25vh">404</div>

      <div class="text-h2" style="opacity: 0.8">Oops. Page not found...</div>

      <q-btn
        class="q-mt-xl q-mr-lg"
        color="white"
        text-color="negative"
        unelevated
        @click="goBack()"
        style="font-size: 16px"
        no-caps
      >
        <q-icon name="fas fa-angle-left" />
        Go back
      </q-btn>
      <q-btn
        class="q-mt-xl"
        color="white"
        text-color="blue"
        unelevated
        to="/"
        style="font-size: 16px"
        no-caps
      >
        <q-icon name="fas fa-house" class="q-pr-sm" />
        Go home
      </q-btn>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "ErrorNotFound",

  methods: {
    goBack() {
      history.back();
    },
  },
});
</script>
