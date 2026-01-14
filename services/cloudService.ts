
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  onSnapshot, 
  updateDoc 
} from 'firebase/firestore';

let db: any = null;

export const initFirebase = (config: any) => {
  try {
    const app = initializeApp(config);
    db = getFirestore(app);
    return true;
  } catch (error) {
    console.error("Erro ao iniciar Firebase:", error);
    return false;
  }
};

export const saveToCloud = async (collectionName: string, id: string, data: any) => {
  if (!db) return;
  try {
    await setDoc(doc(db, collectionName, id), {
      ...data,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error(`Erro ao salvar em ${collectionName}:`, error);
  }
};

export const syncCollection = (collectionName: string, callback: (data: any[]) => void) => {
  if (!db) return () => {};
  return onSnapshot(collection(db, collectionName), (snapshot) => {
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(data);
  });
};

export const getCloudDoc = async (collectionName: string, id: string) => {
  if (!db) return null;
  const docRef = doc(db, collectionName, id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
};
