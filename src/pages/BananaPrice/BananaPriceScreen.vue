<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="12" sm="10" md="8" lg="6">
        <h1 class="display-1 text-center">Novos Preços de Bananas</h1>
        <v-form @submit.prevent="registerPrices">
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field label="Data de Início" type="date" v-model="startDate" required
                              rounded variant="outlined" density="compact"/>
              </v-col>

              <v-col cols="12">
                <v-text-field label="Data de Fim" type="date" v-model="endDate" required
                              rounded variant="outlined" density="compact"/>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field label="Banana Prata 1ª" type="number" v-model="prices.silverFirst" required
                              rounded variant="outlined" density="compact"/>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field label="Banana Prata 2ª" type="number" v-model="prices.silverSecond" required
                              rounded variant="outlined" density="compact"/>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field label="Banana Caturra 1ª" type="number" v-model="prices.caturraFirst" required
                              rounded variant="outlined" density="compact"/>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field label="Banana Caturra 2ª" type="number" v-model="prices.caturraSecond" required
                              rounded variant="outlined" density="compact"/>
              </v-col>

              <v-col cols="12">
                <v-btn type="submit" class="mt-4 bg-primary" rounded  :style="{ width: '30%' }">
                  Cadastrar
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-form>

        <feedback-message v-model="snackbar" :message="message" :color="color"/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import {newBananaPrice} from "@/services/bananaPriceService";
import FeedbackMessage from "@/components/FeedbackMessage.vue";
import {getItens} from "@/services/essentialFunctions";
import {useShowMessage} from "@/composables/useShowMessage";

const { snackbar, color, message, showMessage } = useShowMessage();

const startDate = ref('');
const endDate = ref('');
const pricesHistory = ref(null);
const prices = ref({
    silverFirst: 0,
    silverSecond: 0,
    caturraFirst: 0,
    caturraSecond: 0,
});

onMounted(async () => {
    await getPrices();
});

const registerPrices = async () => {
    if (!startDate.value && !endDate.value && !prices.value.silverFirst && !prices.value.silverSecond && !prices.value.caturraFirst && !prices.value.caturraSecond) {
        showMessage(`Todos os campos devem estar preenchidos.`, 'red')
        return;
    }

    const hasConflict = pricesHistory.value.some(history => {
        const dataInicio = new Date(history.dataInicio);
        const dataFim = new Date(history.dataFim);

        return (new Date(startDate.value) <= dataFim && new Date(endDate.value) >= dataInicio);
    });


    if(hasConflict){
        showMessage(`Já existem valores de banana cadastrados na data selecionada.`, 'red')
        return;
    }

    try{
        await newBananaPrice(
            startDate.value,
            endDate.value,
            prices.value.silverFirst,
            prices.value.silverSecond,
            prices.value.caturraFirst,
            prices.value.caturraSecond
        );

        message.value = `Preços cadastrados com sucesso!`
        color.value = 'green'
        snackbar.value = true;

        startDate.value = '';
        endDate.value = '';
        prices.value = {
            silverFirst: 0,
            silverSecond: 0,
            caturraFirst: 0,
            caturraSecond: 0,
        };
    } catch (error){
        message.value = `Erro ao cadastrar valores`
        color.value = 'red'
        snackbar.value = true;
    }
};

const getPrices = async () => {
    pricesHistory.value = await getItens('precosBanana');
}
</script>

<style scoped>
h1 {
    margin-bottom: 20px;
}
.text-center {
    text-align: center;
}
</style>
