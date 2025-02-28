<template>
  <div v-if="isAdmin">
    <v-navigation-drawer app v-model="drawer" :temporary="isMobile"
                         :permanent="!isMobile">
      <v-list density="comfortable">
        <v-list-item link to="/app/home" class="text-start">
          <template v-slot:prepend>
            <v-icon :icon="'mdi-home'"/>
          </template>
          <v-list-item-content v-text="'Página Inicial'"/>
        </v-list-item>

        <v-list-subheader>CADERNOS</v-list-subheader>
        <v-list-item link to="/app/cadernos" class="text-start">
          <template v-slot:prepend>
            <v-icon :icon="'mdi-notebook'"/>
          </template>
          <v-list-item-content v-text="'Cadernos'"/>
        </v-list-item>

        <v-list-item link to="/app/novoCadernoAgricultor" class="text-start">
          <template v-slot:prepend>
            <v-icon :icon="'mdi-notebook-plus-outline'"/>
          </template>
          <v-list-item-content v-text="'Novo caderno'"/>
        </v-list-item>

        <v-list-subheader>VALORES BANANAS</v-list-subheader>
        <v-list-item link to="/app/novoValorBanana" class="text-start">
          <template v-slot:prepend>
            <v-icon :icon="'mdi-cash-edit'"/>
          </template>
          <v-list-item-content v-text="'Novo Preço Banana'"/>
        </v-list-item>

        <v-list-item link to="/app/historicoValoresBanana" class="text-start">
          <template v-slot:prepend>
            <v-icon :icon="'mdi-history'"/>
          </template>
          <v-list-item-content v-text="'Histórico de preços de Banana'"/>
        </v-list-item>

        <v-list-subheader>COLHEITAS</v-list-subheader>
        <v-list-item link to="/app/novaColheita" class="text-start">
          <template v-slot:prepend>
            <v-icon :icon="'mdi-human-dolly'"/>
          </template>
          <v-list-item-content v-text="'Nova colheita'"/>
        </v-list-item>
        <v-list-item link to="/app/colheitas" class="text-start">
          <template v-slot:prepend>
            <v-icon :icon="'mdi-apps-box'"/>
          </template>
          <v-list-item-content v-text="'Colheitas'"/>
        </v-list-item>

        <v-list-subheader>PAGAMENTOS</v-list-subheader>
        <v-list-item link to="/app/novoPagamento" class="text-start">
          <template v-slot:prepend>
            <v-icon :icon="'mdi-cash-plus'"/>
          </template>
          <v-list-item-content v-text="'Novo pagamento'"/>
        </v-list-item>
        <v-list-item link to="/app/listaPagamentos" class="text-start">
          <template v-slot:prepend>
            <v-icon :icon="'mdi-cash-multiple'"/>
          </template>
          <v-list-item-content v-text="'Lista de pagamentos'"/>
        </v-list-item>

        <v-list-subheader>INSUMOS</v-list-subheader>
        <v-list-item link to="/app/novoInsumo" class="text-start">
          <template v-slot:prepend>
            <v-icon :icon="'mdi-tools'"/>
          </template>
          <v-list-item-content v-text="'Novo insumo'"/>
        </v-list-item>

        <v-list-item link to="/app/listaInsumos" class="text-start">
          <template v-slot:prepend>
            <v-icon :icon="'mdi-list-box-outline'"/>
          </template>
          <v-list-item-content v-text="'Insumos'"/>
        </v-list-item>

        <v-list-item link to="/app/novaCompraInsumo" class="text-start">
          <template v-slot:prepend>
            <v-icon :icon="'mdi-plus'"/>
          </template>
          <v-list-item-content v-text="'Nova compra de insumo'"/>
        </v-list-item>

        <v-list-subheader>AÇÕES</v-list-subheader>
        <v-list-item @click="logoutApp" class="text-start">
          <template v-slot:prepend>
            <v-icon :icon="'mdi-logout'"/>
          </template>
          <v-list-item-content v-text="'Sair'"/>
        </v-list-item>

      </v-list>

    </v-navigation-drawer>
  </div>
</template>

<script setup>
import {ref, computed, onMounted} from "vue";
import {logout} from "@/services/loginService";
import {useRouter} from "vue-router";
import store from "@/store";

const props = defineProps({
    modelValue: {
        type: Boolean,
        required: true,
    },
});

const farmerNotebook = ref(null);
onMounted(() => {
    if (typeof window !== "undefined" && window.localStorage) {
        farmerNotebook.value = localStorage.getItem("farmerNotebook");
    }
});

const isAdmin = computed(() => store.getters["auth/isAdmin"]);

const emit = defineEmits(["update:modelValue"]);

const router = useRouter();
const drawer = computed({
    get() {
        return props.modelValue;
    },
    set(value) {
        emit("update:modelValue", value);
    },
});

const isMobile = ref(false);
onMounted(() => {
    const updateMobile = () => {
        isMobile.value = window.innerWidth <= 960;
    };
    updateMobile();
    window.addEventListener("resize", updateMobile);
});

// Logout
const logoutApp = () => {
    logout(router);
};
</script>

<style scoped>
.v-navigation-drawer ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

.v-navigation-drawer ::-webkit-scrollbar-thumb {
    background: #a5a5a5;
    border-radius: 4px;
}

.v-navigation-drawer ::-webkit-scrollbar-thumb:hover {
    background: #505050;
}

.v-navigation-drawer ::-webkit-scrollbar-track {
    background: #f0f0f0;
    border-radius: 4px;
}
</style>
