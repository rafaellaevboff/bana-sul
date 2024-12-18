<template>
  <v-container>
    <h1 class="display-1 text-center">Insumos cadastrados</h1>

    <v-row v-if="loading" class="d-flex justify-center align-center" style="height: 80vh;">
      <v-progress-circular indeterminate color="primary" size="64" class="ma-auto"/>
    </v-row>

    <v-text-field v-model="search" label="Buscar insumos" class="mb-4" clearable rounded variant="outlined" density="compact"/>

    <v-data-table :headers="headers" :items="filteredSupplies" :items-per-page="10" class="elevation-1" item-key="id" no-data-text="Nenhum insumo cadastrado">
      <template v-slot:[`item.valor`]="{ item }">
        R$ {{ item.valor }}
      </template>
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
import {computed, onMounted, ref} from "vue";
import DialogDelete from "@/components/DialogDelete.vue";
import FeedbackMessage from "@/components/FeedbackMessage.vue";
import {deleteItem, getItens} from "@/services/essentialFunctions";
import {useShowMessage} from "@/composables/useShowMessage";
import DialogUpdateAgriculturalSupply from "@/components/DialogsUpdate/DialogUpdateAgriculturalSupply.vue";
import {updateAgriculturalSupply} from "@/services/agriculturalSuppliesService";

const { snackbar, color, message, showMessage } = useShowMessage();

const history = ref([]);
const loading = ref(true);
const search = ref("");

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
        loading.value = true;
        const agriculturalSupplies = await getItens("insumos");
        history.value = agriculturalSupplies.map(supply => ({
            ...supply,
            valor: supply.valor
        }));
    } catch (error) {
        console.error("Erro ao carregar insumos:", error);
    } finally {
        loading.value = false;
    }
};

const filteredSupplies = computed(() => {
    return history.value.filter((item) =>
        item.nome.toLowerCase().includes(search.value.toLowerCase())
    );
});

const openUpdate = (item) => {
    selectedSupply.value = item;
    openDialogUpdate.value = true;
}

const handleUpdateSupply = async (updatedItem) => {
    try {
        loading.value = true;
        await updateAgriculturalSupply(updatedItem);
        showMessage('Insumo editado', 'green');
    } catch (error) {
        showMessage('Erro ao editar o insumo.', 'red');
        console.error("Erro ao editar o insumo:", error);
    } finally {
        await loadSupplies();
        loading.value = false;
    }
};

const openDelete = (item) => {
    selectedSupply.value = item;
    openDialogDelete.value = true;
};

const handleDeleteSupply = () => {
    try {
        loading.value = true;
        deleteItem("insumos", selectedSupply.value.id);
        showMessage('Dado excluído com sucesso.', 'green');
    } catch (error) {
        showMessage(`Erro ao excluir dado. ${error}.`, 'green');
    } finally {
        loadSupplies();
        loading.value = false;
    }
};
</script>

<style scoped>
</style>
