<template>
  <v-container fluid>
    <v-row class="center" >
      <v-col cols="12" align-self="center">
        <v-icon size="128" color="primary">mdi-emoticon-sad-outline</v-icon>
        <h1 class="display-1">404</h1>
        <p class="subtitle-1">Ops! A página que você está procurando não existe.</p>
        <v-btn color="primary" variant="outlined" size="large" to="/">Voltar para a Home</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { VContainer, VRow, VCol, VIcon, VBtn } from "vuetify/components";
</script>

<style>
html, body {
    height: 100%;
    margin: 0;
}

.center {
    height: 90vh;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
