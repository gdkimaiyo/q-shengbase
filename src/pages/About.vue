<template>
  <q-page class="column q-pb-xl">
    <AfterNavBar
      :imageSrc="src"
      title="About"
      :paths="paths"
      desc="Find out more about ShengBase"
    />
    <div class="main-page q-pa-md">
      <h5 class="q-mb-lg text-primary text-weight-bold">About ShengBase</h5>
      <p>
        <b>ShengBase</b> brings you the Sheng dictionary enriched with latest
        and old sheng words. The words are added by ShengBase users from
        different regions in Kenya.
      </p>
      <p>
        Contribute in enriching our ShengBase dictionary today by adding sheng
        words of your own and be an author. You can as well update already added
        sheng words by adding second meaning.
      </p>

      <div class="faqs">
        <h5 class="q-mb-lg text-primary text-weight-bold">
          Frequently Asked Questions
        </h5>
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
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref } from "vue";
import AfterNavBar from "../components/AfterNavBar.vue";
import { FAQS } from "../utils/contants.js";

export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: "About",

  components: {
    AfterNavBar,
  },

  setup() {
    return {
      src: ref("abcd.jpg"),
      paths: ref(["Home", "About"]),
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
