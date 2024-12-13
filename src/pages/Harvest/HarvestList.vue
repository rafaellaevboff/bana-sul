<template>
  <v-container>
    <h1 class="display-1 text-center mb-4">Colheitas</h1>

    <v-row v-if="loading" class="d-flex justify-center align-center" style="height: 80vh;">
      <v-progress-circular indeterminate color="primary" size="64" class="ma-auto"/>
    </v-row>

    <div v-if="!loading">
      <v-text-field v-model="search" label="Buscar colheitas" class="mb-4" clearable rounded variant="outlined"
                    density="compact"/>

      <v-data-table :headers="headers" :items="filteredPayments" :items-per-page="10" class="elevation-1" item-key="id"
                    no-data-text="Nenhuma colheita cadastrada">
        <template v-slot:[`item.total`]="{ item }">
          R$ {{ item.total }}
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon @click.stop="openUpdate(item)" color="blue">mdi-pencil</v-icon>
          <v-icon @click="openDelete(item)" color="red" small>mdi-delete</v-icon>
        </template>
      </v-data-table>

    </div>

    <dialog-update-harvest v-model="openDialogUpdate" :item="selectedHarvest" @editConfirmed="handleUpdateNotebook"/>

    <dialog-delete v-model="openDialogDelete" :item="selectedHarvest?.agricultor"
                   @deleteConfirmed="handleDeleteHarvest"/>

    <feedback-message v-model="snackbar" :message="message" :color="color"/>

  </v-container>
</template>

<script setup>
import {computed, onMounted, ref} from "vue";
import DialogDelete from "@/components/DialogDelete.vue";
import FeedbackMessage from "@/components/FeedbackMessage.vue";
import {deleteItem, getItemById, getItens} from "@/services/essentialFunctions";
import {format} from "date-fns";
import {useShowMessage} from "@/composables/useShowMessage";
import DialogUpdateHarvest from "@/components/DialogsUpdate/DialogUpdateHarvest.vue";
import {updateHarvest} from "@/services/harvestService";

const {snackbar, color, message, showMessage} = useShowMessage();

const history = ref([]);
const search = ref("");
const loading = ref(true);
const headers = ref([
    {title: "Agricultor", key: "agricultor", align: 'center'},
    {title: "Quantidade Prata 1ª", key: "prataPrimeira", align: 'center'},
    {title: "Quantidade Prata 2ª", key: "prataSegunda", align: 'center'},
    {title: "Quantidade Caturra 1ª", key: "caturraPrimeira", align: 'center'},
    {title: "Quantidade Caturra 2ª", key: "caturraSegunda", align: 'center'},
    {title: "Total", key: "total", align: 'center'},
    {title: "Data", key: "data", align: 'center'},
    {title: "", key: "actions", sortable: false, align: 'end'}
]);

let openDialogDelete = ref(false);
let openDialogUpdate = ref(false);
let selectedHarvest = ref(null);

onMounted(async () => {
    try {
        loading.value = true;
        await loadHarvests();
    } catch (error) {
        console.error("Erro ao carregar lista de colheitas:", error);
    } finally {
        loading.value = false;
    }
});

const filteredPayments = computed(() => {
    return history.value.filter((item) =>
        item.agricultor.toLowerCase().includes(search.value.toLowerCase())
    );
});

const loadHarvests = async () => {
    try {
        const harvests = await getItens("colheita");
        history.value = await Promise.all(
            harvests.map(async harvest => {
                const notebook = await getItemById("cadernos", harvest.caderno);
                const formattedDate = ref(format(new Date(harvest.dataCadastro.seconds * 1000 + harvest.dataCadastro.nanoseconds / 1e6), 'dd/MM/yyyy'));

                return {
                    id: harvest.id,
                    agricultor: notebook.nome,
                    prataPrimeira: harvest.quantidade.find(qtd => qtd.key === 'prataPrimeira').value,
                    prataSegunda: harvest.quantidade.find(qtd => qtd.key === 'prataSegunda').value,
                    caturraPrimeira: harvest.quantidade.find(qtd => qtd.key === 'caturraPrimeira').value,
                    caturraSegunda: harvest.quantidade.find(qtd => qtd.key === 'caturraSegunda').value,
                    total: harvest.total,
                    data: formattedDate,
                    actions: null
                };
            })
        );
    } catch (error) {
        console.error("Erro ao carregar colheitas:", error);
    }
};
const openUpdate = (item) => {
    selectedHarvest.value = item;
    openDialogUpdate.value = true;
};

const openDelete = (item) => {
    selectedHarvest.value = item;
    selectedHarvest.value.nome = item.agricultor;
    openDialogDelete.value = true;
};

const handleDeleteHarvest = async () => {
    try {
        await deleteItem("colheita", selectedHarvest.value.id);
        showMessage('Dado excluído com sucesso.', 'green');
    } catch (error) {
        showMessage(`Erro ao excluir dado. ${error}.`, 'green');
    } finally {
        await loadHarvests();
    }
};

const handleUpdateNotebook = (async (updatedItem) => {
    try {
        await updateHarvest(updatedItem);
        showMessage('Colheita editada', 'green');

    } catch (error) {
        showMessage('Erro ao editar a colheita.', 'red');
        console.error("Erro ao editar a colheita:", error);
    } finally {
        await loadHarvests();
    }
});
</script>

<style scoped>
</style>
