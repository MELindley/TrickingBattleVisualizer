// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { GoogleAuthProvider } from 'firebase/auth'

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: 'AIzaSyB5GoO6U6zTFlVo_Zjh_qhni9v6AvqHD6s',
	authDomain: 'trickscore-961d1.firebaseapp.com',
	projectId: 'trickscore-961d1',
	storageBucket: 'trickscore-961d1.appspot.com',
	messagingSenderId: '620152438460',
	appId: '1:620152438460:web:8ec55fc1c2ee5f3ab39ab9',
	measurementId: 'G-084LDL5HNW'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)
const auth = getAuth(app)
const provider = new GoogleAuthProvider()
const firestore = getFirestore(app)

export { auth, provider, analytics, firestore }
