<template>
  <div class="container">
    <h1>Compras de insumos</h1>

    <v-data-table :headers="headers" :items="itens" class="table" item-value="id"
                  loading-text="Carregando itens..." :loading="isLoading">
      <template v-slot:[`item.status`]="{ item }">
        {{ item.status }}
      </template>
    </v-data-table>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import {getPurchaseAgriculturalInputsByNotebook} from "@/services/agriculturalInputsService";
import {useRoute} from "vue-router";

const itens = ref([]);
const isLoading = ref(true);
const route = useRoute();

const id = route.params.id

const headers = [
    {title: 'Item', key: 'nomeInsumo'},
    {title: 'Quantidade', key: 'quantidade'},
    {title: 'Valor Total', key: 'valorTotal'},
    {title: 'Data', key: 'dataEfetuacao'},
    {title: 'Status', key: 'status'},
];

onMounted(async () => {
    await loadItens();
    isLoading.value = false;
});


const loadItens = async () => {
    const rawItens = await getPurchaseAgriculturalInputsByNotebook(id);
    itens.value = rawItens.map(item => ({
        ...item
    }));
};
</script>

<style scoped>
.container {
    max-width: 800px;
    margin: 0 auto;
}

.table {
    margin-top: 20px;
}
</style>
