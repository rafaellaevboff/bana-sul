<template>
  <v-container>
    <h1 class="display-1 text-center">Usuários cadastrados</h1>
    <v-data-table :headers="headers" :items="history" :items-per-page="10" class="elevation-1" item-key="id">
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon @click="openUpdate(item)" color="primary" small>mdi-pencil</v-icon>
      </template>
    </v-data-table>

    <dialog-update-user v-model="openDialogUpdate" :item="selectedUser" @editConfirmed="handleUpdateUser"/>

    <feedback-message v-model="snackbar" :message="message" :color="color"/>

  </v-container>
</template>

<script setup>
import {onMounted, ref} from "vue";
import FeedbackMessage from "@/components/FeedbackMessage.vue";
import {getItens} from "@/services/essentialFunctions";
import {useShowMessage} from "@/composables/useShowMessage";
import DialogUpdateUser from "@/components/DialogsUpdate/DialogUpdateUser.vue";
import {updateUser} from "@/services/userService";

const { snackbar, color, message, showMessage } = useShowMessage();

const history = ref([]);
const headers = ref([
    { title: "Nome", key: "nome", align: 'start' },
    { title: "Email", key: "email", align: 'end' },
    { title: "", key: "actions", sortable: false, align: 'end' }
]);

let openDialogUpdate = ref(false);
let selectedUser = ref(null);

onMounted(async () => {
    await loadUsers();
});

const loadUsers = async () => {
    try {
        const users = await getItens("usuarios");
        history.value = users.map(input => ({
            nome: input.nome,
            email: input.email,
            id: input.id,
            actions: null
        }));
    } catch (error) {
        console.error("Erro ao carregar usuários:", error);
    }
};

const openUpdate = (item) => {
    selectedUser.value = item;
    openDialogUpdate.value = true;
};

const handleUpdateUser = async (updatedItem) => {
    try {
        await updateUser(updatedItem)
        showMessage('Usuário editado', 'green');
    } catch (error) {
        showMessage('Erro ao editar o usuário.', 'red');
        console.error("Erro ao editar o usuário:", error);
    } finally {
        await loadUsers()
    }
};

</script>

<style scoped>
</style>
