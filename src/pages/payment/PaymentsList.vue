<template>
  <v-container>
    <h1 class="display-1 text-center mb-4">Pagamentos cadastrados</h1>

    <v-row v-if="loading" class="d-flex justify-center align-center" style="height: 80vh;">
      <v-progress-circular indeterminate color="primary" size="64" class="ma-auto"/>
    </v-row>

    <div v-if="!loading">
      <v-text-field v-model="search" label="Buscar caderno" class="mb-4" clearable rounded variant="outlined"
                    density="compact"/>

      <v-data-table :headers="headers" :items="filteredPayments" :items-per-page="10" class="elevation-1" item-key="id"
                    no-data-text="Nenhum pagamento cadastrado">
        <template v-slot:[`item.valor`]="{ item }">
          R$ {{ item.valor }}
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon @click="openUpdate(item)" color="blue">mdi-pencil</v-icon>
          <v-icon @click="openDelete(item)" color="red" small>mdi-delete</v-icon>
        </template>
      </v-data-table>
    </div>

    <dialog-update-payment v-model="openDialogUpdate" :item="selectedPayment" @editConfirmed="handleUpdateNotebook"/>

    <dialog-delete v-model="openDialogDelete" :item="selectedPayment?.agricultor"
                   @deleteConfirmed="handleDeleteSupply"/>

    <feedback-message v-model="snackbar" :message="message" :color="color"/>

  </v-container>
</template>

<script setup>
import {computed, onMounted, ref} from "vue";
import DialogDelete from "@/components/DialogDelete.vue";
import FeedbackMessage from "@/components/FeedbackMessage.vue";
import {deleteItem, getItens} from "@/services/essentialFunctions";
import {format} from "date-fns";
import {useShowMessage} from "@/composables/useShowMessage";
import DialogUpdatePayment from "@/components/DialogsUpdate/DialogUpdatePayment.vue";
import {updatePayment} from "@/services/paymentService";

const {snackbar, color, message, showMessage} = useShowMessage();

const history = ref([]);
const search = ref("");
const headers = ref([
    {title: "Agricultor", key: "agricultor", align: 'start'},
    {title: "Valor", key: "valor", align: 'end'},
    {title: "Data", key: "data", align: 'end'},
    {title: "", key: "actions", sortable: false, align: 'end'}
]);

const loading = ref(true);

let openDialogDelete = ref(false);
let selectedPayment = ref(null);
const openDialogUpdate = ref(false);

onMounted(async () => {
    try {
        loading.value = true;
        await loadPayments();
    } catch (error) {
        console.error("Erro ao carregar lista de pagamentos:", error);
    } finally {
        loading.value = false;
    }
});

const openUpdate = ((item) => {
    selectedPayment.value = item;
    openDialogUpdate.value = true;
})

const handleUpdateNotebook = (async (updatedItem) => {
    try {
        await updatePayment(updatedItem);
        showMessage('Pagamento editado', 'green');

    } catch (error) {
        showMessage('Erro ao editar o pagamento.', 'red');
        console.error("Erro ao editar o pagamento:", error);
    } finally {
        await loadPayments();
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
                const formattedDate = ref(format(new Date(payment.dataCadastro.seconds * 1000 + payment.dataCadastro.nanoseconds / 1e6), 'dd/MM/yyyy'));
                return {
                    id: payment.id,
                    agricultor: payment.agricultor,
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

const handleDeleteSupply = async () => {
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
