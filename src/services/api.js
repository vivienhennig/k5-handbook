import { auth, db } from '../config/firebase.js';
import { signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from 'firebase/auth';
import { 
    collection, addDoc, getDocs, doc, getDoc, setDoc, deleteDoc, 
    query, orderBy, serverTimestamp, updateDoc, where, limit 
} from 'firebase/firestore';
import { PUBLIC_HOLIDAYS as IMPORTED_HOLIDAYS } from '../config/data.js';

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

// --- AUTH SERVICE --
export const authService = {
    async login(email, password) {
        if (!auth) throw new Error("Auth not initialized");
        const cred = await signInWithEmailAndPassword(auth, email, password);
        return cred.user;
    },
    async register(email, password) {
        if (!auth) throw new Error("Auth not initialized");
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
        // Wir ändern startDate zu start
        const q = query(collection(db, "events"), orderBy("start", "asc"));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },
    
    async addEvent(data) {
        if (!db) return;
        // Wir stellen sicher, dass 'start' immer gesetzt ist, 
        // auch wenn wir aus Versehen 'startDate' übergeben
        const finalData = {
            ...data,
            start: data.start || data.startDate,
            end: data.end || data.endDate || data.start || data.startDate
        };
        return await addDoc(collection(db, "events"), { 
            ...finalData, 
            createdAt: serverTimestamp() 
        });
    },

    async getUpcoming(count = 3) {
        if (!db) return [];
        const today = new Date().toISOString().split('T')[0];
        // Auch hier: 'start' statt 'startDate'
        const q = query(
            collection(db, "events"), 
            where("start", ">=", today), 
            orderBy("start", "asc"), 
            limit(count)
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },
    async deleteEvent(id) {
        if (!db) return;
        await deleteDoc(doc(db, "events", id));
    },
    async updateRSVP(eventId, userId, status, userName) {
        if (!db) return;
        const eventRef = doc(db, "events", eventId);
        await updateDoc(eventRef, {
            [`participants.${userId}`]: {
                status: status,
                name: userName,
                updatedAt: serverTimestamp()
            }
        });
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
    },
    async resolve(id) {
        if (!db) return;
        const feedbackRef = doc(db, "feedback", id);
        await updateDoc(feedbackRef, { status: 'resolved' });
    },
    async delete(id) {
        if (!db) return;
        const feedbackRef = doc(db, "feedback", id);
        await deleteDoc(feedbackRef);
    }
};

// --- GUIDELINE & WIKI API ---
export const contentApi = {
    /**
     * Lädt den Inhalt einer spezifischen Wiki-Seite
     */
    async getGuideline(id) {
        if (!db) return null;
        try {
            const docRef = doc(db, "guidelines", id);
            const docSnap = await getDoc(docRef);
            return docSnap.exists() ? docSnap.data() : null;
        } catch (error) {
            console.error("Error fetching guideline:", error);
            return null;
        }
    },

    /**
     * Speichert oder aktualisiert den Inhalt einer Wiki-Seite
     */
    async updateGuideline(id, data) {
        if (!db) return;
        try {
            const docRef = doc(db, "guidelines", id);
            await setDoc(docRef, { 
                ...data, 
                lastUpdated: serverTimestamp() 
            }, { merge: true });
        } catch (error) {
            console.error("Error updating guideline:", error);
            throw error;
        }
    },

    /**
     * NEU: Lädt die Liste der benutzerdefinierten Wiki-Seiten für die Sidebar
     */
    async getNavigation() {
        if (!db) return { customWikis: [] };
        try {
            const docRef = doc(db, "settings", "navigation");
            const docSnap = await getDoc(docRef);
            return docSnap.exists() ? docSnap.data() : { customWikis: [] };
        } catch (error) {
            console.error("Error loading navigation:", error);
            return { customWikis: [] };
        }
    },

    /**
     * NEU: Speichert die Liste der benutzerdefinierten Wiki-Seiten
     */
    async updateNavigation(customWikis) {
        if (!db) return;
        try {
            const docRef = doc(db, "settings", "navigation");
            await setDoc(docRef, { 
                customWikis,
                updatedAt: serverTimestamp()
            }, { merge: true });
        } catch (error) {
            console.error("Error updating navigation:", error);
            throw error;
        }
    },

    async deleteWiki(id, currentCustomWikis) {
        if (!db) return;
        try {
            // 1. Den Inhalt löschen
            await deleteDoc(doc(db, "guidelines", `wiki_${id}`));
            
            // 2. Aus der Navigationsliste entfernen
            const updatedList = currentCustomWikis.filter(w => w.id !== id);
            const navRef = doc(db, "settings", "navigation");
            await setDoc(navRef, { 
                customWikis: updatedList,
                updatedAt: serverTimestamp()
            }, { merge: true });
            
            return updatedList;
        } catch (error) {
            console.error("Error deleting wiki:", error);
            throw error;
        }
    },

    async getAllWikiData() {
        if (!db) return [];
        try {
            const snapshot = await getDocs(collection(db, "guidelines"));
            return snapshot.docs.map(doc => ({ 
                id: doc.id.replace('wiki_', ''), 
                ...doc.data() 
            }));
        } catch (error) {
            console.error("Fehler beim Laden aller Wikis:", error);
            return [];
        }
    },

    async getUserFavorites(userId) {
        if (!db || !userId) return [];
        try {
            const docRef = doc(db, "user_settings", userId);
            const docSnap = await getDoc(docRef);
            return docSnap.exists() ? (docSnap.data().favorites || []) : [];
        } catch (error) {
            console.error("Fehler beim Laden der Favoriten:", error);
            return [];
        }
    },

    async toggleFavorite(userId, wikiId) {
        if (!db || !userId) return;
        const docRef = doc(db, "user_settings", userId);
        const docSnap = await getDoc(docRef);
        
        if (!docSnap.exists()) {
            await setDoc(docRef, { favorites: [wikiId] });
            return true;
        } else {
            const favs = docSnap.data().favorites || [];
            const isFav = favs.includes(wikiId);
            await updateDoc(docRef, {
                favorites: isFav ? arrayRemove(wikiId) : arrayUnion(wikiId)
            });
            return !isFav;
        }
    },

    async logActivity(wikiId, title, user, type = 'update') {
    try {
        const logRef = doc(collection(db, "activity_log"));
        await setDoc(logRef, {
                wikiId,
                title,
                userName: user.displayName || user.email,
                type, // 'create' oder 'update'
                timestamp: new Date().toISOString()
            });
        } catch (e) { console.error("Activity Log Error:", e); }
    },

    async getLatestActivities(limitCount = 5) {
        try {
            const q = query(
                collection(db, "activity_log"), 
                orderBy("timestamp", "desc"), 
                limit(limitCount)
            );
            const snap = await getDocs(q);
            return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (e) { return []; }
    },

    getTicketSettings: async () => {
        try {
            // Wir nutzen hier 'settings_tickets' als festen Bezeichner
            return await contentApi.getGuideline('settings_tickets');
        } catch (error) {
            console.error("Fehler beim Laden der Ticket-Settings:", error);
            return null;
        }
    },

    // Speichert die Phasen und Preise
    updateTicketSettings: async (ticketData) => {
        try {
            // ticketData enthält { phases: [...], types: [...] }
            const dataToSave = {
                ...ticketData,
                lastUpdated: new Date().toISOString(),
                updatedBy: auth.currentUser?.displayName || 'Admin'
            };
            return await contentApi.updateGuideline('settings_tickets', dataToSave);
        } catch (error) {
            console.error("Fehler beim Speichern der Ticket-Settings:", error);
            throw error;
        }
    }
};

// --- TICKETING EXTERNAL API ---
export const ticketingApi = {
    getStats: async () => {
        try {
            const response = await fetch('https://vivenu.com/api/tickets?event=6917386798fabc2c10b72bbf', {
            headers: { 'Authorization': `Bearer key_9f082821163bb109aacdc390b03103bb1df3b3953f3369bdead5da6050f0c5bd5e971ecb453f22e921580a5d693a8514` }
        });
        const rawJson = await response.json();
        
        const retailerIds = [
            "69207918025da6af0e3e79c8", "69207b96025da6af0e3e79c9",
            "69207c47025da6af0e3e79ca", "69207ed4025da6af0e3e79cb",
            "69207f24025da6af0e3e79cc", "69207f7b025da6af0e3e79cd",
            "69207fc2025da6af0e3e79ce", "692080c0025da6af0e3e79d0",
            "69208019025da6af0e3e79cf", "6920968d025da6af0e3e79e3",
            "6920975a025da6af0e3e79e4", "692f07b7bc35a35414fedfa5",
            "69208f5e025da6af0e3e79db", "69208faf025da6af0e3e79dc",
            "69174a8aea39e721cb39c702", "69174b0cea39e721cb39c703",
            "69208144025da6af0e3e79d1"
        ];

        let retailerCount = 0;
        
        // Wir zählen nur die Retailer
        if (rawJson.rows && Array.isArray(rawJson.rows)) {
            rawJson.rows.forEach(ticket => {
                if (retailerIds.includes(ticket.ticketTypeId)) {
                    retailerCount++;
                }
            });
        }

        const total = rawJson.total || 0;
        // Der Rest ist Non-Retailer (garantiert 100% in der Summe)
        const nonRetailerCount = total - retailerCount;

        return {
            total: total,
            retailer: retailerCount,
            nonRetailer: Math.max(0, nonRetailerCount) // Verhindert negative Werte bei API-Lags
        }; 
    } catch (e) {
        console.error("Ticketing Stats Error", e);
        return { total: 0, retailer: 0, nonRetailer: 0 };
    }
}
};

