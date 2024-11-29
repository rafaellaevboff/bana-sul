<template>
  <v-container v-if="isAdmin">
    <v-row justify="center">
      <v-col cols="12" md="8">
        <h1 class="display-1 text-center">Nova colheita</h1>

        <v-progress-circular v-if="loading" indeterminate color="primary" class="my-4"/>

        <v-form v-if="!loading" @submit.prevent="addBoxes">
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-select label="Selecione o Caderno" :items="notebooks" v-model="notebookSelected"
                          item-title="nome" item-value="id" required rounded variant="outlined"/>
              </v-col>

              <v-col cols="12">
                <v-text-field label="Data da colheita" type="date" v-model="harvestDate" required
                              rounded variant="outlined" density="compact"/>
              </v-col>

              <v-col cols="12" md="12" class="font-weight-bold"><p>Quantidade de caixas</p></v-col>

              <v-col v-for="(quantity, index) in quantities" :key="index" cols="12" md="6">
                <v-text-field :label="quantity.label" type="number"
                              :min="1" v-model="quantity.value" :disabled="!hasCurrentPrices"
                              @input="calculateTotal" required rounded variant="outlined" density="compact"/>
              </v-col>

              <v-col v-for="(total, key) in calculatedPrices" :key="key" cols="12" md="6">
                <p v-if="total !== null">Total {{ key }}: {{ total }}</p>
              </v-col>

              <v-col cols="12" v-if="grandTotal !== null">
                <v-alert type="info">Total Geral: {{ grandTotal }}</v-alert>
              </v-col>

              <v-col cols="12">
                <v-btn type="submit" class="mt-4 bg-primary" rounded>
                  Adicionar Caixas
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
import {computed, onMounted, ref, watch} from 'vue';
import {newHarvest} from "@/services/harvestService";
import {dateRegisteredPricesHarvest, getpricesDateHarvest} from "@/services/bananaPriceService";
import FeedbackMessage from "@/components/FeedbackMessage.vue";
import store from "@/store";
import {getItens} from "@/services/essentialFunctions";
import {useShowMessage} from "@/composables/useShowMessage";

const {snackbar, color, message, showMessage} = useShowMessage();

const notebooks = ref([]);
const quantities = ref([
    {key: 'prataPrimeira', label: 'Banana Prata 1ª', value: null},
    {key: 'prataSegunda', label: 'Banana Prata 2ª', value: null},
    {key: 'caturraPrimeira', label: 'Banana Caturra 1ª', value: null},
    {key: 'caturraSegunda', label: 'Banana Caturra 2ª', value: null},
]);

const unitPrices = ref({});

const totalPriceBananas = ref({
    prataPrimeira: null,
    prataSegunda: null,
    caturraPrimeira: null,
    caturraSegunda: null,
});

let hasCurrentPrices = ref(false);
let loading = ref(true);
const grandTotal = ref(null);
const notebookSelected = ref(null);
const harvestDate = ref(null)

const isAdmin = computed(() => store.getters['auth/isAdmin']);

onMounted(async () => {
    await getNotebooksDb();
});

watch(harvestDate, async (newVal) => {
    await resetQuantitiesPrices()
    if (newVal) await getpricesDb();
});

const calculateTotal = () => {
    let total = 0;

    quantities.value.forEach((quantity) => {
        const quantityValue = parseFloat(quantity.value) || 0;
        const price = unitPrices.value[quantity.key];

        totalPriceBananas.value[quantity.key] = quantityValue * price;
        total += totalPriceBananas.value[quantity.key] || 0;
    });

    grandTotal.value = total;
};

const addBoxes = async () => {
    try {
        await validationsSave()
        await newHarvest(notebookSelected.value, quantities.value, unitPrices.value, parseFloat(grandTotal.value), harvestDate.value);
        showMessage('Nova colheita cadastrada com sucesso!', 'green')
        await resetVariables()
    } catch (error) {
        const errorMessage = error.message || error;
        showMessage(errorMessage, 'red')
    }
};

const calculatedPrices = computed(() => {
    const calculations = {};
    quantities.value.forEach(quantity => {
        const total = totalPriceBananas.value[quantity.key] || 0;
        calculations[quantity.key] = total > 0 ? total : null;
    });
    return calculations;
});


const getpricesDb = async () => {
    try {
        if (!harvestDate.value) throw new Error('Você deve selecionar a data antes das quantidades')
        const pricesDate = await getItens('precosBanana');
        await pricesVerification(pricesDate)

        const harvestDateHasPrices = await dateRegisteredPricesHarvest(pricesDate, harvestDate.value);
        if (harvestDateHasPrices) {
            const updatedPrices = await getpricesDateHarvest(pricesDate, harvestDate.value);

            if (updatedPrices && updatedPrices.dataInicio && updatedPrices.dataFim) {
                unitPrices.value = updatedPrices;
                hasCurrentPrices.value = true;
            } else {
                showMessage(`As propriedades dataInicio ou dataFim estão faltando nos preços atualizados.`, 'red')
                hasCurrentPrices.value = false;
            }
        } else {
            harvestDate.value = null
            hasCurrentPrices.value = false;
            throw new Error('Você deve selecionar uma data que possua preços cadastrados')
        }
    } catch (error) {
        const errorMessage = error.message || error;
        showMessage(errorMessage, 'red')
        console.error('Erro ao buscar preços das bananas:', errorMessage);
    }
};

const getNotebooksDb = async () => {
    try {
        const notebooksData = await getItens('cadernos');

        notebooks.value = notebooksData.map(notebook => ({
            id: notebook.id,
            nome: notebook.nome
        }));
    } catch (error) {
        showMessage(`Erro ao buscar cadernos: ${error}`, 'red')
        console.error('Erro ao buscar cadernos:', error);
    } finally {
        loading.value = false;
    }
};

const validationsSave = async () => {
    if (!notebookSelected.value || !harvestDate.value) {
        throw new Error("Por favor, selecione um caderno.");
    }

    const hasValidQuantity = quantities.value.some(quantity => quantity.value !== null && quantity.value > 0);
    if (!hasValidQuantity) {
        throw new Error("Pelo menos um dos campos de quantidade deve ter um valor maior que zero.");
    }
}

const resetVariables = async () => {
    notebookSelected.value = null;
    harvestDate.value = null
    await resetQuantitiesPrices()
}

const resetQuantitiesPrices = async () => {
    grandTotal.value = null;

    if (hasCurrentPrices.value) {
        quantities.value.forEach(quantity => {
            quantity.value = null;
        });
    }

    for (const key in totalPriceBananas.value) {
        totalPriceBananas.value[key] = 0;
    }
}

const pricesVerification = async (pricesDate) => {
    if (!pricesDate || pricesDate.length === 0) {
        hasCurrentPrices.value = false;
        loading.value = false;
        throw new Error("Não há dados de preços disponíveis.");
    }
}
</script>
