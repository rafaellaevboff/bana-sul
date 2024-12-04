<template>
  <v-app>
    <v-app-bar app class="bg-primary" dark>

      <v-app-bar-nav-icon v-if="isAdmin" class="custom-hover" @click="drawer = !drawer"/>
      <v-spacer/>

      <v-btn class="custom-hover" icon @click="toggleLista">
        <v-icon>mdi-exit-to-app</v-icon>
      </v-btn>
    </v-app-bar>

    <v-slide-y-transition>
      <v-list v-if="visibleList" class="mt-2 list-options">
        <v-list-item @click="logoutApp">
          <v-list-item-title>Sair</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-slide-y-transition>

    <navigation-drawer v-model="drawer"/>

    <v-main>
      <v-container fluid>
        <router-view/>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import {computed, ref} from 'vue';
import {logout} from '@/services/loginService';
import NavigationDrawer from "@/components/NavigationDrawer.vue";
import {useRouter} from "vue-router";
import store from "@/store";

const drawer = ref(false)
const router = useRouter()
const visibleList = ref(false)

const isAdmin = computed(() => store.getters["auth/isAdmin"]);

const logoutApp = () => {
    logout(router);
};

const toggleLista = () => {
    visibleList.value = !visibleList.value;
};

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

.custom-hover:hover {
    background-color: rgb(223, 190, 0) !important;
}
</style>
