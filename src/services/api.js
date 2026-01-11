import { auth, db } from '../config/firebase';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { collection, addDoc, getDocs, doc, getDoc, setDoc, deleteDoc, query, orderBy, serverTimestamp, updateDoc, where, limit } from 'firebase/firestore';
import { INITIAL_NEWS, PUBLIC_HOLIDAYS, VACATION_TYPES } from '../config/data';

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

// HILFSFUNKTION: Arbeitstage berechnen (ohne Wochenende & Feiertage)
export const calculateWorkDays = (startStr, endStr) => {
    let count = 0;
    const curDate = new Date(startStr);
    const endDate = new Date(endStr);

    while (curDate <= endDate) {
        const dayOfWeek = curDate.getDay();
        const dateString = curDate.toISOString().split('T')[0];
        const monthDay = dateString.slice(5); // MM-DD

        const isWeekend = (dayOfWeek === 6) || (dayOfWeek === 0);
        const isHoliday = PUBLIC_HOLIDAYS.includes(dateString) || PUBLIC_HOLIDAYS.includes(monthDay);

        if (!isWeekend && !isHoliday) {
            count++;
        }
        curDate.setDate(curDate.getDate() + 1);
    }
    return count;
};

export const feedbackApi = {
    async submit(data) {
        if (db) {
            try {
                await addDoc(collection(db, "feedback"), { ...data, createdAt: serverTimestamp(), status: 'open' });
                return { success: true };
            } catch (e) { console.error("Error adding feedback: ", e); throw e; }
        } else {
            return new Promise((resolve) => { resolve({ success: true }); });
        }
    },
    async getAll() {
        if (db) {
            try {
                const q = query(collection(db, "feedback"), orderBy("createdAt", "desc"));
                const querySnapshot = await getDocs(q);
                return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), createdAt: doc.data().createdAt?.toDate().toISOString() || new Date().toISOString() }));
            } catch (e) { return []; }
        } else { return []; }
    }
};

export const userApi = {
    async getUserData(userId, email = null) {
        if (!db) return { favorites: [], readHistory: {}, role: 'user' };
        try {
            const docRef = doc(db, "users", userId);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
                const data = docSnap.data();
                
                // LOGIK-FIX: Wir prüfen erst, ob wir Daten updaten müssen
                const updates = {};
                let needsUpdate = false;

                // 1. Email fehlt in DB? Nachtragen!
                if (email && !data.email) {
                    updates.email = email;
                    needsUpdate = true;
                }

                // 2. Name fehlt in DB? Nur DANN aus Email generieren!
                // Das verhindert, dass dein manueller Name überschrieben wird.
                if (email && !data.displayName) {
                    let genName = email.split('@')[0];
                    genName = genName.charAt(0).toUpperCase() + genName.slice(1);
                    updates.displayName = genName;
                    needsUpdate = true;
                }

                // Wenn etwas fehlt, speichern wir es nach
                if (needsUpdate) {
                    await setDoc(docRef, updates, { merge: true });
                }

                // Wir geben die DB-Daten zurück, ergänzt um evtl. gerade generierte Werte
                return { ...data, ...updates };

            } else {
                // Neuer User (Erster Login)
                let genName = 'User';
                if (email) {
                    genName = email.split('@')[0];
                    genName = genName.charAt(0).toUpperCase() + genName.slice(1);
                }

                const initialData = { 
                    favorites: [], 
                    readHistory: {}, 
                    role: 'user',
                    email: email || '',
                    displayName: genName // Hier setzen wir den Start-Namen
                };
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
        const userRef = doc(db, "users", userId);
        await setDoc(userRef, { favorites: newFavorites }, { merge: true });
    },
    async markSectionRead(userId, sectionId) {
        if (!db) return;
        const userData = await userApi.getUserData(userId);
        const newHistory = { ...userData.readHistory, [sectionId]: new Date().toISOString() };
        const userRef = doc(db, "users", userId);
        await setDoc(userRef, { readHistory: newHistory }, { merge: true });
    },
    async getAllUsers() {
        if (!db) return [];
        try {
            const q = query(collection(db, "users"));
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => {
                const data = doc.data();
                let name = data.displayName;
                if (!name && data.email) name = data.email.split('@')[0];
                if (!name) name = 'Unbekannt';
                return { uid: doc.id, ...data, displayName: name };
            });
        } catch (e) { return []; }
    },
    async updateUserRole(targetUserId, newRole) {
        if (!db) return;
        const userRef = doc(db, "users", targetUserId);
        await updateDoc(userRef, { role: newRole });
    },
    async updateUserProfile(userId, profileData) {
        if (!db) return;
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, {
            displayName: profileData.displayName,
            position: profileData.position || '',
            department: profileData.department || '',
            responsibilities: profileData.responsibilities || '',
            photoUrl: profileData.photoUrl || ''
        });
    },
    // NEU: Admin Update für Urlaubstage
    async updateAdminUserStats(targetUid, stats) {
        if(!db) return;
        const userRef = doc(db, "users", targetUid);
        await updateDoc(userRef, {
            vacationEntitlement: parseFloat(stats.entitlement),
            carryOverDays: parseFloat(stats.carryOver)
        });
    }
};

export const newsApi = {
    async getAll() {
        if (db) {
            try {
                const q = query(collection(db, "news"), orderBy("id", "desc"));
                const querySnapshot = await getDocs(q);
                return querySnapshot.docs.map(doc => ({ firebaseId: doc.id, ...doc.data() }));
            } catch (e) { return INITIAL_NEWS; }
        } else { return INITIAL_NEWS; }
    },
    async add(item) {
        if (db) {
            await addDoc(collection(db, "news"), { ...item, id: Date.now() }); 
            return await newsApi.getAll();
        } else { return []; }
    },
    async delete(firebaseId) {
        if (db) {
            await deleteDoc(doc(db, "news", firebaseId));
            return await newsApi.getAll();
        } else { return []; }
    }
};

export const vacationApi = {
async getAllVacations() {
        if (!db) return [];
        try {
            // Aktuelles Jahr als Startpunkt (YYYY-01-01)
            const currentYear = new Date().getFullYear();
            const startOfYear = `${currentYear}-01-01`;

            // Query mit Filter
            const q = query(
                collection(db, "vacations"), 
                where("endDate", ">=", startOfYear), // Nur Urlaube, die dieses Jahr enden oder später
                orderBy("endDate", "asc") // Sortierung für den Index
            );
            
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (e) { 
            console.error("Fehler beim Laden:", e);
            // Fallback ohne Filter, falls Index fehlt
            const q = query(collection(db, "vacations"));
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        }
    },
    async addVacation(vacationData) {
        if (!db) return;
        try {
            let daysCount = 0;
            const workDays = calculateWorkDays(vacationData.startDate, vacationData.endDate);

            if (vacationData.type === 'half') {
                daysCount = 0.5;
            } else if (vacationData.type === 'workation') {
                daysCount = workDays * 0.5;
            } else {
                daysCount = workDays;
            }

            await addDoc(collection(db, "vacations"), {
                ...vacationData,
                daysCount, 
                rawDays: workDays, 
                createdAt: serverTimestamp()
            });
            return true;
        } catch (e) { throw e; }
    },
    async deleteVacation(vacationId) {
        if (!db) return;
        await deleteDoc(doc(db, "vacations", vacationId));
    }
};

export const authService = {
    async login(email, password) {
        if (auth) {
             const userCredential = await signInWithEmailAndPassword(auth, email, password);
             return userCredential.user;
        } else {
            return new Promise((resolve) => resolve({ uid: 'mock', email, role: 'user' }));
        }
    },
    async logout() { if (auth) await signOut(auth); }
};

export const eventApi = {
    async getAllEvents() {
        if (!db) return [];
        // Wir laden erstmal einfach alle Events. Performance-Optimierung (nach Jahr) können wir später machen.
        const q = query(collection(db, "events"), orderBy("startDate", "asc"));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    async addEvent(data) {
        if (!db) return;
        return await addDoc(collection(db, "events"), {
            ...data,
            createdAt: serverTimestamp()
        });
    },

    async deleteEvent(id) {
        if (!db) return;
        return await deleteDoc(doc(db, "events", id));
    },

    async getUpcoming(count = 3) {
        if (!db) return [];
        const today = new Date().toISOString().split('T')[0];
        // Hole Events, die heute oder in Zukunft starten
        const q = query(
            collection(db, "events"), 
            where("startDate", ">=", today),
            orderBy("startDate", "asc"),
            limit(count)
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },
};