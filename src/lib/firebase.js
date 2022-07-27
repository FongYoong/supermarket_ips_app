import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set, limitToFirst, startAfter } from 'firebase/database';

const firebaseConfig = {
    apiKey: 'AIzaSyD_x7HHCmyzOC3KEzUEIGNFxry8YteM4Mw',
    authDomain: 'idp-vlc.firebaseapp.com',
    databaseURL: 'https://idp-vlc-default-rtdb.asia-southeast1.firebasedatabase.app',
    projectId: 'idp-vlc',
    storageBucket: 'idp-vlc.appspot.com',
};
export const firebaseInstance = initializeApp(firebaseConfig);
export const database = getDatabase(firebaseInstance);

export const toArray = (snapshot) => {
  const array = [];
  snapshot.forEach((childSnapshot) => {
      array.push({
        id: childSnapshot.key,
        ...childSnapshot.val()
      })
  })
  return array;
}

export const getProductsRef = () => {
  // limitToFirst
  return ref(database, '/products');
}

// export const getProducts = (id, onSuccess) => {
//   //const database = getDatabase();
//   const reference = ref(database, '/products');
//   onValue(reference, (snapshot) => {
//     const array = [];
//     snapshot.forEach((childSnapshot) => {
//       array.push(childSnapshot.val())
//     })
//     onSuccess(array)
//   });
// }