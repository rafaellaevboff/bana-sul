<template>
  <v-navigation-drawer app v-model="drawer" permanent>
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
        <v-list-item-content v-text="'Novo valor Banana'"/>
      </v-list-item>

      <v-list-item link to="/app/historicoValoresBanana" class="text-start">
        <template v-slot:prepend>
          <v-icon :icon="'mdi-history'"/>
        </template>
        <v-list-item-content v-text="'Histórico de valores de Banana'"/>
      </v-list-item>

      <v-list-subheader>COLHEITAS</v-list-subheader>
      <v-list-item link to="/app/novaColheita" class="text-start">
        <template v-slot:prepend>
          <v-icon :icon="'mdi-human-dolly'"/>
        </template>
        <v-list-item-content v-text="'Nova colheita'"/>
      </v-list-item>

      <v-list-subheader>INSUMOS</v-list-subheader>
      <v-list-item link to="/app/novoInsumo" class="text-start">
        <template v-slot:prepend>
          <v-icon :icon="'mdi-tools'"/>
        </template>
        <v-list-item-content v-text="'Novo insumo'"/>
      </v-list-item>

      <v-list-item link to="/app/novaCompraInsumo" class="text-start">
        <template v-slot:prepend>
          <v-icon :icon="'mdi-plus'"/>
        </template>
        <v-list-item-content v-text="'Nova compra de insumo'"/>
      </v-list-item>

      <v-list-subheader>MINHA CONTA</v-list-subheader>
      <v-list-item link to="/app/minhaConta" class="text-start">
        <template v-slot:prepend>
          <v-icon :icon="'mdi-account'"/>
        </template>
        <v-list-item-content v-text="'Minha conta'"/>
      </v-list-item>

      <v-list-item @click="logoutApp" class="text-start">
        <template v-slot:prepend>
          <v-icon :icon="'mdi-logout'"/>
        </template>
        <v-list-item-content v-text="'Sair'"/>
      </v-list-item>

    </v-list>

  </v-navigation-drawer>
</template>

<script setup>
import {computed} from 'vue';
import {logout} from '@/services/loginService';
import {useRouter} from "vue-router";

const props = defineProps({
    modelValue: {
        type: Boolean,
        required: true
    }
});

const emit = defineEmits(['update:modelValue']);

const router = useRouter();

const drawer = computed({
    get() {
        return props.modelValue;
    },
    set(value) {
        emit('update:modelValue', value);
    }
});

const logoutApp = () => {
    logout(router);
};

</script>
