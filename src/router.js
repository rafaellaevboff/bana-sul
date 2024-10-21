import {createRouter, createWebHistory} from 'vue-router';
import {getAuth} from 'firebase/auth';
import LoginScreen from './pages/Login/LoginScreen.vue';
import ResetPasswordScreen from './pages/Login/ResetPasswordScreen.vue';
import HomeScreen from './pages/HomeScreen.vue';
import LayoutScreen from './pages/LayoutScreen.vue';
import BananaPriceScreen from "@/pages/BananaPrice/BananaPriceScreen.vue";
import NewHarvest from "@/pages/NewHarvest.vue";
import NewNotebookScreen from "@/pages/Notebooks/NewNotebookScreen.vue";
import ListNotebooksScreen from "@/pages/Notebooks/ListNotebooksScreen.vue";
import HistoryBananaPriceScreen from "@/pages/BananaPrice/HistoryBananaPriceScreen.vue";
import FarmerNotebook from "@/pages/Notebooks/FarmerNotebook.vue";
import MyAccountScreen from "@/pages/MyAccountScreen.vue";
import NewAgriculturalInputs from "@/pages/AgriculturalInputs/NewAgriculturalInputs.vue";
import PurchaseAgriculturalInputsScreen from "@/pages/AgriculturalInputs/PurchaseAgriculturalInputsScreen.vue";

const routes = [
    {path: '/', name: 'Login', component: LoginScreen},
    {path: '/resetSenha', name: 'ResetPasswordScreen', component: ResetPasswordScreen},
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
                path: 'minhaConta',
                name: 'MinhaConta',
                component: MyAccountScreen
            },
            {
                path: 'cadernos',
                name: 'Cadernos',
                component: ListNotebooksScreen
            },
            {
                path: `cadernoAgricultor/:id`,
                name: 'Caderno',
                component: FarmerNotebook,
                props: true,
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
            {
                path: 'novoInsumo',
                name: 'NovoInsumo',
                component: NewAgriculturalInputs
            },
            {
                path: 'novaCompraInsumo',
                name: 'NovaCompraInsumo',
                component: PurchaseAgriculturalInputsScreen
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
