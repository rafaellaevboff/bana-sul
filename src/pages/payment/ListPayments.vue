<template>
  <v-container>
      <h1 class="display-1 text-center">Pagamentos cadastrados</h1>

    <v-text-field v-model="search" label="Buscar caderno" class="mb-4" clearable rounded variant="outlined" density="compact"/>

    <v-data-table :headers="headers" :items="filteredPayments" :items-per-page="10" class="elevation-1" item-key="id">
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon @click="openDelete(item)" color="red" small>mdi-delete</v-icon>
      </template>
    </v-data-table>

    <dialog-delete v-model="openDialogDelete" :item="selectedPayment" @deleteConfirmed="handleDeleteInput"/>

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

const { snackbar, color, message, showMessage } = useShowMessage();

const history = ref([]);
const search = ref("");
const headers = ref([
    { title: "Agricultor", key: "agricultor", align: 'start' },
    { title: "Valor", key: "valor", align: 'end' },
    { title: "Data", key: "data", align: 'end' },
    { title: "", key: "actions", sortable: false, align: 'end' }
]);

let openDialogDelete = ref(false);
let selectedPayment = ref(null);

onMounted(async () => {
    try {
        await loadPayments()
    } catch (error) {
        console.error("Erro ao carregar lista de pagamentos:", error);
    }
});

const filteredPayments = computed(() => {
    return history.value.filter((item) =>
        item.agricultor.toLowerCase().includes(search.value.toLowerCase())
    );
});

const loadPayments = async () => {
    try {
        const payments = await getItens("pagamentos");
        history.value = await Promise.all(
            payments.map(async payment => {
                const notebook = await getItemById("cadernos", payment.caderno);
                const formattedDate = ref(format(new Date(payment.dataCadastro.seconds * 1000 + payment.dataCadastro.nanoseconds / 1e6), 'dd/MM/yyyy'));

                return {
                    agricultor: notebook.nome,
                    valor: payment.valor,
                    data: formattedDate,
                    actions: null
                };
            })
        );
    } catch (error) {
        console.error("Erro ao carregar pagamentos:", error);
    }
};

const openDelete = (item) => {
    selectedPayment.value = item;
    selectedPayment.value.nome = item.agricultor;
    openDialogDelete.value = true;
};

const handleDeleteInput = async () => {
    try {
        await deleteItem("pagamentos", selectedPayment.value.id);
        showMessage('Dado excluído com sucesso.', 'green');
    } catch (error) {
        showMessage(`Erro ao excluir dado. ${error}.`, 'green');
    } finally {
        await loadPayments();
    }
};
</script>

<style scoped>
</style>
