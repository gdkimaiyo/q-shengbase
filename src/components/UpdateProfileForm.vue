<template>
  <q-form class="form" @submit.prevent="onSubmit">
    <q-input
      class="q-py-md"
      filled
      v-model="firstname"
      label="Firstname *"
      dense
      type="text"
      lazy-rules
      :rules="[(val) => (val && val.length > 0) || 'Please provide firstname']"
    />
    <q-input
      class="q-py-md"
      filled
      v-model="lastname"
      label="Lastname *"
      dense
      type="text"
      lazy-rules
      :rules="[(val) => (val && val.length > 0) || 'Please provide lastname']"
    />
    <q-input
      class="q-py-md"
      filled
      v-model="email"
      label="Email Address *"
      dense
      type="email"
      readonly
      lazy-rules
      :rules="[
        (val) => validateEmail(val) || 'Please provide a valid email address',
      ]"
    />
    <q-input
      class="q-py-md"
      filled
      v-model="cellPhone"
      label="Cell Phone (Optional)"
      placeholder="0712345678 or +254712345678 or 254712345678"
      dense
      type="text"
      lazy-rules
      :rules="[
        (val) => validateMobile(val) || 'Please provide a valid phone number.',
      ]"
    />
    <div class="q-mt-md">
      <q-btn no-caps :loading="isLoading" type="submit" color="primary">
        Update
        <template v-slot:loading>
          <q-spinner class="on-left" color="white" />
        </template>
      </q-btn>
      <span v-if="isLoading" class="q-pl-md">Updating...</span>
    </div>
  </q-form>
</template>

<script>
import { defineComponent, ref } from "vue";
import { Notify } from "quasar";
import { uUser } from "../shared/services/user.service";
import { validateMobile, validateEmail, titleCase } from "../utils/helpers.js";

export default defineComponent({
  name: "UpdateProfileForm",

  props: {
    details: Object,
  },

  setup() {
    return {
      firstname: ref(null),
      lastname: ref(null),
      email: ref(null),
      cellPhone: ref(undefined),
      isLoading: ref(false),
    };
  },

  created() {
    this.firstname =
      this.details?.firstname !== null ? this.details.firstname : null;
    this.lastname =
      this.details?.lastname !== null ? this.details.lastname : null;
    this.cellPhone =
      this.details?.cellPhone !== undefined
        ? this.details.cellPhone
        : undefined;
    this.email = this.details?.email !== null ? this.details.email : null;
  },

  methods: {
    async onSubmit() {
      this.isLoading = true;

      const data = {
        userId: this.details._id,
        firstname: titleCase(this.firstname),
        lastname: titleCase(this.lastname),
        email: this.email.trim(),
        cellPhone: this.cellPhone?.trim() ? this.cellPhone.trim() : undefined,
        updated: Date.now(),
      };

      // Terminate if no changes made to profile
      if (!this.newChanges(this.details, data)) {
        Notify.create({
          type: "warning",
          message: "No changes to update.",
          group: false,
        });
        this.isLoading = false;
        return;
      }

      // Update word by adding second meaning
      await uUser(data)
        .then((res) => {
          Notify.create({
            type: "positive",
            message: "Success! Profile updated successfully.",
            group: false,
          });

          this.isLoading = false;
          this.$emit("profileUpdated", true);
        })
        .catch((error) => {
          Notify.create({
            type: "negative",
            message: "Something went wrong while updating word.",
            group: false,
          });
          this.isLoading = false;
        });
    },

    validateEmail,
    validateMobile,

    clearForm() {
      this.fullname = null;
    },

    // Find out if new changes on profile have been made on the form
    newChanges(oldProfile, newProfile) {
      if (
        oldProfile?.firstname !== newProfile?.firstname ||
        oldProfile?.lastname !== newProfile?.lastname ||
        oldProfile?.cellPhone !== newProfile?.cellPhone
      ) {
        return true;
      }
      return false;
    },
  },
});
</script>

<style lang="scss" scoped>
@media only screen and (max-width: 575px) {
  //
}
</style>
