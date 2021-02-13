import firebase from 'firebase';

var firebaseConfig = {
   apiKey: "AIzaSyCtJWEiHkscsBR9mhAV8PzPn7Ijy46bOdI",
   authDomain: "barter-app-1d780.firebaseapp.com",
   projectId: "barter-app-1d780",
   storageBucket: "barter-app-1d780.appspot.com",
   messagingSenderId: "544892223600",
   appId: "1:544892223600:web:7f83694a6daecd2992f4b5"
};

firebase.initializeApp(firebaseConfig);

export default firebase.firestore();