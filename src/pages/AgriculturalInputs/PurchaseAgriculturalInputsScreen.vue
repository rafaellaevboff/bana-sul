<template>
  <v-container fluid>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="10" md="8" lg="6">
        <h1 class="display-1 text-center">Compra de Insumos</h1>

        <v-form v-if="!loading" @submit.prevent="addPurchaseAgriculturalInput">
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-select label="Selecione o Caderno" :items="notebooks" v-model="notebookSelected"
                          no-data-text="Nenhum caderno disponível."
                          item-title="nome" item-value="id" required rounded variant="outlined"/>
              </v-col>


              <v-col cols="12">
                <v-select label="Selecione o Insumo" :items="agriculturalInputs" v-model="agriculturalInputSelected"
                          no-data-text="Nenhum insumo disponível."
                          item-title="nome" item-value="id" required rounded variant="outlined"/>
              </v-col>

              <v-col cols="12">
                <v-text-field label="Data da compra" type="date" v-model="purchaseDate" required
                              rounded variant="outlined" density="compact"/>
              </v-col>

              <v-col cols="12">
                <v-text-field :label="'Quantidade'" type="number" :min="1" v-model="quantity" required
                              rounded variant="outlined" density="compact"/>
              </v-col>

              <v-row>
                <v-col cols="6">
                  <v-checkbox :label="'Descontado no Caderno'" v-model="descontadoCaderno"/>
                </v-col>

                <v-col cols="6" v-if="descontadoCaderno === false">
                  <v-checkbox :label="'Pago em dinheiro'" v-model="pago"/>
                </v-col>
              </v-row>

              <v-col cols="12">
                <v-btn type="submit" class="mt-4 bg-primary" rounded :style="{ width: '30%' }">
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
import {getAgriculturalInputs, newPurchaseAgriculturalInput} from "@/services/agriculturalInputsService";
import FeedbackMessage from "@/components/FeedbackMessage.vue";
import {getItemById, getItens} from "@/services/essentialFunctions";
import {useShowMessage} from "@/composables/useShowMessage";

const { snackbar, color, message, showMessage } = useShowMessage();

const notebooks = ref([]);
const notebookSelected = ref(null);
const purchaseDate = ref(null);

const agriculturalInputs = ref([]);
const agriculturalInputSelected = ref(null);

const quantity = ref(null);
const descontadoCaderno = ref(false);
let pago = ref(false);
let loading = ref(true);

onMounted(async () => {
    try {
        await getNotebooksDb();
        await getAgriculturalInputsDb();
    } catch (error) {
        showMessage(`Erro ao buscar cadernos e insumos:", ${error}`, 'green');
        console.error("Erro ao buscar cadernos e insumos:", error);
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
}

const getAgriculturalInputsDb = async () => {
    try {
        const inputsData = await getAgriculturalInputs();

        agriculturalInputs.value = inputsData.map(input => ({
            id: input.id,
            nome: input.nome,
            valor: input.valor,
            descontadoCaderno: input.descontadoCaderno,
            pago: input.pago
        }));
    } catch (error) {
        showMessage(`Erro ao buscar insumos: ${error}`, 'red');
    }
}

const addPurchaseAgriculturalInput = async () => {
    if (notebookSelected.value === null || !purchaseDate.value || agriculturalInputSelected.value === null || !quantity.value) {
        showMessage('Todos os campos devem estar preenchidos.', 'red');
        return;
    }

    const valorTotal = await calculaValorTotal()

    if (descontadoCaderno.value === true) pago.value = false;
    await newPurchaseAgriculturalInput(notebookSelected.value, agriculturalInputSelected.value, purchaseDate.value, quantity.value,
        parseFloat(valorTotal), descontadoCaderno.value, pago.value);
    showMessage("Compra cadastrada com sucesso", "green");
    await resetVariables()
}

const calculaValorTotal = async () => {
    const priceAgriculturalInputs = await getItemById('insumos', agriculturalInputSelected.value);
    return priceAgriculturalInputs.valor * quantity.value;
}

const resetVariables = async () => {
    notebookSelected.value = null;
    agriculturalInputSelected.value = null;
    purchaseDate.value = null;
    quantity.value = null;
    descontadoCaderno.value = false;
    pago.value = false;
}
</script>

<style scoped>
h1 {
    margin-bottom: 20px;
}
</style>
