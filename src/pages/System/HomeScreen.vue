<template>
  <v-container>
    <v-row class="mb-4">
      <v-col>
        <h1 v-text="`Bem vindo!`"/>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <BananaPrices/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import BananaPrices from "@/components/BananaPrices.vue";


</script>

<style scoped>
h1 {
    text-align: center;
}
</style>
