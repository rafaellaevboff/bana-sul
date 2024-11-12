<template>
  <v-container>
    <h1 class="display-1 text-center">Insumos cadastrados</h1>
    <v-data-table :headers="headers.value" :items="history" :items-per-page="10" class="elevation-1" item-key="id">
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon @click="edit(item)" color="primary" small>mdi-pencil</v-icon>
        <v-icon @click="openDelete(item)" color="red" small>mdi-delete</v-icon>
      </template>
    </v-data-table>

    <dialog-delete v-model="openDialogDelete" :item="selectedInput" @deleteConfirmed="handleDeleteInput"/>

    <feedback-message v-model="snackbar" :message="message" :color="color"/>

  </v-container>
</template>

<script setup>
import {onMounted, ref} from "vue";
import DialogDelete from "@/components/DialogDelete.vue";
import FeedbackMessage from "@/components/FeedbackMessage.vue";
import {deleteItem, getItens} from "@/services/essentialFunctions";
import {useShowMessage} from "@/composables/useShowMessage";

const { snackbar, color, message, showMessage } = useShowMessage();

const history = ref([]);
const headers = ref([
    { text: "Nome", value: "nome" },
    { text: "Descrição", value: "descricao" },
    { text: "Preço", value: "valor" },
    { text: "Ações", value: "actions", sortable: false }
]);

let openDialogDelete = ref(false);
let selectedInput = ref(null);

onMounted(async () => {
    await loadInputs();
});

const loadInputs = async () => {
    try {
        const agriculturalInputs = await getItens("insumos");
        history.value = agriculturalInputs.map(input => ({
            nome: input.nome,
            descricao: input.descricao,
            valor: input.valor,
            actions: null
        }));
    } catch (error) {
        console.error("Erro ao carregar insumos:", error);
    }
};

const edit = (item) => {
    console.log("Edit input with ID:", item.id);
};

const openDelete = (item) => {
    selectedInput.value = item;
    openDialogDelete.value = true;
};

const handleDeleteInput = () => {
    try {
        deleteItem("insumos", selectedInput.value.id);
        showMessage('Dado excluído com sucesso.', 'green');
    } catch (error) {
        showMessage(`Erro ao excluir dado. ${error}.`, 'green');
    } finally {
        loadInputs();
    }
};
</script>

<style scoped>
</style>
