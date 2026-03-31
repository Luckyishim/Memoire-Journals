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
    where
} from "firebase/firestore";
import { auth, db } from "../index";
import { JournalContext } from "../context";

export function JournalProvider({ children }) {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const user = auth.currentUser;
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

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const fetchedEntries = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    createdAt: doc.data().createdAt?.toDate(),
                    updatedAt: doc.data().updatedAt?.toDate()
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

        return () => unsubscribe();
    }, []);

    // Add a new entry
    const addEntry = async (entryData) => {
        try {
            const user = auth.currentUser;
            if (!user) throw new Error("User not authenticated");

            const newEntry = {
                title: entryData.title || "Untitled",
                content: entryData.content || "",
                userId: user.uid,
                createdAt: new Date(),
                updatedAt: new Date()
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
                title: updateData.title || "Untitled",
                content: updateData.content || "",
                updatedAt: new Date()
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

   
    const getEntriesByDate = (date) => {
        const targetDate = new Date(date);
        targetDate.setHours(0, 0, 0, 0);

        return entries.filter(entry => {
            const entryDate = new Date(entry.createdAt);
            entryDate.setHours(0, 0, 0, 0);
            return entryDate.getTime() === targetDate.getTime();
        });
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
        getEntriesByDate
    };

    return (
        <JournalContext.Provider value={value}>
            {children}
        </JournalContext.Provider>
    );
}