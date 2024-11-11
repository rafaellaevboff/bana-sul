import {doc, getDocs, getFirestore, setDoc} from "firebase/firestore";
import {db} from '@/plugins/firebase';
import {getAuth} from "firebase/auth";

export const newUser = async (uid, name, email) => {
    try {
        await setDoc(doc(db, "usuarios", crypto.randomUUID()), {
            login: uid,
            name: name,
            email: email,
            perfil: 'agricultor',
            dataCadastro: new Date()
        });
        console.log('Dados do usuário salvos com sucesso no Firestore');
    } catch (error) {
        console.error("Erro ao salvar dados do usuário no Firestore:", error.message);
    }
};

export const updateUser = async (user) => {
    await db.collection('usuarios').doc(user.id).update({
        name: user.name,
        email: user.email,
        perfil: user.perfil
    });
};

export const getUsersAndEmailLogin = async (collection) => {
    const auth = getAuth();
    const db = getFirestore();

    const usuariosComEmail = [];

    try {
        const usuariosSnapshot = await getDocs(collection(db, "usuarios"));
        const usuariosData = usuariosSnapshot.docs.map((doc) => ({
            uid: doc.id,
            ...doc.data(),
        }));

        const users = await listAllUsers(auth);

        usuariosData.forEach((usuario) => {
            const authUser = users.find((user) => user.uid === usuario.uid);
            if (authUser) {
                usuariosComEmail.push({
                    nome: usuario.nome,
                    email: authUser.email,
                });
            }
        });

        return usuariosComEmail;
    } catch (error) {
        console.error("Erro ao buscar usuários:", error);
        throw error;
    }
}

async function listAllUsers(auth) {
    const userList = [];
    let nextPageToken;

    do {
        const result = await auth.listUsers(1000, nextPageToken);
        userList.push(...result.users);
        nextPageToken = result.pageToken;
    } while (nextPageToken);

    return userList;
}