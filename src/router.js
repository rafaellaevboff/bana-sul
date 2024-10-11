import {createRouter, createWebHistory} from 'vue-router';
import {getAuth} from 'firebase/auth';
import LoginScreen from './pages/Login/LoginScreen.vue';
import ResetPasswordScreen from './pages/Login/ResetPasswordScreen.vue';
import HomeScreen from './pages/HomeScreen.vue';
import LayoutScreen from './pages/LayoutScreen.vue';
import BananaPriceScreen from "@/pages/BananaPrice/BananaPriceScreen.vue";
import NewHarvest from "@/pages/NewHarvest.vue";
import NewNotebookScreen from "@/pages/Notebooks/NewNotebookScreen.vue";
import NotebooksScreen from "@/pages/Notebooks/NotebooksScreen.vue";
import HistoryBananaPriceScreen from "@/pages/BananaPrice/HistoryBananaPriceScreen.vue";
import FarmerNotebook from "@/pages/Notebooks/FarmerNotebook.vue";

const routes = [
    {path: '/', name: 'Login', component: LoginScreen},
    {path: '/resetSenha', name: 'ResetPassword', component: ResetPasswordScreen},
    {
        path: '/app',
        component: LayoutScreen,
        children: [
            {
                path: 'home',
                name: 'Home',
                component: HomeScreen
            },
            {
                path: 'cadernos',
                name: 'Cadernos',
                component: NotebooksScreen
            },
            {
                path: 'cadernoAgricultor',
                name: 'Caderno',
                component: FarmerNotebook
            },
            {
                path: 'novoCadernoAgricultor',
                name: 'NovoCaderno',
                component: NewNotebookScreen
            },
            {
                path: 'novoValorBanana',
                name: 'NovoValorBanana',
                component: BananaPriceScreen
            },
            {
                path: 'historicoValoresBanana',
                name: 'HistoricoValoresBanana',
                component: HistoryBananaPriceScreen
            },
            {
                path: 'novaColheita',
                name: 'NovaColheita',
                component: NewHarvest
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
