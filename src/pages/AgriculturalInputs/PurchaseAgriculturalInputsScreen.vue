<template>
  <v-container fluid>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="10" md="8" lg="6">
        <h1 class="display-1 text-center">Compra de Insumos</h1>

        <v-form v-if="!loading" v-model="valid" @submit.prevent="addPurchaseAgriculturalInput">
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-select label="Selecione o Caderno" :items="notebooks" v-model="notebookSelected"
                          item-title="name" item-value="id" required rounded variant="outlined"/>
              </v-col>

              <v-col cols="12">
                <v-select label="Selecione o Insumo" :items="agriculturalInputs" v-model="agriculturalInputSelected"
                          item-title="name" item-value="id" required rounded variant="outlined"/>
              </v-col>

              <v-col cols="12">
                <v-text-field :label="'Quantidade'" type="number" :min="1" v-model="quantity" required
                              rounded variant="outlined" density="compact"/>
              </v-col>

              <v-col cols="12">
                <v-btn type="submit" class="mt-4 bg-primary" :disabled="!valid"  :style="{ width: '30%' }">
                  Adicionar
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-col>
    </v-row>
    <feedback-message v-model="snackbar" :message="'Compra cadastrada com sucesso!'" :color="'green'"/>
  </v-container>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import {getNotebooks} from "@/services/notebookService";
import {getAgriculturalInputs, newPurchaseAgriculturalInput} from "@/services/agriculturalInputsService";
import FeedbackMessage from "@/components/FeedbackMessage.vue";

const notebooks = ref([]);
const notebookSelected = ref(null)

const agriculturalInputs = ref([]);
const agriculturalInputSelected = ref(null)

const quantity = ref(1)
const valid = ref(false);
let loading = ref(true);

const snackbar = ref(false);
const color = ref('');
const message = ref('');

onMounted(async () => {
    try {
        await getNotebooksDb()
        await getAgriculturalInputsDb()
    } catch (error) {
        message.value = `Erro ao buscar cadernos e insumos:", ${error}`
        color.value = 'green'
        snackbar.value = true;
        console.error("Erro ao buscar cadernos e insumos:", error);
    }
});


const getNotebooksDb = async () => {
    try {
        const notebooksData = await getNotebooks();
        loading.value = false;
        notebooks.value = notebooksData.map(notebook => ({
            id: notebook.id,
            name: notebook.name
        }));
    } catch (error) {
        message.value = `Erro ao buscar cadernos: ${error}`
        color.value = 'red'
        snackbar.value = true;
    }
};

const getAgriculturalInputsDb = async () => {
    try {
        const inputsData = await getAgriculturalInputs();

        agriculturalInputs.value = inputsData.map(input => ({
            id: input.id,
            name: input.name,
            valor: input.valor
        }));
    } catch (error) {
        message.value = `Erro ao buscar insumos: ${error}`
        color.value = 'red'
        snackbar.value = true;
    }
};

const addPurchaseAgriculturalInput = () => {
    if (!notebookSelected.value || !agriculturalInputSelected.value || !quantity.value) {
        message.value = 'Todos os campos devem estar preenchidos.'
        color.value = 'red'
        snackbar.value = true;

        return;
    }

    newPurchaseAgriculturalInput(crypto.randomUUID(), notebookSelected.value, agriculturalInputSelected.value, quantity.value, notebookSelected.value.valor * quantity.value);
    snackbar.value = true;
};

</script>

<style scoped>
h1 {
    margin-bottom: 20px;
}
</style>
