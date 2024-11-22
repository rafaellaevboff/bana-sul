<template>
  <v-container>
    <!-- Overlay de Loading -->
    <v-overlay :value="loading" absolute>
      <v-progress-circular indeterminate color="primary" size="64" class="ma-auto"></v-progress-circular>
    </v-overlay>

    <v-row v-if="!loading">
      <h1>{{ nameNotebook }}</h1>
    </v-row>

    <v-row v-if="!loading">
      <v-col cols="12">
        <v-card class="pa-4">
          <v-card-title class="text-center">
            <span class="headline">Valor Total</span>
          </v-card-title>
          <v-card-subtitle>
            {{ formatCurrency(totalAtual) }}
          </v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-if="!loading">
      <v-col cols="12" v-for="(transacao, index) in transacoes" :key="index">
        <v-card class="pa-4 d-flex flex-wrap justify-space-between">
          <v-card-title class="text-start text-wrap">
            {{ t(transacao.tipo) }} |
            Data: {{ format(new Date(transacao.dataEfetuacao.seconds * 1000 + transacao.dataEfetuacao.nanoseconds / 1e6), 'dd/MM/yyyy') }}
          </v-card-title>

          <v-card-subtitle v-if="expandedCard === index" class="text-wrap">
            <div v-if="transacao.tipo === 'harvest'" class="left-section">
              <div v-for="(quantidade, idx) in transacao.quantidade" :key="idx">
                <span>{{ quantidade.label }}:</span>
                <span>{{ quantidade.value }} x </span>
                <span>{{ formatCurrency(transacao.precosBanana[quantidade.key]) }} = </span>
                <span>{{ formatCurrency(quantidade.value * transacao.precosBanana[quantidade.key]) }}</span>
              </div>
            </div>
          </v-card-subtitle>

          <div class="right-section d-flex align-center">
            <v-btn v-if="transacao.tipo === 'harvest'" small icon @click="toggleExpand(index)" class="mr-3">
              <v-icon>{{ expandedCard === index ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
            </v-btn>
            <v-chip :color="transacao.tipo === 'harvest' ? 'green' : transacao.tipo === 'payment' ? 'red' : 'orange'">
              {{ formatCurrency(transacao.valor) }}
            </v-chip>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { getNotebookItems, saldoAgricultor } from "@/services/notebookService";
import { formatCurrency } from "@/services/formatService";
import { useI18n } from 'vue-i18n';
import { useRoute } from "vue-router";
import { getItemById } from "@/services/essentialFunctions";
import { format } from "date-fns";

const { t } = useI18n();

const transacoes = ref([]);
const totalAtual = ref(0);
const expandedCard = ref(null);
const loading = ref(true);

const route = useRoute();
const uuid = computed(() => route.params.id);

const nameNotebook = ref('');

const farmerNotebook = computed(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
        return localStorage.getItem('farmerNotebook');
    }
    return null;
});

onMounted(async () => {
    try {
        await calcularTotal();
        const item = await getItemById('cadernos', uuid.value);
        nameNotebook.value = item.nome;
        transacoes.value = await getNotebookItems(farmerNotebook.value ? farmerNotebook.value : uuid.value);
    } finally {
        loading.value = false; // Oculta o overlay após carregar
    }
});

async function calcularTotal() {
    totalAtual.value = await saldoAgricultor(farmerNotebook.value ? farmerNotebook.value : uuid.value);
}

function toggleExpand(index) {
    expandedCard.value = expandedCard.value === index ? null : index;
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

@media (max-width: 600px) {
    .v-card {
        flex-direction: column;
    }
}
</style>
