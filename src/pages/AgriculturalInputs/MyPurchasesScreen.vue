<template>
  <div class="container">
    <h1>Lista de Itens</h1>

    <table v-if="itens && itens.length > 0" class="table">
      <thead>
      <tr>
        <th>Item</th>
        <th>Status</th>
        <th>Quantidade</th>
        <th>ValorTotal</th>
        <th>Data</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(item, index) in itens" :key="index">
        <td>{{ item.insumoNome }}</td>
        <td>{{ item.status }}</td>
        <td>{{ item.quantidade }}</td>
        <td>{{ item.valorTotal }}</td>
        <td>{{ item.dataCadastro }}</td>
      </tr>
      </tbody>
    </table>

    <div v-else class="loading">Carregando itens...</div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { getPurchaseAgriculturalInputsByNotebook, statusPurchaseInput } from '@/services/agriculturalInputsService';

const farmerNotebook = ref(null);
const itens = ref([]);

onMounted(async () => {
    await farmerNotebookDefinition();
    await loadItens();
});

const farmerNotebookDefinition = async () => {
    if (typeof window !== 'undefined' && window.localStorage) {
        farmerNotebook.value = localStorage.getItem('farmerNotebook');
    }
};

const loadItens = async () => {
    if (farmerNotebook.value) {
        itens.value = await getPurchaseAgriculturalInputsByNotebook(farmerNotebook);
        setStatusPurchases();
    }
};

const setStatusPurchases = async () => {
    if (itens.value && Array.isArray(itens.value)) {
        for (const item of itens.value) {
            item.status = await statusPurchaseInput(item);
        }
    }
};
</script>

<style scoped>
.container {
    max-width: 600px;
    margin: 0 auto;
}

.table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
}

th, td {
    padding: 10px;
    border: 1px solid #ddd;
}

.loading {
    text-align: center;
    font-size: 16px;
    color: #888;
    margin-top: 20px;
}
</style>
