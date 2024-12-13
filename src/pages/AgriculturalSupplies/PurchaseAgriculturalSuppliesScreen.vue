<template>
  <v-container fluid>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="10" md="8" lg="6">
        <h1 class="display-1 text-center">Compra de Insumos</h1>

        <v-progress-circular v-if="loading" indeterminate color="primary" class="my-4"/>

        <v-form v-if="!loading" @submit.prevent="addPurchaseAgriculturalSupply">
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-select label="Selecione o Caderno" :items="notebooks" v-model="notebookSelected"
                          no-data-text="Nenhum caderno disponível."
                          item-title="nome" item-value="id" required rounded variant="outlined"/>
              </v-col>


              <v-col cols="12">
                <v-select label="Selecione o Insumo" :items="agriculturalSupplies" v-model="agriculturalSupplySelected"
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
                  <v-checkbox :label="'Descontado no Caderno'" v-model="deductedNotebook"/>
                </v-col>

                <v-col cols="6" v-if="deductedNotebook === false">
                  <v-checkbox :label="'Pago em dinheiro'" v-model="paid"/>
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
import {getAgriculturalSupplies} from "@/services/agriculturalSuppliesService";
import FeedbackMessage from "@/components/FeedbackMessage.vue";
import {getItemById, getItens} from "@/services/essentialFunctions";
import {useShowMessage} from "@/composables/useShowMessage";
import {newPurchaseAgriculturalSupply} from "@/services/purchaseSupply";

const { snackbar, color, message, showMessage } = useShowMessage();

const notebooks = ref([]);
const notebookSelected = ref(null);
const purchaseDate = ref(null);

const agriculturalSupplies = ref([]);
const agriculturalSupplySelected = ref(null);

const quantity = ref(null);
const deductedNotebook = ref(false);
let paid = ref(false);
let loading = ref(false);

onMounted(async () => {
    try {
        await getNotebooksDb();
        await getAgriculturalSuppliesDb();
    } catch (error) {
        showMessage(`Erro ao buscar cadernos e insumos:", ${error}`, 'green');
        console.error("Erro ao buscar cadernos e insumos:", error);
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
}

const getAgriculturalSuppliesDb = async () => {
    try {
        const SuppliesData = await getAgriculturalSupplies();

        agriculturalSupplies.value = SuppliesData.map(supply => ({
            ...supply
        }));
    } catch (error) {
        showMessage(`Erro ao buscar insumos: ${error}`, 'red');
    }
}

const addPurchaseAgriculturalSupply = async () => {
  try{
  loading.value = true
    if (notebookSelected.value === null || !purchaseDate.value || agriculturalSupplySelected.value === null || !quantity.value) {
        showMessage('Todos os campos devem estar preenchidos.', 'red');
        loading.value = false
        return;
    }

    const valorTotal = await calculaValorTotal()

    if (deductedNotebook.value === true) paid.value = false;
    await newPurchaseAgriculturalSupply(notebookSelected.value, agriculturalSupplySelected.value, purchaseDate.value, quantity.value,
        parseFloat(valorTotal), deductedNotebook.value, paid.value);
    showMessage("Compra cadastrada com sucesso", "green");
    await resetVariables()
  } catch(error){
      showMessage(error, 'red')
  } finally{
    loading.value = false
  }
}

const calculaValorTotal = async () => {
    const priceagriculturalSupplies = await getItemById('insumos', agriculturalSupplySelected.value);
    return priceagriculturalSupplies.valor * quantity.value;
}

const resetVariables = async () => {
    notebookSelected.value = null;
    agriculturalSupplySelected.value = null;
    purchaseDate.value = null;
    quantity.value = null;
    deductedNotebook.value = false;
    paid.value = false;
}
</script>

<style scoped>
h1 {
    margin-bottom: 20px;
}
</style>
