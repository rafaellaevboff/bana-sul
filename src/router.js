import { createRouter, createWebHistory } from 'vue-router';
import { getAuth } from 'firebase/auth';
import TelaCadastro from './pages/RegistrationScreen.vue';
import TelaLogin from './pages/LoginScreen.vue';

const routes = [
  { path: '/', name: 'TelaLogin', component: TelaLogin },
  {
    path: '/cadastro', name: 'TelaCadastro', component: TelaCadastro,  meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const auth = getAuth();
  const user = auth.currentUser; // Verifica o usuário autenticado
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !user) {
    next({ name: 'Login' });
  } else {
    next();
  }
});

export default router;
