import { auth, db } from '../config/firebase';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { collection, addDoc, getDocs, doc, getDoc, setDoc, deleteDoc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { INITIAL_NEWS } from '../config/data';

export const levenshteinDistance = (a, b) => {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;
    const matrix = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1));
            }
        }
    }
    return matrix[b.length][a.length];
};

export const feedbackApi = {
    async submit(data) {
        if (db) {
            try {
                await addDoc(collection(db, "feedback"), { ...data, createdAt: serverTimestamp(), status: 'open' });
                return { success: true };
            } catch (e) { console.error("Error adding feedback: ", e); throw e; }
        } else {
            return new Promise((resolve) => {
                setTimeout(() => {
                    const currentData = JSON.parse(localStorage.getItem('k5_feedback_db') || '[]');
                    const newRecord = { id: crypto.randomUUID(), createdAt: new Date().toISOString(), status: 'open', ...data };
                    localStorage.setItem('k5_feedback_db', JSON.stringify([newRecord, ...currentData]));
                    resolve({ success: true });
                }, 300);
            });
        }
    },
    async getAll() {
        if (db) {
            try {
                const q = query(collection(db, "feedback"), orderBy("createdAt", "desc"));
                const querySnapshot = await getDocs(q);
                return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), createdAt: doc.data().createdAt?.toDate().toISOString() || new Date().toISOString() }));
            } catch (e) { return []; }
        } else {
            return new Promise((resolve) => {
                 setTimeout(() => { resolve(JSON.parse(localStorage.getItem('k5_feedback_db') || '[]')); }, 300);
            });
        }
    }
};

export const userApi = {
    async getUserData(userId) {
        if (!db) return { favorites: [], readHistory: {}, role: 'user' };
        try {
            const docRef = doc(db, "users", userId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return docSnap.data();
            } else {
                const initialData = { favorites: [], readHistory: {}, role: 'user' };
                await setDoc(docRef, initialData);
                return initialData;
            }
        } catch (e) {
            console.error("Error getting user data:", e);
            return { favorites: [], readHistory: {}, role: 'user' };
        }
    },
    async saveFavorites(userId, newFavorites) {
        if (!db) return;
        try {
            const userRef = doc(db, "users", userId);
            await setDoc(userRef, { favorites: newFavorites }, { merge: true });
        } catch (e) { console.error("Error saving favorites:", e); }
    },
    async markSectionRead(userId, sectionId) {
        if (!db) return;
        try {
             const userData = await userApi.getUserData(userId);
             const newHistory = { ...userData.readHistory, [sectionId]: new Date().toISOString() };
             const userRef = doc(db, "users", userId);
             await setDoc(userRef, { readHistory: newHistory }, { merge: true });
        } catch (e) { console.error("Error marking read:", e); }
    }
};

export const newsApi = {
    async getAll() {
        if (db) {
            try {
                const q = query(collection(db, "news"), orderBy("id", "desc"));
                const querySnapshot = await getDocs(q);
                const news = querySnapshot.docs.map(doc => ({ firebaseId: doc.id, ...doc.data() }));
                return news.length > 0 ? news : INITIAL_NEWS;
            } catch (e) { return INITIAL_NEWS; }
        } else {
            return new Promise((resolve) => {
                const data = JSON.parse(localStorage.getItem('k5_news_db'));
                resolve(data || INITIAL_NEWS);
            });
        }
    },
    async add(item) {
        if (db) {
            try {
                await addDoc(collection(db, "news"), { ...item, id: Date.now() }); 
                return await newsApi.getAll();
            } catch (e) { return []; }
        } else {
            return new Promise((resolve) => {
                const current = JSON.parse(localStorage.getItem('k5_news_db') || '[]');
                const base = (current.length === 0 && !localStorage.getItem('k5_news_db')) ? INITIAL_NEWS : current;
                const newItem = { id: Date.now(), ...item };
                const updated = [newItem, ...base];
                localStorage.setItem('k5_news_db', JSON.stringify(updated));
                resolve(updated);
            });
        }
    },
    async delete(firebaseId) {
        if (db) {
            try {
                await deleteDoc(doc(db, "news", firebaseId));
                return await newsApi.getAll();
            } catch (e) { return []; }
        } else {
             return new Promise((resolve) => {
                const current = JSON.parse(localStorage.getItem('k5_news_db') || '[]');
                const updated = current.filter(n => n.id !== firebaseId && n.firebaseId !== firebaseId);
                localStorage.setItem('k5_news_db', JSON.stringify(updated));
                resolve(updated);
            });
        }
    }
};

export const authService = {
    async login(email, password) {
        if (auth) {
             const userCredential = await signInWithEmailAndPassword(auth, email, password);
             return userCredential.user;
        } else {
            return new Promise((resolve) => {
                setTimeout(() => {
                    const namePart = email.split('@')[0];
                    const displayName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
                    if (password === 'k5') {
                        resolve({ uid: 'admin_1', email: email, displayName: displayName + ' (Admin)', role: 'admin' });
                    } else {
                        resolve({ uid: `user_${Date.now()}`, email: email, displayName: displayName, role: 'user' });
                    }
                }, 500);
            });
        }
    },
    async logout() {
        if (auth) await signOut(auth);
    }
};