<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card class="pa-4">
          <v-card-title>
            <span class="headline">Valor Total Atual</span>
          </v-card-title>
          <v-card-subtitle>
            {{ formatCurrency(totalAtual) }}
          </v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-list>
          <v-list-item-group v-for="(transacao, index) in transacoes" :key="index">
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>{{ transacao.descricao }}</v-list-item-title>
                <v-list-item-subtitle>
                  Tipo: {{ transacao.tipo }} | Data: {{ transacao.dataCadastro }}
                </v-list-item-subtitle>
                <v-list-item-action>
                  <v-chip :color="transacao.tipo === 'colheita' ? 'green' : transacao.tipo === 'pagamento' ? 'red' : 'blue'">
                    {{ formatCurrency(transacao.valor) }}
                  </v-chip>
                </v-list-item-action>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import {computed, onMounted, ref} from 'vue';
import {getNotebookItems, saldoAgricultor} from "@/services/notebookService";
import {formatCurrency} from "../../services/formatService";

const transacoes = ref([]);
const totalAtual = ref(0);

const farmerNotebook = computed(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
        return localStorage.getItem('farmerNotebook');
    }
    return null
});

onMounted(async () => {
    const items = await getNotebookItems(farmerNotebook.value)
    console.log("items: ", items)
    await calcularTotal();
});

async function calcularTotal() {
    if (farmerNotebook.value) totalAtual.value = await saldoAgricultor(farmerNotebook.value)
}
</script>

<style scoped>
.v-chip {
    font-weight: bold;
}
</style>
