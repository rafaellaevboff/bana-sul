<template>
  <v-container v-if="isAdmin">
    <v-row justify="center">
      <v-col cols="12" md="8">
        <h1 class="display-1 text-center">Nova colheita</h1>

        <v-progress-circular v-if="loading" indeterminate color="primary" class="my-4"/>

        <v-form v-if="!loading && hasCurrentPrices" @submit.prevent="addBoxes">
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-select label="Selecione o Caderno" :items="notebooks" v-model="notebookSelected"
                          item-title="nome" item-value="id" required rounded variant="outlined"/>
              </v-col>

              <v-col cols="12" md="12" class="font-weight-bold"><p>Quantidade de caixas</p></v-col>

              <v-col v-for="(quantity, index) in quantities" :key="index" cols="12" md="6">
                <v-text-field :label="'Quantidade de Caixas - ' + quantity.label"
                              type="number" :min="1" v-model="quantity.value"
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

        <div v-else-if="!loading && !hasCurrentPrices" class="alert alert-warning">
          <v-alert type="warning" dismissible>
            Não há valores cadastrados de preço de banana para esta semana. Por favor, cadastre novos valores no item "Novo Preço Banana".
          </v-alert>
        </div>
      </v-col>
    </v-row>

    <feedback-message v-model="snackbar" :message="message" :color="color"/>
  </v-container>
</template>

<script setup>
import {computed, onMounted, ref} from 'vue';
import {newHarvest} from "@/services/harvestService";
import {currentDateRegisteredPrices, getpricesDate} from "@/services/bananaPriceService";
import FeedbackMessage from "@/components/FeedbackMessage.vue";
import store from "@/store";
import {getItens} from "@/services/essentialFunctions";
import {useShowMessage} from "@/composables/useShowMessage";

const { snackbar, color, message, showMessage } = useShowMessage();

const notebooks = ref([]);
const quantities = ref([
    {key: 'prataPrimeira', label: 'Banana Prata 1ª', value: null},
    {key: 'prataSegunda', label: 'Banana Prata 2ª', value: null},
    {key: 'caturraPrimeira', label: 'Banana Caturra 1ª', value: null},
    {key: 'caturraSegunda', label: 'Banana Caturra 2ª', value: null},
]);

const unitPrices = ref({});

const totalPriceBananas = ref({
    prataPrimeira: 0,
    prataSegunda: 0,
    caturraPrimeira: 0,
    caturraSegunda: 0,
});

let hasCurrentPrices = ref(false);
let loading = ref(true);
const grandTotal = ref(null);
const notebookSelected = ref(null);

const isAdmin = computed(() => store.getters['auth/isAdmin']);

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

const addBoxes = () => {
    try {
        if (!notebookSelected.value) {
            showMessage(`Por favor, selecione um caderno.`, 'red');
            return;
        }

        const hasValidQuantity = quantities.value.some(quantity => quantity.value !== null && quantity.value > 0);
        if (!hasValidQuantity) {
            showMessage(`Pelo menos um dos campos de quantidade deve ter um valor maior que zero.`, 'red');
            return;
        }

        newHarvest(notebookSelected.value, quantities.value, unitPrices.value, grandTotal.value);

        notebookSelected.value = null;
        grandTotal.value = null;

        quantities.value.forEach(quantity => {
            quantity.value = 0;
        });

        for (const key in totalPriceBananas.value) {
            totalPriceBananas.value[key] = 0;
        }

        showMessage('Nova colheita cadastrada com sucesso!', 'green')
    } catch (error) {
        showMessage(error, 'red')
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
        const pricesDate = await getItens('precosBanana');
        if (!pricesDate || pricesDate.length === 0) {
            showMessage(`Não há dados de preços disponíveis.`, 'red')

            hasCurrentPrices.value = false;
            loading.value = false;
            return;
        }

        const todayHasPrices = await currentDateRegisteredPrices(pricesDate);

        if (todayHasPrices) {
            const updatedPrices = await getpricesDate(pricesDate);

            if (updatedPrices && updatedPrices.dataInicio && updatedPrices.dataFim) {
                unitPrices.value = updatedPrices;
                hasCurrentPrices.value = true;
            } else {
                showMessage(`As propriedades dataInicio ou dataFim estão faltando nos preços atualizados.`, 'red')
                hasCurrentPrices.value = false;
            }
        } else {
            hasCurrentPrices.value = false;
        }
    } catch (error) {
        showMessage(`Erro ao buscar preços das bananas: ${error}`, 'red')
        console.error('Erro ao buscar preços das bananas:', error);
    } finally {
        loading.value = false;
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
    }
};

onMounted(async () => {
    await getNotebooksDb();
    await getpricesDb();
});
</script>
