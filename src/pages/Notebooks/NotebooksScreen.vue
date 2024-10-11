<template>
  <v-container>
    <h1 class="display-1 text-center">Cadernos</h1>

    <v-text-field v-model="search" label="Buscar caderno" class="mb-4" clearable/>

    <v-row>
      <v-col
              v-for="(item, index) in filteredCards"
              :key="index" cols="12" sm="6" md="3"
      >
        <v-card class="d-flex flex-column justify-space-between pa-4" min-height="200px">
          <v-card-title>{{ item.name }}</v-card-title>

          <v-card-actions class="justify-center">
            <v-btn>Abrir</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { getNotebooks } from "@/services/notebookService";
import { getFirestore } from "firebase/firestore";

const db = getFirestore();
const cards = ref([]);
const search = ref("");

onMounted(async () => {
    try {
        cards.value = await getNotebooks(db);
        console.log("Cards: ", cards.value);
    } catch (error) {
        console.error("Erro ao carregar cadernos:", error);
    }
});

const filteredCards = computed(() => {
    return cards.value.filter((item) =>
        item.name.toLowerCase().includes(search.value.toLowerCase())
    );
});
</script>

<style scoped>
</style>
