<template>
  <v-container>
    <h1 class="display-1 text-center">Histórico de preços de banana</h1>
    <v-data-table :headers="headers.value" :items="history" :items-per-page="10" class="elevation-1" item-key="id">
    <template v-slot:[`item.actions`]="{ item }">
      <v-icon @click="openUpdate(item)" color="primary" small>mdi-pencil</v-icon>
      <v-icon @click="openDelete(item)" color="red" small>mdi-delete</v-icon>
    </template>
    </v-data-table>

    <dialog-delete v-model="openDialogDelete" :item="selectedPrice" @deleteConfirmed="handleDeleteNotebook"/>

    <dialog-update-prices v-model="openDialogUpdate" :item="selectedPrice" @editConfirmed="handleEditPrices"/>

    <feedback-message v-model="snackbar" :message="message" :color="color"/>

  </v-container>
</template>

<script setup>
import {onMounted, ref} from "vue";
import {formatDate} from "@/services/formatService";
import DialogDelete from "@/components/DialogDelete.vue";
import FeedbackMessage from "@/components/FeedbackMessage.vue";
import {deleteItem, getItens} from "@/services/essentialFunctions";
import {useShowMessage} from "@/composables/useShowMessage";
import DialogUpdatePrices from "@/components/DialogsUpdate/DialogUpdatePrices.vue";
import {updatePrice} from "@/services/bananaPriceService";

const { snackbar, color, message, showMessage } = useShowMessage();

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
let openDialogUpdate = ref(false);
let selectedPrice = ref(null);


onMounted(async () => {
    await loadPrices();
});

const loadPrices = async () => {
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

const openDelete = (item) => {
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
        loadPrices();
    }
};

const openUpdate =  (item) => {
    selectedPrice.value = item;
    openDialogUpdate.value = true;
};

const handleEditPrices = async (updatedItem) => {
    try {
        await updatePrice(updatedItem)
    } catch (error) {
        console.error("Erro ao editar o preço:", error);
    } finally {
        await loadPrices()
    }
}
</script>

<style scoped>
</style>
