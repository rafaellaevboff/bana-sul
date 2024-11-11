<template>
  <v-container>
    <h1 class="display-1 text-center">Cadernos</h1>

    <v-text-field v-model="search" label="Buscar caderno" class="mb-4" clearable rounded variant="outlined" density="compact"/>

    <v-row>
      <v-col
              v-for="(item, index) in filteredCards"
              :key="index" cols="12" sm="6" md="3"
      >
        <v-card class="d-flex flex-column justify-space-between pa-4" min-height="200px">
          <v-card-title>{{ item.name }}</v-card-title>

          <v-card-actions class="justify-space-between">
            <v-btn @click="openNotebook(item)">Abrir</v-btn>

            <div>
              <v-icon @click="openUpdate(item)" color="blue">mdi-pencil</v-icon>
              <v-icon @click="openDelete(item)" color="red">mdi-delete</v-icon>
            </div>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <dialog-delete v-model="openDialogDelete" :item="selectedNotebook" @deleteConfirmed="handleDeleteNotebook"/>

    <dialog-update-notebook v-model="openDialogUpdate" :item="selectedNotebook" @editConfirmed="handleEditNotebook"/>
  </v-container>
</template>

<script setup>
import {computed, onMounted, ref} from "vue";
import DialogDelete from "@/components/DialogDelete.vue";
import DialogUpdateNotebook from "@/components/DialogUpdateNotebook.vue";
import router from "@/router";
import {deleteItem, getItens} from "@/services/essentialFunctions";
import {updateNotebook} from "@/services/notebookService";

const cards = ref([]);
const search = ref("");
let openDialogDelete = ref(false)
const openDialogUpdate = ref(false)
const selectedNotebook = ref(null);

const snackbar = ref(false);
const color = ref('');
const message = ref('');

onMounted(async () => {
    try {
        await loadNotebooks()
    } catch (error) {
        console.error("Erro ao carregar cadernos:", error);
    }
});

const filteredCards = computed(() => {
    return cards.value.filter((item) =>
        item.name.toLowerCase().includes(search.value.toLowerCase())
    );
});

const loadNotebooks = async () => {
    cards.value = await getItens('cadernos');
}

const openNotebook = ( (item) => {
    router.push(`/app/cadernoAgricultor/${item.id}`);
})


const openUpdate = ( (item) => {
    selectedNotebook.value = item;
    openDialogUpdate.value = true
})

const handleEditNotebook = ((updatedItem) => {
    try {
        console.log("updated: ", updatedItem)
        updateNotebook(updatedItem)
    } catch (error){
        console.error("Erro ao editar o caderno:", error);
    } finally {
        loadNotebooks()
    }
})

const openDelete = (async (item) => {
    selectedNotebook.value = item
    openDialogDelete.value = true
})

const handleDeleteNotebook = ( () => {
    try {
        deleteItem("cadernos", selectedNotebook.value.id);
        showMessage('Caderno selecionado foi excluído com sucesso.','green');
    } catch (error) {
        showMessage(`Erro ao excluir o caderno: ${error}`,'green');
        console.error("Erro ao excluir o caderno:", error);
    } finally {
        loadNotebooks()
    }
})

const showMessage = (msg, colorFeedback) => {
    message.value = msg;
    color.value = colorFeedback;
    snackbar.value = true;
};
</script>

<style scoped>
</style>
