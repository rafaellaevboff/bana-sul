<template>
  <v-app>
    <v-app-bar app style="background-color: rgba(195,154,0,0.81)" dark>
      <v-app-bar-nav-icon @click="drawer = !drawer"/>
      <v-toolbar-title>Bana-Sul</v-toolbar-title>
      <v-spacer/>

      <v-btn icon @click="toggleLista">
        <v-icon>mdi-account-circle</v-icon>
      </v-btn>
    </v-app-bar>

    <v-slide-y-transition>
      <v-list v-if="visibleList" class="mt-2 list-options">
        <v-list-item @click="myAccount">
          <v-list-item-title>Minha Conta</v-list-item-title>
        </v-list-item>
        <v-list-item @click="logoutApp">
          <v-list-item-title>Sair</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-slide-y-transition>

    <NavigationDrawer v-model="drawer"/>

    <v-main>
      <v-container fluid>
        <router-view/>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import {ref} from 'vue';
import {logout} from '@/services/loginService';
import NavigationDrawer from "@/components/NavigationDrawer.vue";
import {useRouter} from "vue-router";

const drawer = ref(false);
const router = useRouter();
const visibleList = ref(false);

const logoutApp = () => {
    logout(router)
}

const toggleLista = () => {
    visibleList.value = !visibleList.value
}

const myAccount = () => {
    router.push('/minha-conta');
}

</script>

<style scoped>
.list-options {
    position: absolute;
    top: 70px;
    right: 20px;
    background-color: white;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    width: 200px;
    z-index: 10;
}
</style>