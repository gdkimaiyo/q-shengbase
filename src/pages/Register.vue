<template>
  <q-page class="bg-grey-3 page column q-pt-xl">
    <div class="section q-pa-md">
      <div class="register-section">
        <div class="register-info q-pt-xl">
          <p class="q-mt-md">Registering for an account enables you to:</p>
          <div class="benefits">
            <q-list dense class="q-ml-md">
              <q-item>
                <q-item-section>
                  <span>
                    <q-icon name="fas fa-circle-check q-pr-sm" size="24px" />
                    Add a sheng word
                  </span>
                </q-item-section>
              </q-item>

              <q-item class="q-my-md">
                <q-item-section>
                  <span>
                    <q-icon name="fas fa-circle-check q-pr-sm" size="24px" />
                    Vote for a sheng word
                  </span>
                </q-item-section>
              </q-item>

              <q-item class="q-my-md">
                <q-item-section>
                  <span>
                    <q-icon name="fas fa-circle-check q-pr-sm" size="24px" />
                    Earn points by adding sheng words
                  </span>
                </q-item-section>
              </q-item>
            </q-list>
            <p>
              <span
                class="faqs-link text-weight-bold cursor-pointer"
                @click="isOpen = true"
              >
                Find out more <q-icon name="fas fa-angle-right" />
              </span>
            </p>
            <div class="q-pa-md q-gutter-sm">
              <q-dialog v-model="isOpen">
                <RegisterFAQs />
              </q-dialog>
            </div>
          </div>
        </div>
        <div class="register-form">
          <h5 class="logo-btn q-my-none q-pb-md" @click="navigateTo('/')">
            ShengBase
          </h5>
          <div class="text-h5 q-pb-sm text-weight-bold">
            Create Your Account
          </div>
          <div class="text-subtitle2 q-pb-md text-weight-bold">
            Already have an account?
            <a class="href-link" @click="navigateTo('/login')">Sign In</a>
          </div>
          <RegisterForm />
        </div>
      </div>
      <div class="info-mobile q-mt-lg q-mb-none q-pt-md">
        <p class="q-my-none q-py-md q-px-lg">
          Registering for an account enables you to add or vote for a sheng word
          and earn points.
        </p>
        <p class="q-my-none q-py-md q-px-lg">
          <span
            class="faqs-link text-weight-bold cursor-pointer"
            @click="isOpen2 = true"
          >
            Find out more <q-icon name="fas fa-angle-right" />
          </span>
        </p>
        <div class="q-pa-md q-gutter-sm">
          <q-dialog v-model="isOpen2">
            <RegisterFAQs />
          </q-dialog>
        </div>
      </div>
      <div class="copyright text-center q-mb-lg q-pt-md">
        <p class="q-my-none q-py-md q-px-lg">
          &copy;{{ currentYear }},
          <span style="color: rgba(0, 0, 0, 0.6)"> All Rights Reserved.</span>
          <a @click="navigateTo('/')" class="text-weight-medium cursor-pointer">
            ShengBase.
          </a>
          <a @click="navigateTo('/')" class="text-primary cursor-pointer">
            Privary and Terms
          </a>
        </p>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref } from "vue";
import RegisterForm from "../components/RegisterForm.vue";
import RegisterFAQs from "../components/RegisterFAQs.vue";

export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Register",

  components: {
    RegisterForm,
    RegisterFAQs,
  },

  setup() {
    return {
      isOpen: ref(false),
      isOpen2: ref(false),
    };
  },

  methods: {
    navigateTo(route) {
      this.$router.push(route);
    },
  },

  computed: {
    currentYear() {
      const date = new Date();
      return date.getFullYear();
    },
  },
});
</script>

<style lang="scss" scoped>
.section {
  width: 100%;
  max-width: 960px;
  margin: 0 auto;
}
.href-link {
  color: green;
  cursor: pointer;
}
.logo-btn {
  font-size: 1.7rem;
  font-weight: bold;
  cursor: pointer;
  color: green;
}
.logo-btn:hover {
  color: rgba(0, 128, 0, 0.85);
}
.href-link:hover {
  color: rgba(0, 128, 0, 0.85);
  // color: rgba(83, 183, 129, 0.85);
}
.faqs-link:hover {
  color: rgba(255, 255, 1255, 0.7);
}

.register-section {
  min-height: 65vh;
  border-radius: 12px;
  background: #ffffff;
  display: flex;
  justify-content: center;
  // box-shadow: 0 3px 5px -1px #0003, 0 6px 10px #00000024, 0 0 4px #42b983;
  // box-shadow: 0px 1px 9px 2px rgba(0, 0, 0, 0.15);
}
.register-info,
.info-mobile {
  background-image: url("../assets/sky.png");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
  color: #ffffff;
}
.register-form {
  width: 55%;
  margin-left: 32px;
  padding: 24px;
}
.register-info {
  width: 45%;
  display: block;
  margin-left: 0;
  border-radius: 12px 0 0 12px;

  p {
    padding: 24px;
  }
}

.info-mobile {
  display: none;
}
.copyright {
  font-size: 14px;
}

@media only screen and (max-width: 575px) {
  .page {
    margin-top: 0 !important;
    background-color: #ffffff !important;
  }
  .section {
    padding: 0;
  }
  .register-section {
    border-radius: 4px;
  }
  .logo-btn:hover {
    color: #0c45b0;
  }
  .register-info {
    display: none;
  }
  .register-form {
    width: 100%;
    max-width: 100%;
    margin-left: 0;
  }
  .info-mobile {
    display: block;
  }
  .copyright {
    text-align: left;
  }
}
</style>
