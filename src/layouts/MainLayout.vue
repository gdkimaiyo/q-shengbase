<template>
  <q-layout id="layout" view="lHh Lpr lFf">
    <NavBar />

    <q-page-container>
      <router-view />
    </q-page-container>

    <Footer />
  </q-layout>
</template>

<script>
import { defineComponent } from "vue";
import NavBar from "../shared/NavBar.vue";
import Footer from "../shared/Footer.vue";

export default defineComponent({
  name: "MainLayout",

  components: {
    NavBar,
    Footer,
  },
});
</script>

<style lang="scss">
#layout {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  font-size: 16px;
}
</style>
