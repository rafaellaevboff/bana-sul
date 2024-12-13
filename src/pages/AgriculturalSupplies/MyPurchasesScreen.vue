<template>
  <v-container>

    <v-row>
      <v-col cols="12" class="d-flex align-start justify-start mb-1'">
        <v-btn icon @click="goBack" class="mr-2 custom-hover">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <span class="text-grey-darken-1 text-body-1 ml-3 mt-4">Caderno > Compra de insumos</span>
      </v-col>
    </v-row>

    <h1 class="mt-5">Compras de insumos</h1>

    <v-row v-if="loading" class="d-flex justify-center align-center" style="height: 80vh;">
      <v-progress-circular indeterminate color="primary" size="64" class="ma-auto"/>
    </v-row>

    <div v-if="!loading" class="container">
      <h2 style="color: grey" class="mt-3">{{ nameNotebook }}</h2>
      <v-data-table v-if="itens.length > 0" :headers="headers" :items="itens" class="table mt-5" item-value="id">
        <template v-slot:[`item.status`]="{ item }">
          {{ item.status }}
        </template>

        <template v-if="isAdmin" v-slot:[`item.acoes`]="{ item }">
          <v-icon @click="openUpdate(item)" color="blue">mdi-pencil</v-icon>
          <v-icon @click="openDelete(item)" color="red">mdi-delete</v-icon>
        </template>
      </v-data-table>

      <v-alert v-if="itens.length === 0" type="warning" class="text-center mt-5" outlined>
        Nenhum dado cadastrado.
      </v-alert>

      <dialog-delete v-model="openDialogDelete" :item="selectedItem?.insumo?.nome"
                     @deleteConfirmed="handleDeletePurchase"/>

      <dialog-update-purchase v-model="openDialogUpdate" :item="selectedItem" @editConfirmed="handleUpdatePurchase"/>
    </div>
  </v-container>
</template>

<script setup>
import {computed, onMounted, ref} from 'vue';
import {useRoute} from "vue-router";
import {getNameNotebook} from "@/services/notebookService";
import {deleteItem} from "@/services/essentialFunctions";
import DialogDelete from "@/components/DialogDelete.vue";
import DialogUpdatePurchase from "@/components/DialogsUpdate/DialogUpdatePurchase.vue";
import store from "@/store";
import {useShowMessage} from "@/composables/useShowMessage";
import {getPurchaseAgriculturalSuppliesByNotebook, updatePurchaseAgriculturalSupply} from "@/services/purchaseSupply";

const {showMessage} = useShowMessage();

const itens = ref([]);
const route = useRoute();
const loading = ref(true);

let openDialogDelete = ref(false);
const openDialogUpdate = ref(false);
const selectedItem = ref(null);

const id = route.params.id;
const notebook = ref(null);

const headers = computed(() => {
    const baseHeaders = [
        {title: 'Item', key: 'nomeInsumo'},
        {title: 'Quantidade', key: 'quantidade'},
        {title: 'Valor Total', key: 'valorTotal'},
        {title: 'Data', key: 'dataEfetuacao'},
        {title: 'Status', key: 'status'},
    ];
    if (isAdmin.value) {
        baseHeaders.push({title: 'Ações', key: 'acoes'});
    }
    return baseHeaders;
});

const isAdmin = computed(() => {
    return store.getters['auth/isAdmin'];
});

onMounted(async () => {
    try {
        loading.value = true;
        await loadItens();
        notebook.value = await getNameNotebook(id);
    } catch (error) {
        console.error("Erro ao carregar dados:", error);
    } finally {
        loading.value = false;
    }
});

const nameNotebook = computed(() => {
    return notebook.value ? notebook.value.name : 'Carregando...';
});

const loadItens = async () => {
    const rawItens = await getPurchaseAgriculturalSuppliesByNotebook(id);
    itens.value = Array.isArray(rawItens) ? rawItens.map(item => ({
        ...item
    })) : [];
};

const openUpdate = (item) => {
    selectedItem.value = item;
    openDialogUpdate.value = true;
}

const handleUpdatePurchase = async (updatedItem) => {
    try {
        await updatePurchaseAgriculturalSupply(updatedItem);
        showMessage('Compra editada', 'green');
    } catch (error) {
        showMessage('Erro ao editar a compra.', 'red');
        console.error("Erro ao editar a compra:", error);
    } finally {
        await loadItens();
    }
};

const openDelete = (item) => {
    selectedItem.value = item;
    openDialogDelete.value = true;
};

const handleDeletePurchase = () => {
    try {
        deleteItem("compraInsumos", selectedItem.value.id);
        showMessage('Dado excluído com sucesso.', 'green');
    } catch (error) {
        showMessage(`Erro ao excluir dado. ${error}.`, 'green');
    } finally {
        loadItens();
    }
};

const goBack = () => {
    window.history.back();
}
</script>

<style scoped>
.container {
    max-width: 800px;
    margin: 0 auto;
}

.table {
    margin-top: 20px;
}

.custom-hover:hover {
    background-color: rgb(223, 190, 0) !important;
}
</style>
