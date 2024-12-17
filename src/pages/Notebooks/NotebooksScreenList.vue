<template>
  <v-container>
    <h1 class="display-1 text-center mb-4">Cadernos</h1>

    <v-row v-if="loading" class="d-flex justify-center align-center" style="height: 80vh;">
      <v-progress-circular indeterminate color="primary" size="64" class="ma-auto"/>
    </v-row>

    <v-text-field v-model="search" label="Buscar caderno" class="mb-4" clearable rounded variant="outlined" density="compact"/>

    <v-row>
      <v-col v-for="(item, index) in filteredCards" :key="index" cols="12" sm="6" md="3">
        <v-card class="d-flex flex-column justify-space-between pa-4" min-height="200px" @click="openNotebook(item)">
          <v-card-title>{{ item.nome }}</v-card-title>

          <v-card-actions class="justify-space-between">
            <v-btn @click="openNotebook(item)">Abrir</v-btn>

            <div>
              <v-icon @click.stop="openUpdate(item)" color="blue">mdi-pencil</v-icon>
              <v-icon @click.stop="openDelete(item)" color="red">mdi-delete</v-icon>
            </div>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <dialog-delete v-model="openDialogDelete" @deleteConfirmed="handleDeleteNotebook" :message="`O usuário e senha devem ser excluídos pelo suporte!\nVocê tem certeza que deseja excluir o item ${selectedNotebook?.nome}?`"/>

    <dialog-update-notebook v-model="openDialogUpdate" :item="selectedNotebook" @editConfirmed="handleUpdateNotebook"/>

    <feedback-message v-model="snackbar" :message="message" :color="color"/>
  </v-container>
</template>

<script setup>
import {computed, onMounted, ref} from "vue";
import DialogDelete from "@/components/DialogDelete.vue";
import DialogUpdateNotebook from "@/components/DialogsUpdate/DialogUpdateNotebook.vue";
import router from "@/router";
import {getItens} from "@/services/essentialFunctions";
import {deleteNotebook, updateNotebook} from "@/services/notebookService";
import {useShowMessage} from "@/composables/useShowMessage";
import FeedbackMessage from "@/components/FeedbackMessage.vue";

const { snackbar, color, message, showMessage } = useShowMessage();

const cards = ref([]);
const search = ref("");
let openDialogDelete = ref(false);
const openDialogUpdate = ref(false);
const selectedNotebook = ref(null);
const loading = ref(true);

onMounted(async () => {
    try {
        loading.value = true;
        await loadNotebooks()
    } catch (error) {
        console.error("Erro ao carregar cadernos:", error);
    }finally {
        loading.value = false;
    }
});

const filteredCards = computed(() => {
    return cards.value.filter((item) =>
        item.nome.toLowerCase().includes(search.value.toLowerCase())
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
    openDialogUpdate.value = true;
})

const handleUpdateNotebook = (async (updatedItem) => {
    try {
        await updateNotebook(updatedItem);
        showMessage('Notebook editado', 'green');

    } catch (error) {
        showMessage('Erro ao editar o caderno.', 'red');
        console.error("Erro ao editar o caderno:", error);
    } finally {
        await loadNotebooks();
    }
});

const openDelete = (async (item) => {
    selectedNotebook.value = item;
    openDialogDelete.value = true;
});

const handleDeleteNotebook = ( async () => {
    try {
        await deleteNotebook(selectedNotebook.value.id)
        showMessage('Caderno selecionado foi excluído com sucesso.','green');
    } catch (error) {
        showMessage(`Erro ao excluir o caderno: ${error}`,'green');
        console.error("Erro ao excluir o caderno:", error);
    } finally {
        await loadNotebooks();
    }
});
</script>

<style scoped>
.v-btn:hover {
    background-color: rgba(247, 208, 0, 0.06) !important;
}
</style>
