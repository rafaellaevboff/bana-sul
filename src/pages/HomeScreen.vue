<template>
  <v-container>
    <v-row>
      <v-col>
        <h1>Bem-vindo!</h1>
        <v-divider></v-divider>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-card>
          <v-card-title>
            Valores semanal das Bananas
          </v-card-title>
          <v-card-text>
            <template v-if="Object.keys(prices).length > 0">
              <v-list>
                <v-list-item-group>
                  <v-list-item v-for="price in prices" :key="price.id">
                    <v-list-item-content>
                      <v-list-item-title>{{ price.qualidade }}</v-list-item-title>
                      <v-list-item-subtitle>Valor: R$ {{ price.valor }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </template>
            <template v-else>
              <v-alert type="info" dismissible>
                Não há valores cadastrados para esta semana. Por favor, cadastre novos valores.
              </v-alert>
            </template>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { dataAtualpricesCadastrados, getBananasPrice, getpricesDate } from "@/services/bananaPriceService";
import { getFirestore } from "firebase/firestore";

const db = getFirestore();

const prices = ref({});

const getpricesDb = async () => {
    try {
        const pricesDate = await getBananasPrice(db);
        if (!pricesDate || pricesDate.length === 0) {
            console.log("Não há dados de preços disponíveis.");
            return;
        }

        const todayHasPrices = await dataAtualpricesCadastrados(pricesDate);

        if (todayHasPrices) {
            const updatedPrices = await getpricesDate(pricesDate);
            const pricesToday = await dataAtualpricesCadastrados(pricesDate);

            if (pricesToday) {
                prices.value = updatedPrices;

                console.log(prices.value)

                if (Object.keys(prices.value).length === 0) {
                    console.log("Não há valores válidos cadastrados para esta semana.");
                }
            } else {
                console.error("As propriedades dataInicio ou dataFim estão faltando nos preços atualizados.");
            }
        } else {
            console.log("Não há preços de bananas cadastrados para a data atual");
        }
    } catch (error) {
        console.error('Erro ao buscar preços das bananas:', error);
    }
};

onMounted(async () => {
    await getpricesDb();
});
</script>

<style scoped>
h1 {
    text-align: center;
}
</style>
