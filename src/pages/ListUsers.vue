<template>
  <v-container>
    <h1 class="display-1 text-center">Insumos cadastrados</h1>
    <v-data-table :headers="headers.value" :items="history" :items-per-page="10" class="elevation-1" item-key="id">
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon @click="edit(item)" color="primary" small>mdi-pencil</v-icon>
        <v-icon @click="openDelete(item)" color="red" small>mdi-delete</v-icon>
      </template>
    </v-data-table>

    <dialog-delete v-model="openDialogDelete" :item="selectedPrice" @deleteConfirmed="handleDeleteInput"/>

    <feedback-message v-model="snackbar" :message="message" :color="color"/>

  </v-container>
</template>

<script setup>
import {onMounted, ref} from "vue";
import DialogDelete from "@/components/DialogDelete.vue";
import FeedbackMessage from "@/components/FeedbackMessage.vue";
import {deleteItem} from "@/services/essentialFunctions";
import {getUsersAndEmailLogin} from "@/services/userService";
// import {getUsersAndEmailLogin} from "@/services/userService";

const history = ref([]);
const headers = ref([
    { text: "Nome", value: "nome" },
    { text: "Email", value: "descricao" },
    { text: "Ações", value: "actions", sortable: false }
]);

let openDialogDelete = ref(false);
let selectedPrice = ref(null);

const snackbar = ref(false);
const color = ref('');
const message = ref('');

onMounted(async () => {
    await loadUsers();
});

const loadUsers = async () => {
    try {
        const users = await getUsersAndEmailLogin("usuarios");
        history.value = users.map(input => ({
            nome: input.nome,
            email: input.email
        }));
    } catch (error) {
        console.error("Erro ao carregar usuários:", error);
    }
};

const openDelete = (item) => {
    selectedPrice.value = item;
    openDialogDelete.value = true;
};

const handleDeleteInput = () => {
    try {
        deleteItem("insumos", selectedPrice.value.id);
        showMessage('Dado excluído com sucesso.', 'green');
    } catch (error) {
        showMessage(`Erro ao excluir dado. ${error}.`, 'green');
    } finally {
        loadUsers();
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
