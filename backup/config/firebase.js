import * as firebase from "firebase";

const firebaseConfig = {
	apiKey: "AIzaSyAojl7i-4Jd2wDoZvWP6WTbRYUgIUWruMc",
	authDomain: "ylo-cabs.firebaseapp.com",
	projectId: "ylo-cabs",
	storageBucket: "ylo-cabs.appspot.com",
	messagingSenderId: "112736982248",
	appId: "1:112736982248:web:5058045c8f17137fe4255d",
	measurementId: "G-KTMP0RQZ7K",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export default firebase;
