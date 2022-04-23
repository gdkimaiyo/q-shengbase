<template>
  <q-layout id="layout" view="lHh Lpr lFf">
    <NavBar v-if="showNavBar" />

    <q-page-container>
      <router-view />
    </q-page-container>

    <Footer v-if="showNavBar" />
  </q-layout>
</template>

<script>
import { defineComponent } from "vue";
import { useRoute } from "vue-router";
import NavBar from "../shared/NavBar.vue";
import Footer from "../shared/Footer.vue";

export default defineComponent({
  name: "MainLayout",

  components: {
    NavBar,
    Footer,
  },

  computed: {
    showNavBar() {
      return useRoute().path === "/register" ||
        useRoute().path === "/login" ||
        useRoute().path === "/login/" ||
        useRoute().path === "/register/"
        ? false
        : true;
    },
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
