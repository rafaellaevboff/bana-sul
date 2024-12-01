<template>
  <v-container>
    <v-row v-if="loading" class="d-flex justify-center align-center" style="height: 80vh;">
      <v-progress-circular indeterminate color="primary" size="64" class="ma-auto"/>
    </v-row>

    <v-row v-if="!loading" align="center" justify="space-between">
      <v-col cols="auto">
        <h1>{{ nameNotebook }}</h1>
      </v-col>
      <v-col cols="auto">
        <v-btn link :to="`/app/comprasInsumo/${farmerNotebook}`" title="Compras de insumos do agricultor"
               class="d-flex align-center p-6" rounded>
          <v-icon class="mr-2">mdi-basket</v-icon>
          Compras de insumos
        </v-btn>
      </v-col>
    </v-row>

    <v-row v-if="!loading">
      <v-col cols="12">
        <v-card class="pa-4">
          <v-card-title class="text-center text-grey">
            <span class="headline">Valor Total</span>
          </v-card-title>
          <v-card-text :class="{'text-green-darken-1': currentTotal >= 0,'text-red-darken-1': currentTotal < 0}" class="text-h5">
            {{ formatCurrency(currentTotal) }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-if="!loading">
      <v-col cols="12" v-for="(transaction, index) in transactions" :key="index">
        <v-card class="pa-4 d-flex flex-wrap justify-space-between">
          <v-card-title class="text-start text-wrap">
            {{ t(transaction.tipo) }} |
            Data: {{ transaction.dataEfetuacao }}
          </v-card-title>

          <v-card-subtitle v-if="expandedCards.has(index)" class="text-wrap">
            <div v-if="transaction.tipo === 'harvest'" class="left-section">
              <div v-for="(quantidade, idx) in transaction.quantidade" :key="idx">
                <span>{{ quantidade.label }}:</span>
                <span>{{ quantidade.value }} x </span>
                <span>{{ formatCurrency(transaction.precosBanana[quantidade.key]) }} = </span>
                <span>{{ formatCurrency(quantidade.value * transaction.precosBanana[quantidade.key]) }}</span>
              </div>
            </div>
          </v-card-subtitle>

          <div class="right-section d-flex align-center">
            <v-btn v-if="transaction.tipo === 'harvest'" small icon @click="toggleExpand(index)" class="mr-3">
              <v-icon>{{ expandedCards.has(index) ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
            </v-btn>
            <v-chip :color="transaction.tipo === 'harvest' ? 'green' : 'red'">
              {{ formatCurrency(transaction.valor) }}
            </v-chip>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>


<script setup>
import {computed, onMounted, ref} from 'vue';
import {getNotebookItems, farmerBalance} from "@/services/notebookService";
import {formatCurrency} from "@/services/formatService";
import {useI18n} from 'vue-i18n';
import {useRoute} from "vue-router";
import {getItemById} from "@/services/essentialFunctions";

const {t} = useI18n();

const transactions = ref([]);
const currentTotal = ref(0);
const expandedCards = ref(new Set());
const loading = ref(true);

const route = useRoute();
const uuid = computed(() => route.params.id);

const nameNotebook = ref('');
const farmerNotebook = route.params.id

onMounted(async () => {
    try {
        loading.value = true;
        await calcularTotal();
        const item = await getItemById('cadernos', uuid.value);
        nameNotebook.value = item.nome;
        transactions.value = await getNotebookItems(farmerNotebook);
    } catch (err) {
        console.log("Erro ao carregar caderno do agricultor: ", err)
        throw new Error("Erro ao carregar caderno do agricultor!")
    } finally {
        loading.value = false;
    }
});

async function calcularTotal() {
    currentTotal.value = await farmerBalance(farmerNotebook);
}

function toggleExpand(index) {
    if (expandedCards.value.has(index)) {
        expandedCards.value.delete(index);
    } else {
        expandedCards.value.add(index);
    }
}
</script>

<style scoped>
.v-chip {
    font-weight: bold;
}

.v-card {
    margin-bottom: 16px;
}

.v-card-title,
.v-card-subtitle {
    word-wrap: break-word;
    white-space: normal;
}

.left-section {
    width: 100%;
    display: flex;
    flex-direction: column;
}

.right-section {
    align-self: center;
}

.v-btn:hover {
    background-color: rgba(247, 208, 0, 0.06) !important;
}

@media (max-width: 600px) {
    .v-card {
        flex-direction: column;
    }
}
</style>
