import { auth, db } from '../config/firebase';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { collection, addDoc, getDocs, doc, getDoc, setDoc, deleteDoc, query, orderBy, serverTimestamp, updateDoc, where, limit } from 'firebase/firestore';
import { INITIAL_NEWS, PUBLIC_HOLIDAYS } from '../config/data';

// HILFSFUNKTION: Arbeitstage berechnen
export const calculateWorkDays = (startStr, endStr) => {
    let count = 0;
    const curDate = new Date(startStr);
    const endDate = new Date(endStr);

    while (curDate <= endDate) {
        const dayOfWeek = curDate.getDay();
        const dateString = curDate.toISOString().split('T')[0];
        const monthDay = dateString.slice(5); 

        const isWeekend = (dayOfWeek === 6) || (dayOfWeek === 0);
        const isHoliday = PUBLIC_HOLIDAYS.includes(dateString) || PUBLIC_HOLIDAYS.includes(monthDay);

        if (!isWeekend && !isHoliday) {
            count++;
        }
        curDate.setDate(curDate.getDate() + 1);
    }
    return count;
};

// --- FEEDBACK API (NEU & ERWEITERT) ---
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
                return querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    return { 
                        id: doc.id, 
                        ...data, 
                        // Sicherstellen, dass createdAt ein String ist
                        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString() 
                    };
                });
            } catch (e) { return []; }
        } else { return []; }
    },
    // Eintrag löschen
    async delete(id) {
        if (!db) return;
        await deleteDoc(doc(db, "feedback", id));
    },
    // Status auf 'resolved' setzen
    async resolve(id) {
        if (!db) return;
        const ref = doc(db, "feedback", id);
        await updateDoc(ref, { status: 'resolved' });
    }
};

// --- USER API ---
export const userApi = {
    async getUserData(userId, email = null) {
        if (!db) return { favorites: [], readHistory: {}, role: 'user' };
        try {
            const docRef = doc(db, "users", userId);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
                const data = docSnap.data();
                const updates = {};
                let needsUpdate = false;

                if (email && !data.email) {
                    updates.email = email;
                    needsUpdate = true;
                }
                if (email && !data.displayName) {
                    let genName = email.split('@')[0];
                    genName = genName.charAt(0).toUpperCase() + genName.slice(1);
                    updates.displayName = genName;
                    needsUpdate = true;
                }
                if (needsUpdate) {
                    await setDoc(docRef, updates, { merge: true });
                }
                return { ...data, ...updates };

            } else {
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
                    displayName: genName 
                };
                await setDoc(docRef, initialData);
                return initialData;
            }
        } catch (e) {
            return { favorites: [], readHistory: {}, role: 'user' };
        }
    },
    async saveFavorites(userId, newFavorites) {
        if (!db) return;
        const userRef = doc(db, "users", userId);
        await setDoc(userRef, { favorites: newFavorites }, { merge: true });
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
    async updateAdminUserStats(targetUid, stats) {
        if(!db) return;
        const userRef = doc(db, "users", targetUid);
        await updateDoc(userRef, {
            vacationEntitlement: parseFloat(stats.entitlement),
            carryOverDays: parseFloat(stats.carryOver)
        });
    }
};

// --- NEWS API ---
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

// --- VACATION API ---
export const vacationApi = {
    async getAllVacations() {
        if (!db) return [];
        try {
            const currentYear = new Date().getFullYear();
            const startOfYear = `${currentYear}-01-01`;
            
            // Versuch mit Filter (braucht evtl. Index)
            try {
                const q = query(collection(db, "vacations"), where("endDate", ">=", startOfYear), orderBy("endDate", "asc"));
                const snapshot = await getDocs(q);
                return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            } catch(indexError) {
                // Fallback ohne Filter, falls Index noch nicht erstellt ist
                const q = query(collection(db, "vacations"));
                const snapshot = await getDocs(q);
                return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            }
        } catch (e) { return []; }
    },
    async addVacation(vacationData) {
        if (!db) return;
        const workDays = calculateWorkDays(vacationData.startDate, vacationData.endDate);
        let daysCount = workDays;
        if (vacationData.type === 'half') daysCount = 0.5;
        if (vacationData.type === 'workation') daysCount = workDays * 0.5;

        await addDoc(collection(db, "vacations"), {
            ...vacationData,
            daysCount, 
            rawDays: workDays, 
            createdAt: serverTimestamp()
        });
        return true;
    },
    async deleteVacation(vacationId) {
        if (!db) return;
        await deleteDoc(doc(db, "vacations", vacationId));
    }
};

// --- EVENT API ---
export const eventApi = {
    async getAllEvents() {
        if (!db) return [];
        const q = query(collection(db, "events"), orderBy("startDate", "asc"));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },
    async addEvent(data) {
        if (!db) return;
        return await addDoc(collection(db, "events"), { ...data, createdAt: serverTimestamp() });
    },
    async deleteEvent(id) {
        if (!db) return;
        return await deleteDoc(doc(db, "events", id));
    },
    async getUpcoming(count = 3) {
        if (!db) return [];
        const today = new Date().toISOString().split('T')[0];
        try {
             const q = query(collection(db, "events"), where("startDate", ">=", today), orderBy("startDate", "asc"), limit(count));
             const snapshot = await getDocs(q);
             return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch(e) { return []; }
    },
};

// --- AUTH ---
export const authService = {
    async login(email, password) {
        if (auth) {
             const userCredential = await signInWithEmailAndPassword(auth, email, password);
             return userCredential.user;
        }
    },
    async logout() { if (auth) await signOut(auth); }
};