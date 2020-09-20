import * as firebase from 'firebase';
require("@firebase/firestore")

var firebaseConfig = {
    apiKey: "AIzaSyDdSyqz311G0waJETndffGll6VsN0p15U4",
    authDomain: "willyapp-9d1bb.firebaseapp.com",
    databaseURL: "https://willyapp-9d1bb.firebaseio.com",
    projectId: "willyapp-9d1bb",
    storageBucket: "willyapp-9d1bb.appspot.com",
    messagingSenderId: "642238590089",
    appId: "1:642238590089:web:964be6f850aabf53ce6a58"
  };
  firebase.initializeApp(firebaseConfig);

  export default firebase.firestore()