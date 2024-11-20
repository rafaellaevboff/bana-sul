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
import NewAgriculturalInputs from "@/pages/AgriculturalInputs/NewAgriculturalInputs.vue";
import PurchaseAgriculturalInputsScreen from "@/pages/AgriculturalInputs/PurchaseAgriculturalInputsScreen.vue";
import {doc, getDoc, getFirestore} from "firebase/firestore";
import store from "@/store";
import NotFoundScreen from "@/pages/NotFoundScreen.vue";
import MyPurchasesScreen from "@/pages/AgriculturalInputs/MyPurchasesScreen.vue";
import AgriculturalInputs from "@/pages/AgriculturalInputs/AgriculturalInputs.vue";
import NewPayment from "@/pages/payment/NewPayment.vue";
import ListUsers from "@/pages/ListUsers.vue";
import ListPayments from "@/pages/payment/ListPayments.vue";

const routes = [
    {path: '/', name: 'Login', component: LoginScreen, requiresAdmin:false},
    {path: '/resetSenha', name: 'ResetPasswordScreen', component: ResetPasswordScreen, requiresAdmin:false},
    {
        path: '/app',
        component: LayoutScreen,
        children: [
            {
                path: 'home',
                name: 'Home',
                component: HomeScreen,
                meta: {requiresAuth: true, requiresAdmin:true}
            },
            {
                path: 'listaUsuarios',
                name: 'Lista Usuarios',
                component: ListUsers,
                meta: {requiresAuth: true, requiresAdmin:false}
            },
            {
                path: 'cadernos',
                name: 'Cadernos',
                component: ListNotebooksScreen,
                meta: {requiresAuth: true, requiresAdmin:true}
            },
            {
                path: 'cadernoAgricultor/:id',
                name: 'Caderno',
                component: FarmerNotebook,
                props: true,
                meta: {requiresAuth: true, requiresAdmin:false}
            },
            {
                path: 'novoCadernoAgricultor',
                name: 'NovoCaderno',
                component: NewNotebookScreen,
                meta: {requiresAuth: true, requiresAdmin:true}
            },
            {
                path: 'novoValorBanana',
                name: 'NovoValorBanana',
                component: BananaPriceScreen,
                meta: {requiresAuth: true, requiresAdmin:true}
            },
            {
                path: 'historicoValoresBanana',
                name: 'HistoricoValoresBanana',
                component: HistoryBananaPriceScreen,
                meta: {requiresAuth: true, requiresAdmin:true}
            },
            {
                path: 'novaColheita',
                name: 'NovaColheita',
                component: NewHarvest,
                meta: {requiresAuth: true, requiresAdmin:true}
            },
            {
                path: 'novoPagamento',
                name: 'NovoPagamento',
                component: NewPayment,
                meta: {requiresAuth: true, requiresAdmin:true}
            },
            {
                path: 'listaPagamentos',
                name: 'ListaPagamentoS',
                component: ListPayments,
                meta: {requiresAuth: true, requiresAdmin:true}
            },
            {
                path: 'novoInsumo',
                name: 'NovoInsumo',
                component: NewAgriculturalInputs,
                meta: {requiresAuth: true, requiresAdmin:true}
            },
            {
                path: 'listaInsumos',
                name: 'ListaInsumos',
                component: AgriculturalInputs,
                meta: {requiresAuth: true, requiresAdmin:true}
            },
            {
                path: 'novaCompraInsumo',
                name: 'NovaCompraInsumo',
                component: PurchaseAgriculturalInputsScreen,
                meta: {requiresAuth: true, requiresAdmin:true}
            },
            {
                path: 'minhasCompras',
                name: 'MinhasCompras',
                component: MyPurchasesScreen,
                meta: {requiresAuth: true, requiresAdmin:false}
            },
        ],
    },
    {path: '/not-found', name: 'NotFound', component: NotFoundScreen}
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach(async (to, from, next) => {
    const auth = getAuth();
    const user = auth.currentUser;
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin);
    const db = getFirestore();

    if (requiresAuth && !user) {
        return next({ name: 'Login' });
    }

    if (user) {
        await store.dispatch('auth/verifyAuthentication');
        const isAuthenticated = await store.getters['auth/isAuthenticated'];
        const isAdmin = store.getters['auth/isAdmin'];

        if (!isAuthenticated) return next({ name: 'Login' });

        if (requiresAdmin && !isAdmin) {
            return next({ name: 'NotFound' });
        }

        if (!isAdmin) {
            const notebookDoc = await getDoc(doc(db, 'cadernos.usuario', user.uid));

            if (notebookDoc.exists()) {
                const notebookData = notebookDoc.data();
                const notebookId = notebookDoc.id;

                if (notebookId === notebookData.notebookId) {
                    return next({ name: 'Caderno', params: { id: notebookId } });
                } else {
                    return next({ name: 'Login' });
                }
            }
        }
    }
    next();
});


export default router;