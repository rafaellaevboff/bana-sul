import { createApp } from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import { auth } from './plugins/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import router from './router';
import store from "@/store";

let app;

onAuthStateChanged(auth, (user) => {
  if (!app) {
    app = createApp(App);
    app.use(vuetify);
    app.use(router);
    app.use(store);
    app.mount('#app');
  }

  if (!user) {
    console.log('Nenhum usuário logado');
  }
}, (error) => {
  console.error('Erro ao verificar a autenticação:', error);
});
