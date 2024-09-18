<template>
  <form-screen>
    <registration-form />
  </form-screen>
</template>

<script>
import RegistrationForm from "@/components/RegistrationForm.vue";
import FormScreen from "./FormScreen.vue";

export default {
  components: { RegistrationForm, FormScreen },
};
</script>

<style scoped></style>
