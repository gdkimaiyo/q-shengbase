<template>
  <q-page class="column q-pb-xl">
    <AfterNavBar
      :show_paths="false"
      desc="Add or find trending sheng words in our ShengBase dictionary"
    />
    <div class="main-page q-pa-md">
      <h5 class="q-mt-none">Home Page</h5>
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
import { Notify } from "quasar";
import AfterNavBar from "../components/AfterNavBar.vue";
import {
  getLocation,
  getUsers,
  saveLog,
} from "../shared/services/user.service";

export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Home",

  components: {
    AfterNavBar,
  },

  setup() {
    return {
      location: ref({}),
      isLoading: false,
      users: ref([]),
    };
  },

  methods: {
    async getVisitorIP() {
      getLocation()
        .then((response) => {
          this.location = response;

          const payload = {
            city: this.location?.city,
            country: this.location?.countryName,
            countryCode: this.location?.countryCode,
            ipAddress: this.location?.ipAddress,
          };

          saveLog(payload)
            .then((response) => {})
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          console.log(error);
        });
    },

    getAllUsers() {
      this.isLoading = true;
      getUsers()
        .then((response) => {
          this.users = response.data;
          this.isLoading = false;
          // console.log(JSON.parse(JSON.stringify(this.users)));
        })
        .catch((error) => {
          console.log(error);
          this.isLoading = false;
          Notify.create({
            type: "negative",
            message: "Error! Unable to fetch users.",
            group: false,
          });
        });
    },
  },

  mounted() {
    this.getVisitorIP();
    this.getAllUsers();
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
