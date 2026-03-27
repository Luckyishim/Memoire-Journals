import { initializeApp } from 'firebase/app'
// import { getAnalytics } from "firebase/analytics";
import { getAuth, onAuthStateChanged} from 'firebase/auth'


const firebaseApp = initializeApp({
    apiKey: "AIzaSyB-6A30SVNpz_Hlhy3uPSv2WPCLt69fVIc",
    authDomain: "lucifero-5cf09.firebaseapp.com",
    projectId: "lucifero-5cf09",
    storageBucket: "lucifero-5cf09.firebasestorage.app",
    messagingSenderId: "430538217630",
    appId: "1:430538217630:web:e377f3b955522f6bd2438f",
    measurementId: "G-2X97S8E2HE"
})
export const auth = getAuth(firebaseApp)

//Detech Auth State
onAuthStateChanged(auth, user => {
    if(user != null){
        console.log('logged in!')
    }else{
        console.log('No User')
    }
})