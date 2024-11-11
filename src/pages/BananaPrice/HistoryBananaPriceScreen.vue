<template>
  <v-container>
    <h1 class="display-1 text-center">Histórico de preços de banana</h1>
    <v-data-table :headers="headers.value" :items="history" :items-per-page="10" class="elevation-1" item-key="id">
    <template v-slot:[`item.actions`]="{ item }">
      <v-icon @click="editPrice(item)" color="primary" small>mdi-pencil</v-icon>
      <v-icon @click="openDelete(item)" color="red" small>mdi-delete</v-icon>
    </template>
    </v-data-table>

    <dialog-delete v-model="openDialogDelete" :item="selectedPrice" @deleteConfirmed="handleDeleteNotebook"/>

    <feedback-message v-model="snackbar" :message="message" :color="color"/>

  </v-container>
</template>

<script setup>
import {onMounted, ref} from "vue";
import {formatDate} from "@/services/formatService";
import DialogDelete from "@/components/DialogDelete.vue";
import FeedbackMessage from "@/components/FeedbackMessage.vue";
import {deleteItem, getItens} from "@/services/essentialFunctions";

const history = ref([]);
const headers = ref([
    { text: "Data Início", value: "dataInicio" },
    { text: "Data Fim", value: "dataFim" },
    { text: "Prata 1ª", value: "prataPrimeira" },
    { text: "Prata 2ª", value: "prataSegunda" },
    { text: "Caturra 1ª", value: "caturraPrimeira" },
    { text: "Caturra 2ª", value: "caturraSegunda" },
    { text: "Ações", value: "actions", sortable: false }
]);

let openDialogDelete = ref(false);
let selectedPrice = ref(null);

const snackbar = ref(false);
const color = ref('');
const message = ref('');

onMounted(async () => {
    await loadNotebooks();
});

const loadNotebooks = async () => {
    try {
        const prices = await getItens('precosBanana');
        history.value = prices.map(price => ({
            dataInicio: formatDate(price.dataInicio),
            dataFim: formatDate(price.dataFim),
            prataPrimeira: price.prataPrimeira,
            prataSegunda: price.prataSegunda,
            caturraPrimeira: price.caturraPrimeira,
            caturraSegunda: price.caturraSegunda,
            id: price.id,
            actions: null
        }));
    } catch (error) {
        console.error("Erro ao carregar histórico:", error);
    }
};

const editPrice = (item) => {
    console.log("Edit price with ID:", item.id);
};

const openDelete = (item) => {
    console.log("Deleting price with ID:", item.id);
    selectedPrice.value = item;
    openDialogDelete.value = true;
};

const handleDeleteNotebook = () => {
    try {
        deleteItem("precosBanana", selectedPrice.value.id);
        showMessage('Dado excluído com sucesso.', 'green');
    } catch (error) {
        showMessage(`Erro ao excluir dado. ${error}.`, 'green');
    } finally {
        loadNotebooks();
    }
};

const showMessage = (msg, colorFeedback) => {
    message.value = msg;
    color.value = colorFeedback;
    snackbar.value = true;
};
</script>

<style scoped>
</style>
