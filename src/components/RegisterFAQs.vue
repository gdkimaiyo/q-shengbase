<template>
  <q-carousel
    transition-prev="slide-right"
    transition-next="slide-left"
    swipeable
    animated
    v-model="slide"
    control-color="primary"
    navigation
    arrows
    padding
    height="fit-content"
    class="bg-white shadow-1 rounded-borders"
  >
    <q-carousel-slide
      v-for="faq in faqs"
      :key="faq.id"
      :name="faq.id"
      class="column no-wrap flex-center"
    >
      <div class="text-h6 text-primary text-center q-pt-md">{{ faq.faq }}</div>
      <div class="q-mt-md text-center q-px-sm">
        <span v-html="faq.desc"></span>
      </div>
      <div class="q-mt-md text-center q-px-sm" v-if="faq.desc2">
        <span v-html="faq.desc2"></span>
      </div>
    </q-carousel-slide>
  </q-carousel>
</template>

<script>
import { defineComponent, ref } from "vue";
import { REGISTER_FAQS } from "../utils/contants.js";

export default defineComponent({
  name: "RegisterFAQs",

  setup() {
    return {
      slide: ref(1),
      faqs: ref(REGISTER_FAQS),
    };
  },
});
</script>
