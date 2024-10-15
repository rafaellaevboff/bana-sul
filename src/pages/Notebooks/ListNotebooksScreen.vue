<template>
  <v-container>
    <h1 class="display-1 text-center">Cadernos</h1>

    <v-text-field v-model="search" label="Buscar caderno" class="mb-4" clearable/>

    <v-row>
      <v-col
              v-for="(item, index) in filteredCards"
              :key="index" cols="12" sm="6" md="3"
      >
        <v-card class="d-flex flex-column justify-space-between pa-4" min-height="200px">
          <v-card-title>{{ item.name }}</v-card-title>

          <v-card-actions class="justify-space-between">
            <v-btn @click="openNotebook(item)">Abrir</v-btn>

            <div>
              <v-icon @click="updateNotebook(item)" color="blue">mdi-pencil</v-icon>
              <v-icon @click="deleteNotebook(item)" color="red">mdi-delete</v-icon>
            </div>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <dialog-delete v-model="openDialogDelete" :notebook="selectedNotebook" @deleteConfirmed="deleteNotebook"/>

    <dialog-update v-model="openDialogUpdate"/>
  </v-container>
</template>

<script setup>
import {computed, onMounted, ref} from "vue";
import {getNotebooks} from "@/services/notebookService";
import DialogDelete from "@/components/DialogDelete.vue";
import DialogUpdate from "@/components/DialogUpdate.vue";
import router from "@/router";

const cards = ref([]);
const search = ref("");
const openDialogDelete = ref(false)
const openDialogUpdate = ref(false)
const selectedNotebook = ref(null);

onMounted(async () => {
    try {
        cards.value = await getNotebooks();
    } catch (error) {
        console.error("Erro ao carregar cadernos:", error);
    }
});

const filteredCards = computed(() => {
    return cards.value.filter((item) =>
        item.name.toLowerCase().includes(search.value.toLowerCase())
    );
});

const openNotebook = ( (itemSelecionado) => {
    router.push(`/app/cadernoAgricultor/${itemSelecionado.id}`);
})

const deleteNotebook = ( (itemSelecionado) => {
    selectedNotebook.value = itemSelecionado;
    openDialogDelete.value = true
})

const updateNotebook = ( (itemSelecionado) => {
    selectedNotebook.value = itemSelecionado;
    openDialogUpdate.value = true
})

</script>

<style scoped>
</style>
