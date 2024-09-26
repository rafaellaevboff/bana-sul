<template>
  <v-navigation-drawer app v-model="drawer" permanent>
    <v-list>

      <v-list-item link to="/app/dashboard">
        <v-list-item-icon>
          <v-icon>mdi-home</v-icon>
        </v-list-item-icon>
        <v-list-item-content>Página Inicial</v-list-item-content>
      </v-list-item>

      <v-list-item link to="/app/novoAgricultor">
        <v-list-item-icon>
          <v-icon>mdi-account-plus-outline</v-icon>
        </v-list-item-icon>
        <v-list-item-content>Novo agricultor</v-list-item-content>
      </v-list-item>

      <v-list-item link to="/app/novoValorBanana">
        <v-list-item-icon>
          <v-icon>mdi-cash-edit</v-icon>
        </v-list-item-icon>
        <v-list-item-content>Novo valor Banana</v-list-item-content>
      </v-list-item>

      <v-list-item link to="/app/novaColheita">
        <v-list-item-icon>
          <v-icon>mdi-human-dolly</v-icon>
        </v-list-item-icon>
        <v-list-item-content>Nova colheita</v-list-item-content>
      </v-list-item>

      <v-list-item @click="logoutApp">
        <v-list-item-icon>
          <v-icon>mdi-logout</v-icon>
        </v-list-item-icon>
        <v-list-item-content>Sair</v-list-item-content>
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
