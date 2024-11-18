<template>
  <div class="container">
    <h1>Minhas compras</h1>

    <v-data-table
            :headers="headers"
            :items="itens"
            class="table"
            item-value="id"
            loading-text="Carregando itens..."
            :loading="isLoading"
    >
      <template v-slot:[`item.status`]="{ item }">
        {{ item.status }}
      </template>
    </v-data-table>
  </div>
</template>

<script setup>
import {computed, onMounted, ref} from 'vue';
import {getPurchaseAgriculturalInputsByNotebook} from '@/services/agriculturalInputsService';

const itens = ref([]);
const isLoading = ref(true);

const headers = [
    { title: 'Item', key: 'nomeInsumo' },
    { title: 'Quantidade', key: 'quantidade' },
    { title: 'Valor Total', key: 'valorTotal' },
    { title: 'Data', key: 'dataCadastro' },
    { title: 'Status', key: 'status' },
];

onMounted(async () => {
    await loadItens();
    isLoading.value = false;
});

const farmerNotebook = computed(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
        return localStorage.getItem('farmerNotebook');
    }
    return null
});

const loadItens = async () => {
    if (farmerNotebook.value) {
        const rawItens = await getPurchaseAgriculturalInputsByNotebook(farmerNotebook.value);
        itens.value = rawItens.map(item => ({
            ...item,
        }));
        console.log("Itens processados: ", itens.value);
    }
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
