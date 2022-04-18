<template>
  <q-page class="column q-pb-xl">
    <AfterNavBar
      :imageSrc="src"
      title="About"
      :paths="paths"
      desc="Find out more about ShengBase"
    />
    <div class="main-page q-pa-md">
      <h5 class="q-mt-none">About Page</h5>
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
  name: "About",

  components: {
    AfterNavBar,
  },

  setup() {
    return {
      src: ref("src/assets/board.jpg"),
      paths: ref(["Home", "About"]),
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
