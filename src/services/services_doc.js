import { db } from "../firebase-config";

import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

const docCollectionRef = collection(db, "students");

class DocDataService {
  addDocs = (newDoc) => {
    return addDoc(docCollectionRef, newDoc);
  };
  

  updateDoc = (id, updatedDoc) => {
    const DocDoc = doc(db, "students", id);
    return updateDoc(DocDoc, updatedDoc);
  };

  deleteDoc = (id) => {
    const DocDoc = doc(db, "students", id);
    return deleteDoc(DocDoc);
  };

  getAllDocs = () => {
    return getDocs(docCollectionRef);
  };

  getDoc = (id) => {
    const DocDoc = doc(db, "students", id);
    return getDoc(DocDoc);
  };
}

export default new DocDataService();