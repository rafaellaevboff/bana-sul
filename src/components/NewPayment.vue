<template>
  <v-container fluid>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="10" md="8" lg="6">
        <h1 class="display-1 text-center">Pagamento</h1>

        <v-form v-if="!loading" v-model="valid" @submit.prevent="addPurchaseAgriculturalInput">
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-select label="Selecione o Caderno" :items="notebooks" v-model="notebookSelected"
                          item-title="nome" item-value="id" required rounded variant="outlined"/>
              </v-col>

              <v-col cols="12">
                <v-text-field :label="'Valor pago'" type="number" v-model="valor" required
                              rounded variant="outlined" density="compact"/>
              </v-col>

              <v-row>

                <v-col cols="6">
                  <v-checkbox :label="'Descontado no Caderno'" v-model="descontadoCaderno"/>
                </v-col>

                <v-col cols="6" v-if="descontadoCaderno === false">
                  <v-checkbox :label="'Pago em dinheiro'" v-model="pago" required/>
                </v-col>
              </v-row>

              <v-col cols="12">
                <v-btn type="submit" class="mt-4 bg-primary" :disabled="!valid"  :style="{ width: '30%' }">
                  Adicionar
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-col>
    </v-row>
    <feedback-message v-model="snackbar" :message="'Compra cadastrada com sucesso!'" :color="'green'"/>
  </v-container>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import {getAgriculturalInputs, newPurchaseAgriculturalInput} from "@/services/agriculturalInputsService";
import FeedbackMessage from "@/components/FeedbackMessage.vue";
import {getItemById, getItens} from "@/services/essentialFunctions";

const notebooks = ref([]);
const notebookSelected = ref(null)

const agriculturalInputs = ref([]);
const agriculturalInputSelected = ref(null)

const quantity = ref(1)
const descontadoCaderno = ref(false)
let pago = ref(false)
const valid = ref(false);
let loading = ref(true);

const snackbar = ref(false);
const color = ref('');
const message = ref('');

onMounted(async () => {
    try {
        await getNotebooksDb()
        await getAgriculturalInputsDb()
    } catch (error) {
        message.value = `Erro ao buscar cadernos e insumos:", ${error}`
        color.value = 'green'
        snackbar.value = true;
        console.error("Erro ao buscar cadernos e insumos:", error);
    }
});


const getNotebooksDb = async () => {
    try {
        const notebooksData = await getItens('cadernos');
        loading.value = false;
        notebooks.value = notebooksData.map(notebook => ({
            id: notebook.id,
            nome: notebook.name
        }));
    } catch (error) {
        message.value = `Erro ao buscar cadernos: ${error}`
        color.value = 'red'
        snackbar.value = true;
    }
};

const getAgriculturalInputsDb = async () => {
    try {
        const inputsData = await getAgriculturalInputs();

        agriculturalInputs.value = inputsData.map(input => ({
            id: input.id,
            nome: input.name,
            valor: input.valor,
            descontadoCaderno: input.descontadoCaderno,
            pago: input.pago
        }));
    } catch (error) {
        message.value = `Erro ao buscar insumos: ${error}`
        color.value = 'red'
        snackbar.value = true;
    }
};

const addPurchaseAgriculturalInput = async () => {
    if (!notebookSelected.value || !agriculturalInputSelected.value || !quantity.value) {
        message.value = 'Todos os campos devem estar preenchidos.'
        color.value = 'red'
        snackbar.value = true;

        return;
    }

    if (descontadoCaderno.value === true) pago.value = false
    console.log("agriculturalInputSelected.value: ", agriculturalInputSelected.value)
    console.log("agriculturalInputSelected.value: ", quantity.value)
    const valorTotal = await calculaValorTotal()
    await newPurchaseAgriculturalInput(crypto.randomUUID(), agriculturalInputSelected.value, notebookSelected.value, quantity.value,
        valorTotal, descontadoCaderno.value, pago.value);
    snackbar.value = true;
};

const calculaValorTotal = async () => {
    const priceAgriculturalInputs = await getItemById("insumos", agriculturalInputSelected.value)
    console.log("priceAgriculturalInputs>: ", priceAgriculturalInputs)
    return priceAgriculturalInputs.valor * quantity.value
}

</script>

<style scoped>
h1 {
    margin-bottom: 20px;
}
</style>
