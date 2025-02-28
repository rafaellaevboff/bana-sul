<template>
  <v-container fluid>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="10" md="8" lg="6">
        <h1 class="display-1 text-center">Pagamento</h1>

        <v-progress-circular v-if="loading" indeterminate color="primary" class="my-4"/>

        <v-form v-if="!loading" @submit.prevent="addPayment">
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-select label="Selecione o Caderno" :items="notebooks" v-model="notebookSelected"
                          item-title="nome" required rounded variant="outlined" :return-object="true"/>
              </v-col>

              <v-col cols="12">
                <v-text-field label="Data do pagamento" type="date" v-model="paymentDate" required
                              rounded variant="outlined" density="compact"/>
              </v-col>

              <v-col cols="12">
                <field-value v-model="money" label="Valor Pago (R$)"/>
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
import FieldValue from "@/components/FieldValue.vue";

const { snackbar, color, message, showMessage } = useShowMessage();

const notebooks = ref([]);
const notebookSelected = ref(null)
let paymentDate = ref(null);

const money = ref(null)
let loading = ref(false);

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
      loading.value = true
        if (notebookSelected.value === null || !money.value || !paymentDate.value) {
            loading.value = false;
            showMessage('Todos os campos devem estar preenchidos.', 'red');
            return;
        }
        await newPayment(notebookSelected.value.id, notebookSelected.value.nome, parseFloat(money.value), paymentDate.value);
        showMessage('Pagamento cadastrado com sucesso!', 'green');
        await resetVariables();
    } catch (error) {
        showMessage(error, 'red');
    } finally{
      loading.value = false;
    }
};

const resetVariables = async () => {
    notebookSelected.value = null;
    money.value = ""
    paymentDate.value = null
}

</script>

<style scoped>
h1 {
    margin-bottom: 20px;
}
</style>
