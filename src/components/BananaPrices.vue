<template>
  <v-card class="bg-primary">
    <template v-if="loading">
      <v-progress-circular indeterminate color="primary" class="mx-auto"/>
    </template>
    <template v-else-if="Object.keys(prices).length > 0">
      <v-card-title
              v-text="`Valores semanal das Bananas - ${formatDate(prices.dataInicio)} à ${formatDate(prices.dataFim)}`"/>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <v-list-item-content>
              <v-list-item-title>{{ "Prata 1ª" }}</v-list-item-title>
              <v-list-item-subtitle>Valor: R$ {{ prices.prataPrimeira }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-col>

          <v-col cols="12" md="6">
            <v-list-item-content>
              <v-list-item-title>{{ "Prata 2ª" }}</v-list-item-title>
              <v-list-item-subtitle>Valor: R$ {{ prices.prataSegunda }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-col>

          <v-col cols="12" md="6">
            <v-list-item-content>
              <v-list-item-title>{{ "Caturra 1ª" }}</v-list-item-title>
              <v-list-item-subtitle>Valor: R$ {{ prices.caturraPrimeira }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-col>

          <v-col cols="12" md="6">
            <v-list-item-content>
              <v-list-item-title>{{ "Caturra 2ª" }}</v-list-item-title>
              <v-list-item-subtitle>Valor: R$ {{ prices.caturraSegunda }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-col>
        </v-row>
      </v-card-text>
    </template>
    <template v-else>
      <v-alert type="warning" dismissible>
        Clique em "Novo preço Banana" para cadastrar os preços.
      </v-alert>
    </template>
  </v-card>
</template>

<script setup>
import {formatDate} from "@/services/formatService";
import {onMounted, ref} from "vue";
import {dataAtualpricesCadastrados, getpricesDate} from "@/services/bananaPriceService";
import {getItens} from "@/services/essentialFunctions";

const prices = ref({});
const loading = ref(true);

const getpricesDb = async () => {
    try {
        const pricesDate = await getItens('precosBanana');
        if (!pricesDate || pricesDate.length === 0) {
            console.log("Não há dados de preços disponíveis.");
            loading.value = false;
            return;
        }

        const todayHasPrices = await dataAtualpricesCadastrados(pricesDate);

        if (todayHasPrices) {
            const updatedPrices = await getpricesDate(pricesDate);
            const pricesToday = await dataAtualpricesCadastrados(pricesDate);

            if (pricesToday) {
                prices.value = updatedPrices;
            } else {
                console.error("As propriedades dataInicio ou dataFim estão faltando nos preços atualizados.");
            }
        } else {
            console.log("Não há preços de bananas cadastrados para a data atual");
        }
    } catch (error) {
        console.error('Erro ao buscar preços das bananas:', error);
    } finally {
        loading.value = false;
    }
};

onMounted(async () => {
    await getpricesDb();
});
</script>

<style scoped>
</style>
