<template>
  <q-page class="column q-pb-xl">
    <AfterNavBar
      :imageSrc="src"
      title="FAQs"
      :paths="paths"
      desc="Find frequently asked questions"
    />
    <div class="main-page q-pa-md">
      <h5 class="q-mt-none">FAQs Page</h5>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio blanditiis
        ipsum reiciendis eos atque, vitae eveniet cum magni inventore cupiditate
        repudiandae dolores eligendi ducimus sequi voluptate expedita eius qui
        quibusdam.
      </p>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio blanditiis
        ipsum reiciendis eos atque, vitae eveniet cum magni inventore cupiditate
        repudiandae dolores eligendi ducimus sequi voluptate expedita eius qui
        quibusdam.
      </p>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref } from "vue";
import AfterNavBar from "../components/AfterNavBar.vue";

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
    };
  },
});
</script>

<style lang="scss" scoped>
.main-page {
  width: 100%;
  max-width: 960px;
  margin: 0 auto;
}
</style>
