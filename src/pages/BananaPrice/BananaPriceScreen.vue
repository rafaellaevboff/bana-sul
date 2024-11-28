<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="12" sm="10" md="8" lg="6">
        <h1 class="display-1 text-center">Novos Preços de Bananas</h1>

        <v-progress-circular v-if="loading" indeterminate color="primary" class="my-4" />

        <v-form @submit.prevent="registerPrices" v-if="!loading">
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field label="Data de Início" type="date" v-model="startDate" required rounded variant="outlined"
                  density="compact" />
              </v-col>

              <v-col cols="12">
                <v-text-field label="Data de Fim" type="date" v-model="endDate" required rounded variant="outlined"
                  density="compact" />
              </v-col>

              <v-col cols="12" md="6">
                <field-value v-model="prices.silverFirst" label="Banana Prata 1ª" />
              </v-col>

              <v-col cols="12" md="6">
                <field-value v-model="prices.silverSecond" label="Banana Prata 2ª" />
              </v-col>

              <v-col cols="12" md="6">
                <field-value v-model="prices.caturraFirst" label="Banana Caturra 1ª" />
              </v-col>

              <v-col cols="12" md="6">
                <field-value v-model="prices.caturraSecond" label="Banana Caturra 2ª" />
              </v-col>

              <v-col cols="12">
                <v-btn type="submit" class="mt-4 bg-primary" rounded :style="{ width: '30%' }">
                  Cadastrar
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-form>

        <feedback-message v-model="snackbar" :message="message" :color="color" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { newBananaPrice } from "@/services/bananaPriceService";
import FeedbackMessage from "@/components/FeedbackMessage.vue";
import { getItens } from "@/services/essentialFunctions";
import { useShowMessage } from "@/composables/useShowMessage";
import { parseISO } from "date-fns";
import FieldValue from "@/components/FieldValue.vue";

const { snackbar, color, message, showMessage } = useShowMessage();

const startDate = ref('');
const endDate = ref('');
const pricesHistory = ref(null);
const prices = ref({
  silverFirst: null,
  silverSecond: null,
  caturraFirst: null,
  caturraSecond: null,
});

const loading = ref(false)

onMounted(async () => {
  await getPrices();
})

const registerPrices = async () => {

  try {
    loading.value = true
    if (!startDate.value || !endDate.value && prices.value.silverFirst == null || prices.value.silverSecond == null || prices.value.caturraFirst == null || prices.value.caturraSecond == null) {
      loading.value = false
      showMessage(`Todos os campos devem estar preenchidos.`, 'red');
      return;
    }

    const hasConflict = pricesHistory.value.some(history => {
      const newStartDate = parseISO(history.dataInicio);
      const newEndDate = parseISO(history.dataFim);
      const start = parseISO(startDate.value);
      const end = parseISO(endDate.value);

      return !(end < newStartDate || start > newEndDate);
    });

    if (hasConflict) {
      loading.value = false
      showMessage(`Já existem valores de banana cadastrados na data selecionada.`, 'red');
      return;
    }

    await newBananaPrice(
      startDate.value,
      endDate.value,
      parseFloat(prices.value.silverFirst),
      parseFloat(prices.value.silverSecond),
      parseFloat(prices.value.caturraFirst),
      parseFloat(prices.value.caturraSecond)
    );

    message.value = `Preços cadastrados com sucesso!`;
    color.value = 'green';
    snackbar.value = true;

    startDate.value = '';
    endDate.value = '';
    prices.value = {
      silverFirst: null,
      silverSecond: null,
      caturraFirst: null,
      caturraSecond: null,
    };
  } catch (error) {
    message.value = `Erro ao cadastrar valores`;
    color.value = 'red';
    snackbar.value = true;
  } finally {
    loading.value = false
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
