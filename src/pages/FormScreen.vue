<template>
  <div class="bg-image">
    <v-container class="d-flex align-center justify-center fill-height">
      <v-row class="d-flex align-center justify-center">
        <v-col cols="12" md="6" lg="4" lass="d-flex justify-center">
          <slot/>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
</script>

<style scoped>
.bg-image {
  background-image: url("../assets/LoginImage.jpg");
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fill-height {
  height: 100%;
}
</style>
