<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12">
        <h1 class="display-1 text-center">Cadastro de Preços de Bananas</h1>
        <v-form @submit.prevent="registerPrices">
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field label="Data de Início" type="date" v-model="startDate" required/>
              </v-col>

              <v-col cols="12">
                <v-text-field label="Data de Fim" type="date" v-model="endDate" required/>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field label="Banana Prata 1ª" type="number" v-model="prices.silverFirst" required/>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field label="Banana Prata 2ª" type="number" v-model="prices.silverSecond" required/>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                        label="Banana Caturra 1ª"
                        type="number"
                        v-model="prices.caturraFirst"
                        required
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field label="Banana Caturra 2ª" type="number" v-model="prices.caturraSecond" required/>
              </v-col>

              <v-col cols="12">
                <v-btn type="submit" style="background-color: #f9d200" class="mt-4">
                  Cadastrar Preços
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
        <v-alert v-if="mensagem" type="success" class="mt-4">
          {{ mensagem }}
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import {ref} from 'vue';
import {newBananaPrice} from "@/services/bananaPriceService";

const startDate = ref('');
const endDate = ref('');
const prices = ref({
    silverFirst: 0,
    silverSecond: 0,
    caturraFirst: 0,
    caturraSecond: 0,
});
const mensagem = ref('');

const registerPrices = async () => {
    await newBananaPrice(
        crypto.randomUUID(),
        startDate.value,
        endDate.value,
        prices.value.silverFirst,
        prices.value.silverSecond,
        prices.value.caturraFirst,
        prices.value.caturraSecond
    );

    mensagem.value = 'Preços cadastrados com sucesso!';

    startDate.value = '';
    endDate.value = '';
    prices.value = {
        silverFirst: 0,
        silverSecond: 0,
        caturraFirst: 0,
        caturraSecond: 0,
    };
};
</script>

<style scoped>
h1 {
    margin-bottom: 20px;
}
.text-center {
    text-align: center;
}
</style>
