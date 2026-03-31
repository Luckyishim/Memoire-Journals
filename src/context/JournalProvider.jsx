import { useEffect, useState } from "react";
import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    orderBy,
    onSnapshot,
    where,
    serverTimestamp
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../index";
import { JournalContext } from "../context";
import { parsePeople } from "../utils/parsePeople";

export function JournalProvider({ children }) {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let unsubscribeSnapshot = null;

        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (unsubscribeSnapshot) unsubscribeSnapshot();

            if (!user) {
                setEntries([]);
                setLoading(false);
                return;
            }

            setLoading(true);
            const q = query(
                collection(db, "entries"),
                where("userId", "==", user.uid),
                orderBy("createdAt", "desc")
            );

            unsubscribeSnapshot = onSnapshot(
                q,
                (snapshot) => {
                    const fetchedEntries = snapshot.docs.map(d => ({
                        id: d.id,
                        ...d.data(),
                        createdAt: d.data().createdAt?.toDate(),
                        updatedAt: d.data().updatedAt?.toDate()
                    }));
                    setEntries(fetchedEntries);
                    setLoading(false);
                },
                (err) => {
                    console.error("Error fetching entries:", err);
                    setError(err.message);
                    setLoading(false);
                }
            );
        });

        return () => {
            unsubscribeAuth();
            if (unsubscribeSnapshot) unsubscribeSnapshot();
        };
    }, []);

    const addEntry = async (entryData) => {
        try {
            const user = auth.currentUser;
            if (!user) throw new Error("User not authenticated");

            const newEntry = {
                title: entryData?.title || "Untitled",
                content: entryData?.content || "",
                userId: user.uid,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            };

            const docRef = await addDoc(collection(db, "entries"), newEntry);
            return { id: docRef.id, ...newEntry };
        } catch (err) {
            console.error("Error adding entry:", err);
            throw err;
        }
    };

    const updateEntry = async (id, updateData) => {
        try {
            const entryRef = doc(db, "entries", id);
            await updateDoc(entryRef, {
                ...updateData,
                updatedAt: serverTimestamp()
            });
        } catch (err) {
            console.error("Error updating entry:", err);
            throw err;
        }
    };

    const deleteEntry = async (id) => {
        try {
            await deleteDoc(doc(db, "entries", id));
        } catch (err) {
            console.error("Error deleting entry:", err);
            throw err;
        }
    };

    const getEntryById = (id) => entries.find(entry => entry.id === id);

    const searchEntries = (searchTerm) => {
        if (!searchTerm.trim()) return entries;
        const term = searchTerm.toLowerCase();
        return entries.filter(entry =>
            entry.title?.toLowerCase().includes(term) ||
            entry.content?.toLowerCase().includes(term)
        );
    };

    // Compute people from all entries
    const getPeopleFromEntries = () => {
        const peopleMap = {};
        entries.forEach(entry => {
            const names = parsePeople(entry.content || "");
            names.forEach(name => {
                if (!peopleMap[name]) {
                    peopleMap[name] = { name, entryIds: [], count: 0 };
                }
                peopleMap[name].entryIds.push(entry.id);
                peopleMap[name].count++;
            });
        });
        return Object.values(peopleMap);
    };

    const value = {
        entries,
        loading,
        error,
        addEntry,
        updateEntry,
        deleteEntry,
        getEntryById,
        searchEntries,
        getPeopleFromEntries,
        people: getPeopleFromEntries()
    };

    return (
        <JournalContext.Provider value={value}>
            {children}
        </JournalContext.Provider>
    );
}