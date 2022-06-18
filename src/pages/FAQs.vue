<template>
  <q-page class="column q-pb-xl">
    <AfterNavBar
      :imageSrc="src"
      title="FAQs"
      :paths="paths"
      desc="Find frequently asked questions"
    />
    <div class="main-page q-pa-md">
      <q-list bordered>
        <div v-for="(faq, index) in faqs" :key="faq.id">
          <q-expansion-item
            group="somegroup"
            :label="faq.faq"
            :defaultOpened="faq.open"
            header-class="bg-green-3"
            expand-icon-class="text-primary"
          >
            <q-card class="faq-content">
              <q-card-section>
                <span v-html="faq.desc"></span>
              </q-card-section>

              <q-card-section v-if="faq.desc2">
                <span v-html="faq.desc2"></span>
              </q-card-section>
            </q-card>
          </q-expansion-item>

          <q-separator v-if="index !== faqs.length - 1" />
        </div>
      </q-list>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref } from "vue";
import AfterNavBar from "../components/AfterNavBar.vue";
import { FAQS } from "../utils/contants.js";

export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: "FAQs",

  components: {
    AfterNavBar,
  },

  setup() {
    return {
      src: ref("abcd.jpg"),
      paths: ref(["Home", "FAQs"]),
      faqs: ref(FAQS),
    };
  },
});
</script>

<style lang="scss" scoped>
.main-page {
  width: 100%;
  max-width: 1024px;
  margin: 0 auto;
}

// .faq-content {
//   color: rgba(12, 69, 176);
// }
</style>
