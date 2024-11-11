import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "@/plugins/firebase";

const state = {
    isAdmin: null,
    isAuthenticated: false,
};

const mutations = {
    setIsAdmin(state, status) {
        state.isAdmin = status;
    },
    setAuthenticated(state, status) {
        state.isAuthenticated = status;
    },
};

const actions = {
    async checkAuthStatus({ commit }) {
        return new Promise((resolve) => {
            onAuthStateChanged(auth, async (user) => {
                if (user) {
                    commit('setAuthenticated', true);
                    const usuariosRef = collection(db, 'usuarios');
                    const q = query(usuariosRef, where("login", "==", user.uid));
                    const querySnapshot = await getDocs(q);

                    if (!querySnapshot.empty) {
                        const doc = querySnapshot.docs[0];
                        const userData = { id: doc.id, ...doc.data() };
                        commit('setIsAdmin', userData.perfil === "administrador");
                    } else {
                        commit('setIsAdmin', false);
                    }
                } else {
                    commit('setAuthenticated', false);
                    commit('setIsAdmin', null);
                }
                resolve();
            });
        });
    },
};

const getters = {
    isAdmin: (state) => state.isAdmin,
    isAuthenticated: (state) => state.isAuthenticated,
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};