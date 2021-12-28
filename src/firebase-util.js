import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCLKGfa_YjvTaC5OFVxWSk1j20cJxQ59eM",
  authDomain: "fir-todolist-d3eaf.firebaseapp.com",
  projectId: "fir-todolist-d3eaf",
  storageBucket: "fir-todolist-d3eaf.appspot.com",
  messagingSenderId: "970719456495",
  appId: "1:970719456495:web:8581ae176b6de4ca13bf1a"
};

firebase.initializeApp(firebaseConfig);

// AUTHENTICATION

export const auth = firebase.auth; 

const provider = new firebase.auth.GoogleAuthProvider();

auth.languageCode = "es"; // AUTH LANGUAGE 

export const login = async () => {
  try {
    const response = await auth().signInWithPopup(provider);
    console.log(response);
  } catch (error) {
    throw new Error(error);
  }
}

export const logout = () => {
  auth().signOut();
}

// FIRESTORE 

const db = firebase.firestore();

export const insert = async (item) => {
  try {                     // SI NO EXISTE LO CREA     // AÑADIR ITEM
    const response = await db.collection('todos').add(item);
    return response;

  } catch (error) {
    throw new Error(error)
  }
}

export const getItems = async (uid) => {
  try {
    let items = [];
    const response = await db
    .collection('todos')
    .where('userid', "==", uid)
    .get();

    items = response.docs.map(doc => doc.data())

    return items
    
  } catch (error) {
    throw new Error(error)
  }
}

export async function update(id, item) {
  let docId;
  
  try {
    const doc = await db
    .collection("todos")
    .where("id", "==", id)
    .get();
    
    doc.forEach(i => {
      docId = i.id;
    })

    await db
    .collection("todos")
    .doc(docId)
    .update({ completed: item.completed });
  } catch (error) {
    console.error(error);
  }
}
