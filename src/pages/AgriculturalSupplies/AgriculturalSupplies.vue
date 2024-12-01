<template>
  <v-container>
    <h1 class="display-1 text-center">Insumos cadastrados</h1>
    <v-data-table :headers="headers" :items="history" :items-per-page="10" class="elevation-1" item-key="id" no-data-text="Nenhum insumo cadastrado">
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon @click="openUpdate(item)" color="primary" small>mdi-pencil</v-icon>
        <v-icon @click="openDelete(item)" color="red" small>mdi-delete</v-icon>
      </template>
    </v-data-table>

    <dialog-delete v-model="openDialogDelete" :item="selectedSupply?.nome" @deleteConfirmed="handleDeleteSupply"/>

    <dialog-update-agricultural-supply v-model="openDialogUpdate" :item="selectedSupply" @editConfirmed="handleUpdateSupply"/>

    <feedback-message v-model="snackbar" :message="message" :color="color"/>

  </v-container>
</template>

<script setup>
import {onMounted, ref} from "vue";
import DialogDelete from "@/components/DialogDelete.vue";
import FeedbackMessage from "@/components/FeedbackMessage.vue";
import {deleteItem, getItens} from "@/services/essentialFunctions";
import {useShowMessage} from "@/composables/useShowMessage";
import DialogUpdateAgriculturalSupply from "@/components/DialogsUpdate/DialogUpdateAgriculturalSupply.vue";
import {updateAgriculturalSupply} from "@/services/agriculturalSuppliesService";

const { snackbar, color, message, showMessage } = useShowMessage();

const history = ref([]);
const headers = ref([
    { title: "Nome", key: "nome", align: 'start' },
    { title: "Descrição", key: "descricao", align: 'end' },
    { title: "Preço", key: "valor", align: 'end' },
    { title: "", key: "actions", sortable: false, align: 'end' }
]);

let openDialogDelete = ref(false);
let openDialogUpdate = ref(false);
let selectedSupply = ref(null);

onMounted(async () => {
    await loadSupplies();
});

const loadSupplies = async () => {
    try {
        const agriculturalSupplies = await getItens("insumos");
        history.value = agriculturalSupplies.map(supply => ({
            ...supply,
            valor: `R$${supply.valor}`
        }));
    } catch (error) {
        console.error("Erro ao carregar insumos:", error);
    }
};

const openUpdate = (item) => {
    selectedSupply.value = item;
    openDialogUpdate.value = true;
}

const handleUpdateSupply = async (updatedItem) => {
    try {
        await updateAgriculturalSupply(updatedItem);
        showMessage('Insumo editado', 'green');
    } catch (error) {
        showMessage('Erro ao editar o insumo.', 'red');
        console.error("Erro ao editar o insumo:", error);
    } finally {
        await loadSupplies();
    }
};

const openDelete = (item) => {
    selectedSupply.value = item;
    openDialogDelete.value = true;
};

const handleDeleteSupply = () => {
    try {
        deleteItem("insumos", selectedSupply.value.id);
        showMessage('Dado excluído com sucesso.', 'green');
    } catch (error) {
        showMessage(`Erro ao excluir dado. ${error}.`, 'green');
    } finally {
        loadSupplies();
    }
};
</script>

<style scoped>
</style>
