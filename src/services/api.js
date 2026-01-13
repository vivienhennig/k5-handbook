import { auth, db } from '../config/firebase';
import { signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from 'firebase/auth';
import { 
    collection, addDoc, getDocs, doc, getDoc, setDoc, deleteDoc, 
    query, orderBy, serverTimestamp, updateDoc, where, limit 
} from 'firebase/firestore';
import { PUBLIC_HOLIDAYS as IMPORTED_HOLIDAYS } from '../config/data';

const PUBLIC_HOLIDAYS = IMPORTED_HOLIDAYS || [];

// --- HELPER: Arbeitstage ---
export const calculateWorkDays = (startStr, endStr) => {
    if (!startStr || !endStr) return 0;
    let count = 0;
    const loopDate = new Date(startStr);
    const endDate = new Date(endStr);
    if (loopDate > endDate) return 0;

    while (loopDate <= endDate) {
        const dayOfWeek = loopDate.getDay();
        const dateString = loopDate.toISOString().split('T')[0];
        const monthDay = dateString.slice(5); 
        const isWeekend = (dayOfWeek === 6) || (dayOfWeek === 0);
        const isHoliday = Array.isArray(PUBLIC_HOLIDAYS) && (
            PUBLIC_HOLIDAYS.includes(dateString) || 
            PUBLIC_HOLIDAYS.includes(monthDay)
        );
        if (!isWeekend && !isHoliday) count++;
        loopDate.setDate(loopDate.getDate() + 1);
    }
    return count;
};

// --- AUTH SERVICE (Wieder da!) --
export const authService = {
    // Vorhandener Login
    async login(email, password) {
        if (!auth) throw new Error("Auth not initialized");
        const cred = await signInWithEmailAndPassword(auth, email, password);
        return cred.user;
    },

    // Neue Registrierungs-Funktion
    async register(email, password) {
        if (!auth) throw new Error("Auth not initialized");
        // Erstellt den User in Firebase Auth
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        return cred.user;
    },

    async logout() { 
        if (auth) await signOut(auth); 
    }
};

// --- USER & PROFIL API ---
export const userApi = {
    async getAllUsers() {
        if (!db) return [];
        const snapshot = await getDocs(collection(db, "users"));
        return snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
    },
    async getUserData(userId, email = null) {
        if (!db) return { uid: userId, role: 'user' };
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) return { uid: userId, ...docSnap.data() };
        
        const initial = { 
            email: email || '', 
            displayName: email?.split('@')[0] || 'User', 
            role: 'user', 
            favorites: [],
            department: 'Marketing' 
        };
        await setDoc(docRef, initial);
        return { uid: userId, ...initial };
    },
    async updateUserProfile(userId, profileData) {
        if (!db) return;
        const userRef = doc(db, "users", userId);
        const updatePayload = {
            displayName: profileData.displayName,
            position: profileData.position || "",
            department: profileData.department || "Marketing",
            photoUrl: profileData.photoUrl || "",
            responsibilities: profileData.responsibilities || "",
            birthDate: profileData.birthDate || ""
        };
        await setDoc(userRef, updatePayload, { merge: true });
    },
    async updateUserRole(userId, role) {
        if (!db) return;
        await updateDoc(doc(db, "users", userId), { role });
    },
    async updateAdminUserStats(userId, stats) {
        if (!db) return;
        await updateDoc(doc(db, "users", userId), {
            vacationEntitlement: parseFloat(stats.entitlement),
            carryOverDays: parseFloat(stats.carryOver)
        });
    },
    async saveFavorites(userId, favorites) {
        if (!db) return;
        await updateDoc(doc(db, "users", userId), { favorites });
    }
};

// --- VACATION API ---
export const vacationApi = {
    async getAllVacations() {
        if (!db) return [];
        try {
            const snapshot = await getDocs(collection(db, "vacations"));
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (e) { return []; }
    },
    async addVacation(data) {
        if (!db) return;
        const workDays = calculateWorkDays(data.startDate, data.endDate);
        let finalCount = workDays;
        if (data.type === 'half') finalCount = 0.5;
        if (data.type === 'workation') finalCount = 0;

        return await addDoc(collection(db, "vacations"), {
            ...data,
            daysCount: finalCount,
            createdAt: serverTimestamp()
        });
    },
    async deleteVacation(id) {
        if (!db) return;
        await deleteDoc(doc(db, "vacations", id));
    }
};

// --- EVENTS API ---
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
        await deleteDoc(doc(db, "events", id));
    },
    async getUpcoming(count = 3) {
        if (!db) return [];
        const today = new Date().toISOString().split('T')[0];
        const q = query(collection(db, "events"), where("startDate", ">=", today), orderBy("startDate", "asc"), limit(count));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
};

// --- FEEDBACK API ---
export const feedbackApi = {
    async submit(data) {
        if (!db) return;
        await addDoc(collection(db, "feedback"), { ...data, createdAt: serverTimestamp(), status: 'open' });
    },
    async getAll() {
        if (!db) return [];
        const q = query(collection(db, "feedback"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
};