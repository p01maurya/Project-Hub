// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';
import {doc, getFirestore, setDoc, getDoc, addDoc, collection, getDocs, query, where, deleteDoc,} from "firebase/firestore";
import {getDownloadURL, getStorage, ref, uploadBytesResumable,} from "firebase/storage"; 

const firebaseConfig = {
  apiKey: "AIzaSyDVg62gjjpCBWq4kfE58Nq1Zncwyb4EASA",
  authDomain: "project-hub-43c21.firebaseapp.com",
  projectId: "project-hub-43c21",
  storageBucket: "project-hub-43c21.appspot.com",
  messagingSenderId: "929660929640",
  appId: "1:929660929640:web:2a1e6ee65677f56125dddd",
  measurementId: "G-P7XVEH4KEZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

const storage = getStorage(app);

const updateUserDatabase = async (user, uid) => {
  if (typeof user !== "object") return;

  const docRef = doc(db, "users", uid);
  await setDoc(docRef, { ...user, uid });
};

const getUserFromDatabase = async (uid) => {
  const docRef = doc(db, "users", uid);
  const result = await getDoc(docRef);

  if (!result.exists()) return null;
  return result.data();
};

const uploadImage = (file, progressCallback, urlCallback, errorCallback) => {
  if (!file) {
    errorCallback("File not found");
    return;
  }

  const fileType = file.type;
  const fileSize = file.size / 1024 / 1024;

  if (!fileType.includes("image")) {
    errorCallback("File must an image");
    return;
  }
  if (fileSize > 2) {
    errorCallback("File must smaller than 2MB");
    return;
  }

  const storageRef = ref(storage, `images/${file.name}`);

  const task = uploadBytesResumable(storageRef, file);

  task.on(
    "state_changed",
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      progressCallback(progress);
    },
    (error) => {
      errorCallback(error.message);
    },
    () => {
      getDownloadURL(storageRef).then((url) => {
        urlCallback(url);
      });
    }
  );
};

const addProjectInDatabase = async (project) => {
  if (typeof project !== "object") return;

  const collectionRef = collection(db, "projects");
  await addDoc(collectionRef, { ...project });
};

const updateProjectInDatabase = async (project, pid) => {
  if (typeof project !== "object") return;

  const docRef = doc(db, "projects", pid);
  await setDoc(docRef, { ...project });
};

const getAllProjects = async () => {
  return await getDocs(collection(db, "projects"));
};

const getAllProjectsForUser = async (uid) => {
  if (!uid) return;

  const collectionRef = collection(db, "projects");
  const condition = where("refUser", "==", uid);
  const dbQuery = query(collectionRef, condition);

  return await getDocs(dbQuery);
};

const deleteProject = async (pid) => {
  const docRef = doc(db, "projects", pid);
  await deleteDoc(docRef);
};

export {
  app as default, auth, db, updateUserDatabase, getUserFromDatabase, uploadImage, addProjectInDatabase, updateProjectInDatabase, getAllProjects, getAllProjectsForUser, deleteProject,
};
