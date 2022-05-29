<template>
  <div class="trends">
    <q-card class="trending-words">
      <q-card-section class="text-h5 text-primary"> Trends </q-card-section>

      <q-card-section class="q-pt-none">
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum
          voluptatum molestias temporibus, incidunt rem ea nulla eveniet tempora
          reiciendis vel cupiditate. Deleniti quae earum excepturi beatae dicta
          dolorem aut itaque.
        </p>
      </q-card-section>
    </q-card>

    <q-card class="top-users">
      <q-card-section class="text-h5 text-primary"> Top Users </q-card-section>

      <q-card-section class="q-pt-none">
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum
          voluptatum molestias temporibus, incidunt rem ea nulla eveniet tempora
          reiciendis vel cupiditate. Deleniti quae earum excepturi beatae dicta
          dolorem aut itaque.
        </p>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { defineComponent } from "vue";
// import { Notify } from "quasar";

export default defineComponent({
  name: "TrendsList",
});
</script>

<style lang="scss" scoped>
.trending-words,
.top-users {
  width: 100%;
  max-width: 100%;
  margin-top: 24px;
}

@media only screen and (max-width: 575px) {
  //
}
</style>
