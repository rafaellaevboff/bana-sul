<template>
  <v-container>
    <h1 class="display-1 text-center">Histórico de preços de banana</h1>
    <v-data-table
            :headers="headers"
            :items="history"
            :items-per-page="5"
            class="elevation-1"
            item-key="dataInicio"
    >
    </v-data-table>
  </v-container>
</template>

<script setup>
import {ref, onMounted} from "vue";
import {getFirestore} from "firebase/firestore";
import {getBananasPrice} from "@/services/bananaPriceService";

const db = getFirestore();
const history = ref([]);
const headers = ref([
    {text: "Data Início", value: "dataInicio"},
    {text: "Data Fim", value: "dataFim"},
    {text: "Prata 1ª", value: "prataPrimeira"},
    {text: "Prata 2ª", value: "prataSegunda"},
    {text: "Caturra 1ª", value: "caturraPrimeira"},
    {text: "Caturra 2ª", value: "caturraSegunda"}
]);

onMounted(async () => {
    try {
        history.value = await getBananasPrice(db);
        console.log("Histórico: ", history.value);
    } catch (error) {
        console.error("Erro ao carregar histórico:", error);
    }
});
</script>

<style scoped>
</style>
