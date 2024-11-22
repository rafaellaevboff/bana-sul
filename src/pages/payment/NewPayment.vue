<template>
  <v-container fluid>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="10" md="8" lg="6">
        <h1 class="display-1 text-center">Pagamento</h1>

        <v-form v-if="!loading" @submit.prevent="addPayment">
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-select label="Selecione o Caderno" :items="notebooks" v-model="notebookSelected"
                          item-title="nome" item-value="id" required rounded variant="outlined"/>
              </v-col>

              <v-col cols="12">
                <v-text-field label="Data da colheita" type="date" v-model="paymentDate" required
                              rounded variant="outlined" density="compact"/>
              </v-col>

              <v-col cols="12">
                <v-text-field :label="'Valor pago'" type="number" v-model="money" required
                              rounded variant="outlined" density="compact"/>
              </v-col>

              <v-col cols="12">
                <v-btn type="submit" :style="{ width: '30%' }" class="bg-primary" rounded>
                  Adicionar
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-col>
    </v-row>
    <feedback-message v-model="snackbar" :message="message" :color="color"/>
  </v-container>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import FeedbackMessage from "@/components/FeedbackMessage.vue";
import {getItens} from "@/services/essentialFunctions";
import {newPayment} from "@/services/paymentService";
import {useShowMessage} from '@/composables/useShowMessage';

const { snackbar, color, message, showMessage } = useShowMessage();

const notebooks = ref([]);
const notebookSelected = ref(null)
let paymentDate = ref(null);

const money = ref(null)
let loading = ref(true);

onMounted(async () => {
    try {
        await getNotebooksDb();
    } catch (error) {
        showMessage(`Erro ao buscar cadernos:", ${error}`, 'green');
        console.error("Erro ao buscar cadernos:", error);
    }
});

const getNotebooksDb = async () => {
    try {
        const notebooksData = await getItens('cadernos');
        loading.value = false;
        notebooks.value = notebooksData.map(notebook => ({
            id: notebook.id,
            nome: notebook.nome
        }));
    } catch (error) {
        showMessage(`Erro ao buscar cadernos: ${error}`, 'red');
    }
};

const addPayment = async () => {
    try {
        if (notebookSelected.value === null || !money.value || !paymentDate.value) {
            showMessage('Todos os campos devem estar preenchidos.', 'red');
            return;
        }
        await newPayment(notebookSelected.value, money.value, paymentDate.value);
        showMessage('Pagamento cadastrado com sucesso!', 'green');
    } catch (error) {
        showMessage(error, 'red')
    } finally {
        await resetVariables()
    }
};

const resetVariables = async () => {
    notebookSelected.value = null;
    money.value = null
    paymentDate.value = null
}

</script>

<style scoped>
h1 {
    margin-bottom: 20px;
}
</style>
