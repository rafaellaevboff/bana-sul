import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import { auth } from './services/firebase'
import { onAuthStateChanged } from 'firebase/auth';
import router from './router'

let app

onAuthStateChanged(auth, (user) => {
  if (!app) {
    app = createApp(App)
    app.use(vuetify);
    app.use(router);
    app.mount('#app');
  }

  if (user) {
    console.log('Usuário logado:', user);
  } else {
    console.log('Nenhum usuário logado');
  }
});
