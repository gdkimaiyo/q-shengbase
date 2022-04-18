<template>
  <div class="after-navbar bg-primary">
    <div class="q-px-md q-pt-lg q-mb-md text-center">
      <div class="text-h3">{{ title }}</div>
      <div class="text-subtitle1 q-mt-md">{{ desc }}</div>
      <div class="page-path q-mt-sm" v-if="show_paths">
        <span v-for="path in paths" :key="path.index">
          {{ path }}
          <span
            v-if="path !== paths[paths.length - 1]"
            style="padding-right: 6px; padding-left: 2px"
          >
            <q-icon name="fas fa-arrow-right-long" />
          </span>
        </span>
      </div>
    </div>
    <q-img :src="imageSrc" class="after-navbar-image absolute-top" />
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "AfterNavBar",

  props: {
    imageSrc: {
      type: String,
      default: "to-learn.jpg",
    },
    title: {
      type: String,
      default: "ShengBase",
    },
    desc: {
      type: String,
    },
    show_paths: {
      type: Boolean,
      default: true,
    },
    paths: Array,
  },
});
</script>

<style lang="scss" scoped>
.after-navbar {
  color: #fff;
  width: 100%;
  max-width: 100%;
  height: 32vh;
  padding-top: 10vh;
  padding-bottom: 5vh;
  z-index: -1;
}
.after-navbar-image {
  height: 32vh;
  z-index: -1;
  opacity: 0.4;
  filter: grayscale(50%);
}
.page-path {
  font-weight: bold;
  font-size: small;
  color: rgba(255, 255, 255, 0.6);
}
@media only screen and (max-width: 575px) {
  .after-navbar,
  .after-navbar-image {
    height: 35vh;
  }
}
</style>
