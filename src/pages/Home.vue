<template>
  <q-page id="home-page" class="column q-pb-xl">
    <AfterNavBar
      :show_paths="false"
      desc="Add or find trending sheng words in our ShengBase dictionary"
    />
    <div class="main-page q-py-md">
      <StatsList class="lt-sm" />
      <div class="row content q-mt-lg">
        <div class="col-xs-12 col-sm-8 col-md-8">
          <WordsList />
        </div>
        <div class="col-xs-12 col-sm-4 col-md-4">
          <div class="gt-xs q-pa-md q-mt-lg"></div>
          <StatsList class="gt-xs" />
          <TrendsList class="q-px-md" />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import AfterNavBar from "../components/AfterNavBar.vue";
import WordsList from "../components/WordsList.vue";
import StatsList from "../components/StatsList.vue";
import TrendsList from "../components/TrendsList.vue";

export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Home",

  components: {
    AfterNavBar,
    WordsList,
    StatsList,
    TrendsList,
  },
});
</script>

<style lang="scss" scoped>
#home-page {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.main-page {
  width: 100%;
  max-width: 1024px;
  margin: 0 auto;
}

@media only screen and (max-width: 575px) {
  //
}
</style>
