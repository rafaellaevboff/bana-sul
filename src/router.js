import {createRouter, createWebHistory} from 'vue-router';
import {getAuth} from 'firebase/auth';
import LoginScreen from './pages/LoginScreen.vue';
import RegistrationScreen from './pages/RegistrationScreen.vue';
import ResetPasswordScreen from './pages/ResetPasswordScreen.vue';
import HomeScreen from './pages/HomeScreen.vue';
import LayoutScreen from './pages/LayoutScreen.vue';

const routes = [
    {path: '/', name: 'Login', component: LoginScreen},
    {path: '/resetSenha', name: 'ResetPassword', component: ResetPasswordScreen},
    {
        path: '/app', // Rotas autenticadas vão usar este layout
        component: LayoutScreen,
        children: [
            {
                path: '/home',
                name: 'Home',
                component: HomeScreen
            },
            {
                path: '/novoAgricultor',
                name: 'NovoAgricultor',
                component: RegistrationScreen
            },
            {
                path: '/novoValorBanana',
                name: 'NovoValorBanana',
                component: RegistrationScreen
            },
            {
                path: '/novaColheita',
                name: 'NovaColheita',
                component: RegistrationScreen
            },

        ],
        meta: {requiresAuth: true},
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const auth = getAuth();
    const user = auth.currentUser;
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

    if (requiresAuth && !user) {
        next({name: 'Login'});
    } else {
        next();
    }
});

export default router;
