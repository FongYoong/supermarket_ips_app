import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set, update, limitToFirst, startAfter, push } from 'firebase/database';

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

export const getChatMessagesRef = (authUID) => {
  return ref(database, `/customer_chats/${authUID}/messages/`);
}

export const addChatMessage = async (authUID, data, successHandler, errorHandler) => {
  const currentTimeMillis = new Date().getTime();
  const newChildRef = push(ref(database, `/customer_chats/${authUID}/messages/`));
  const messageId = newChildRef.key;
  set(newChildRef, {
      ...data,
      dateCreated: currentTimeMillis,
  }).then(() => successHandler(messageId)).catch(errorHandler);
}

export const updateCustomerLocation = async (authUID, data, successHandler, errorHandler) => {
  const currentTimeMillis = new Date().getTime();
  const nodeRef = ref(database, `/customer_locations/${authUID}/`);
  update(nodeRef, {
      ...data,
      dateCreated: currentTimeMillis,
  }).then(successHandler).catch(errorHandler);
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