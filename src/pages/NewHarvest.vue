<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <h1 class="display-1 text-center">Novo registro de colheita</h1>

        <v-progress-circular v-if="loading" indeterminate color="primary" class="my-4"/>

        <v-form v-if="!loading && hasCurrentPrices" @submit.prevent="addBoxes">
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-select label="Selecione o Caderno" :items="notebooks" v-model="notebookSelected"
                        item-title="name" item-value="id" required/>
              </v-col>

              <v-col v-for="(quantity, index) in quantities" :key="index" cols="12" md="6">
                <p>Preço Unitário: R${{ unitPrices[quantity.key] }}</p>
                <v-text-field :label="'Quantidade de Caixas - ' + quantity.label"
                              type="number" :min="0" v-model="quantity.value"
                              @input="calculateTotal" required/>
              </v-col>

              <v-col v-for="(total, key) in calculatedPrices" :key="key" cols="12" md="6">
                <p v-if="total !== null">Total {{ key }}: {{ total }}</p>
              </v-col>

              <v-col cols="12" v-if="grandTotal !== null">
                <v-alert type="info">Total Geral: {{ grandTotal }}</v-alert>
              </v-col>

              <v-col cols="12">
                <v-btn type="submit" color="primary" class="mt-4">
                  Adicionar Caixas
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-form>

        <div v-else-if="!loading && !hasCurrentPrices" class="alert alert-warning">
          <strong>Atenção!</strong> Por favor, cadastre os valores das bananas dessa semana.
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { newHarvest } from "@/services/harvestService";
import { getFirestore } from "firebase/firestore";
import { getNotebooks } from "@/services/notebookService";
import {dataAtualpricesCadastrados, getBananasPrice, getpricesDate} from "@/services/bananaPriceService";

const notebooks = ref([]);
const quantities = ref([
    { key: 'prataPrimeira', label: 'Banana Prata 1ª', value: 0 },
    { key: 'prataSegunda', label: 'Banana Prata 2ª', value: 0 },
    { key: 'caturraPrimeira', label: 'Banana Caturra 1ª', value: 0 },
    { key: 'caturraSegunda', label: 'Banana Caturra 2ª', value: 0 },
]);

const unitPrices = ref({
    silverFirst: 0,
    silverSecond: 0,
    caturraFirst: 0,
    caturraSecond: 0,
});

const totalPrice = ref({
    silverFirst: 0,
    silverSecond: 0,
    caturraFirst: 0,
    caturraSecond: 0,
});

let hasCurrentPrices = ref(false);
let loading = ref(true);
const grandTotal = ref(null);
const notebookSelected = ref(null);
const db = getFirestore();

const calculateTotal = () => {
    let total = 0;

    quantities.value.forEach((quantity) => {
        const quantityValue = parseFloat(quantity.value) || 0;
        const price = unitPrices.value[quantity.key];

        totalPrice.value[quantity.key] = quantityValue * price;
        total += totalPrice.value[quantity.key] || 0;
    });

    grandTotal.value = total;
};

const addBoxes = () => {
    if (!notebookSelected.value || !quantities.value || !unitPrices.value) {
        console.error("Todos os campos devem estar preenchidos.");
        return;
    }

    newHarvest(db, crypto.randomUUID(), notebookSelected.value, quantities.value, totalPrice.value);
};

const calculatedPrices = computed(() => {
    const calculations = {};
    quantities.value.forEach(quantity => {
        const total = totalPrice.value[quantity.key] || 0;
        calculations[quantity.key] = total > 0 ? total : null;
    });
    return calculations;
});

const getpricesDb = async () => {
    try {
        const pricesDate = await getBananasPrice(db);
        if (!pricesDate || pricesDate.length === 0) {
            console.log("Não há dados de preços disponíveis.");
            hasCurrentPrices.value = false;
            loading.value = false;
            return;
        }

        const todayHasPrices = await dataAtualpricesCadastrados(pricesDate);

        if (todayHasPrices) {
            const updatedPrices = await getpricesDate(pricesDate);

            if (updatedPrices && updatedPrices.dataInicio && updatedPrices.dataFim) {
                unitPrices.value = updatedPrices;
                hasCurrentPrices.value = true;
            } else {
                console.error("As propriedades dataInicio ou dataFim estão faltando nos preços atualizados.");
                hasCurrentPrices.value = false;
            }
        } else {
            console.log("Não há preços de bananas cadastrados para a data atual");
            hasCurrentPrices.value = false;
        }
    } catch (error) {
        console.error('Erro ao buscar preços das bananas:', error);
    } finally {
        loading.value = false;
    }
};

const getNotebooksDb = async () => {
    try {
        const notebooksData = await getNotebooks(db);

        notebooks.value = notebooksData.map(notebook => ({
            id: notebook.id,
            name: notebook.name
        }));
    } catch (error) {
        console.error('Erro ao buscar cadernos:', error);
    }
};

onMounted(async () => {
    await getNotebooksDb();
    await getpricesDb();
});
</script>
