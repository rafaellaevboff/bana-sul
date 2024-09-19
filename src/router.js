import { createRouter, createWebHistory } from 'vue-router';
import { getAuth } from 'firebase/auth';
import LoginScreen from './pages/LoginScreen.vue';
import RegistrationScreen from './pages/RegistrationScreen.vue';
import ResetPasswordScreen from './pages/ResetPasswordScreen.vue';
import HomeScreen from './pages/HomeScreen.vue';

const routes = [
  { path: '/', name: 'Login', component: LoginScreen },
  { path: '/cadastro', name: 'Cadastro', component: RegistrationScreen},
  { path: '/resetSenha', name: 'ResetPassword', component: ResetPasswordScreen},
  { path: '/home', name: 'Home', component: HomeScreen , meta: { requiresAuth: true }}
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
