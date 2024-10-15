<template>
  <v-container>
    <h1 class="display-1 text-center">Histórico de preços de banana</h1>
    <v-data-table :headers="headers.value" :items="history" :items-per-page="5"
            class="elevation-1" item-key="id"/>
  </v-container>
</template>

<script setup>
import {onMounted, ref} from "vue";
import {getBananasPrice} from "@/services/bananaPriceService";
import {formatDate} from "@/services/formatService";

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
        const prices = await getBananasPrice();

        history.value = prices.map(price => ({
            dataInicio: formatDate(price.dataInicio),
            dataFim: formatDate(price.dataFim),
            prataPrimeira: price.prataPrimeira,
            prataSegunda: price.prataSegunda,
            caturraPrimeira: price.caturraPrimeira,
            caturraSegunda: price.caturraSegunda
        }));
    } catch (error) {
        console.error("Erro ao carregar histórico:", error);
    }
});
</script>

<style scoped>
</style>
