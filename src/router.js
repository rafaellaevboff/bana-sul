import {createRouter, createWebHistory} from 'vue-router';
import {getAuth} from 'firebase/auth';
import LoginScreen from './pages/Login/LoginScreen.vue';
import ResetPasswordScreen from './pages/Login/ResetPasswordScreen.vue';
import HomeScreen from '@/pages/System/HomeScreen.vue';
import LayoutScreen from '@/pages/System/LayoutScreen.vue';
import BananaPriceScreen from "@/pages/BananaPrice/BananaPriceScreen.vue";
import NewHarvest from "@/pages/Harvest/NewHarvest.vue";
import NewNotebookScreen from "@/pages/Notebooks/NewNotebookScreen.vue";
import ListNotebooksScreen from "@/pages/Notebooks/NotebooksScreenList.vue";
import HistoryBananaPriceScreen from "@/pages/BananaPrice/HistoryBananaPriceScreen.vue";
import FarmerNotebook from "@/pages/Notebooks/FarmerNotebook.vue";
import NewAgriculturalSupplies from "@/pages/AgriculturalSupplies/NewAgriculturalSupplies.vue";
import PurchaseAgriculturalSuppliesScreen from "@/pages/AgriculturalSupplies/PurchaseAgriculturalSuppliesScreen.vue";
import {doc, getDoc, getFirestore} from "firebase/firestore";
import store from "@/store";
import NotFoundScreen from "@/pages/System/NotFoundScreen.vue";
import MyPurchasesScreen from "@/pages/AgriculturalSupplies/MyPurchasesScreen.vue";
import AgriculturalSupplies from "@/pages/AgriculturalSupplies/AgriculturalSupplies.vue";
import NewPayment from "@/pages/payment/NewPayment.vue";
import ListPayments from "@/pages/payment/PaymentsList.vue";
import HarvestList from "@/pages/Harvest/HarvestList.vue";

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
                path: 'colheitas',
                name: 'Colheitas',
                component: HarvestList,
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
                component: NewAgriculturalSupplies,
                meta: {requiresAuth: true, requiresAdmin:true}
            },
            {
                path: 'listaInsumos',
                name: 'ListaInsumos',
                component: AgriculturalSupplies,
                meta: {requiresAuth: true, requiresAdmin:true}
            },
            {
                path: 'novaCompraInsumo',
                name: 'NovaCompraInsumo',
                component: PurchaseAgriculturalSuppliesScreen,
                meta: {requiresAuth: true, requiresAdmin:true}
            },
            {
                path: 'comprasInsumo/:id',
                name: 'Compras Insumo',
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