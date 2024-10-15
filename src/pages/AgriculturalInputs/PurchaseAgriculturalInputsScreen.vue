<template>
  <v-container>
    <h1 class="display-1 text-center">Cadastro de Insumos no Caderno</h1>

    <v-form v-if="!loading" v-model="valid" @submit.prevent="addPurchaseAgriculturalInput">
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-select label="Selecione o Caderno" :items="notebooks" v-model="notebookSelected"
                      item-title="name" item-value="id" required/>
          </v-col>

          <v-col>
            <v-col cols="12">
              <v-select label="Selecione o Insumo" :items="agriculturalInputs" v-model="agriculturalInputSelected"
                        item-title="name" item-value="id" required/>
            </v-col>
          </v-col>

          <v-col cols="12">
            <v-text-field :label="'Quantidade'" type="number" :min="1" v-model="quantity" required/>
          </v-col>

          <v-col cols="12">
            <v-btn type="submit" style="background-color: #f9d200" class="mt-4" :disabled="!valid">
              Adicionar Compra
            </v-btn>
          </v-col>
        </v-row>

        <v-snackbar v-model="snackbar" color="success">
          Compra cadastrada com sucesso!
        </v-snackbar>

      </v-container>
    </v-form>

  </v-container>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import {getNotebooks} from "@/services/notebookService";
import {getAgriculturalInputs, newPurchaseAgriculturalInput} from "@/services/agriculturalInputsService";

const notebooks = ref([]);
const notebookSelected = ref(null)

const agriculturalInputs = ref([]);
const agriculturalInputSelected = ref(null)

const quantity = ref(1)
const valid = ref(false);
const snackbar = ref(false);
let loading = ref(true);


onMounted(async () => {
    try {
        await getNotebooksDb()
        await getAgriculturalInputsDb()
    } catch (error) {
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
        console.error('Erro ao buscar cadernos:', error);
    } finally {
        loading.value = false;
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
        console.error('Erro ao buscar cadernos:', error);
    }
};

const addPurchaseAgriculturalInput = () => {
    if (!notebookSelected.value || !agriculturalInputSelected.value || !quantity.value) {
        console.error("Todos os campos devem estar preenchidos.");
        return;
    }

    newPurchaseAgriculturalInput(crypto.randomUUID(), notebookSelected.value, agriculturalInputSelected.value, quantity.value);
    snackbar.value = true;
};

</script>

<style scoped>
h1 {
    margin-bottom: 20px;
}
</style>
