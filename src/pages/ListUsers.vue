<template>
  <v-container>
    <h1 class="display-1 text-center">Usuários cadastrados</h1>
    <v-data-table :headers="headers.value" :items="history" :items-per-page="10" class="elevation-1" item-key="id">
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon @click="edit(item)" color="primary" small>mdi-pencil</v-icon>
        <v-icon @click="openDelete(item)" color="red" small>mdi-delete</v-icon>
      </template>
    </v-data-table>

    <dialog-delete v-model="openDialogDelete" :item="selectedUser" @deleteConfirmed="handleDelete"/>

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
    { text: "Email", value: "email" },
    { text: "Ações", value: "actions", sortable: false }
]);

let openDialogDelete = ref(false);
let selectedUser = ref(null);

onMounted(async () => {
    await loadUsers();
});

const loadUsers = async () => {
    try {
        const users = await getItens("usuarios");
        console.log("history: ", history)
        history.value = users.map(input => ({
            nome: input.nome,
            email: input.email,
            actions: null
        }));
    } catch (error) {
        console.error("Erro ao carregar usuários:", error);
    }
};

const openDelete = (item) => {
    selectedUser.value = item;
    openDialogDelete.value = true;
};

const handleDelete = () => {
    try {
        deleteItem("usuarios", selectedUser.value.id);
        showMessage('Dado excluído com sucesso.', 'green');
    } catch (error) {
        showMessage(`Erro ao excluir dado. ${error}.`, 'green');
    } finally {
        loadUsers();
    }
};
</script>

<style scoped>
</style>
