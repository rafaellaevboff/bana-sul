import {collection, deleteDoc, doc, getDoc, getDocs} from "firebase/firestore";
import {db} from "@/plugins/firebase";

export const getItens = async (nameCollection) => {
    try {
        const querySnapshot = await getDocs(collection(db, nameCollection));
        const itens = [];

        querySnapshot.forEach((doc) => {
            itens.push({id: doc.id, ...doc.data()});
        });

        return itens
    } catch (error) {
        console.error("Erro ao buscar os itens:", error);
    }
}

export const deleteItem = async (nameCollection, id) => {
    await deleteDoc(doc(db, nameCollection, id))
}

export const getItemById = async (nameCollection, id) => {
    try {
        const docRef = doc(db, nameCollection, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            console.log(docSnap.data())
            return docSnap.data();
        } else {
            console.log("Item não encontrado!");
            return null;
        }
    } catch (error) {
        console.error("Erro ao buscar o item:", error);
    }
};