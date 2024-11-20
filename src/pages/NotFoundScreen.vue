<template>
  <v-container class="fill-height">
    <v-row
            class="d-flex align-center justify-center text-center fill-height"
    >
      <v-col cols="12">
        <v-icon size="128" color="primary">mdi-emoticon-sad-outline</v-icon>
        <h1 class="display-1">404</h1>
        <p class="subtitle-1">
          Oops! A página que você está procurando não existe.
        </p>
        <v-btn
                color="primary"
                variant="outlined"
                size="large"
                to="/"
        >
          Voltar para a Home
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { VContainer, VRow, VCol, VIcon, VBtn } from "vuetify/components";
</script>

<style scoped>
.fill-height {
    height: 100vh; /* Ocupa toda a altura da tela */
}
</style>
