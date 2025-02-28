<template>
  <v-container>
    <h1 class="display-1 text-center mb-5">Histórico de preços de banana</h1>

    <v-row v-if="loading" class="d-flex justify-center align-center" style="height: 80vh;">
      <v-progress-circular indeterminate color="primary" size="64" class="ma-auto"/>
    </v-row>

    <v-data-table v-if="!loading" :headers="headers" :items="history" :items-per-page="10" class="elevation-1" item-key="id" no-data-text="Nenhum valor de caixa de banana cadastrado.">
      <template v-slot:[`item.prataPrimeira`]="{ item }">
        R$ {{ item.prataPrimeira }}
      </template>
      <template v-slot:[`item.prataSegunda`]="{ item }">
        R$ {{ item.prataSegunda }}
      </template>
      <template v-slot:[`item.caturraPrimeira`]="{ item }">
        R$ {{ item.caturraPrimeira }}
      </template>
      <template v-slot:[`item.caturraSegunda`]="{ item }">
      R$ {{ item.caturraSegunda }}
    </template>

      <template v-slot:[`item.actions`]="{ item }">
      <v-icon @click="openUpdate(item)" color="primary" small>mdi-pencil</v-icon>
      <v-icon @click="openDelete(item)" color="red" small>mdi-delete</v-icon>
    </template>
    </v-data-table>

    <dialog-delete v-model="openDialogDelete" :item="`${selectedPrice?.dataInicio} - ${selectedPrice?.dataFim}`" @deleteConfirmed="handleDeletePrice"/>

    <dialog-update-prices v-model="openDialogUpdate" :item="selectedPrice" @editConfirmed="handleUpdatePrices"/>

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
    { title: "Data Início", key: "dataInicio", align: 'start' },
    { title: "Data Fim", key: "dataFim", align: 'end' },
    { title: "Prata 1ª", key: "prataPrimeira", align: 'end' },
    { title: "Prata 2ª", key: "prataSegunda", align: 'end' },
    { title: "Caturra 1ª", key: "caturraPrimeira", align: 'end' },
    { title: "Caturra 2ª", key: "caturraSegunda", align: 'end' },
    { title: "", key: "actions", sortable: false, align: 'end' }
]);

let openDialogDelete = ref(false);
let openDialogUpdate = ref(false);
let selectedPrice = ref(null);
const loading = ref(true);

onMounted(async () => {
    await loadPrices();
});

const loadPrices = async () => {
    try {
        loading.value = true;
        const prices = await getItens('precosBanana');
        history.value = prices.map(price => ({
            id: price.id,
            dataInicio: formatDate(price.dataInicio),
            dataFim: formatDate(price.dataFim),
            prataPrimeira: price.prataPrimeira,
            prataSegunda: price.prataSegunda,
            caturraPrimeira: price.caturraPrimeira,
            caturraSegunda: price.caturraSegunda,
            actions: null
        }));
    } catch (error) {
        console.error("Erro ao carregar histórico:", error);
    } finally {
        loading.value = false;
    }
};

const openDelete = (item) => {
    selectedPrice.value = item;
    openDialogDelete.value = true;
};

const handleDeletePrice = async () => {
    try {
        loading.value = true;
        await deleteItem("precosBanana", selectedPrice.value.id);
        showMessage('Dado excluído com sucesso.', 'green');
    } catch (error) {
        showMessage(`Erro ao excluir dado. ${error}.`, 'green');
    } finally {
        await loadPrices();
        loading.value = false;
    }
};

const openUpdate =  (item) => {
    selectedPrice.value = item;
    openDialogUpdate.value = true;
};

const handleUpdatePrices = async (updatedItem) => {
    try {
        loading.value = true;
        await updatePrice(updatedItem)
        showMessage('Valor editado', 'green');
    } catch (error) {
        showMessage('Erro ao editar o preço.', 'red');
        console.error("Erro ao editar o preço:", error);
    } finally {
        await loadPrices()
        loading.value = false;
    }
}
</script>

<style scoped>
</style>
