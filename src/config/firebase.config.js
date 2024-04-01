    import {getApp,getApps,initializeApp} from 'firebase/app'
    import {getAuth} from 'firebase/auth'
    import {getFirestore} from 'firebase/firestore'
    import {getStorage} from 'firebase/storage'


    // Your web app's Firebase configuration
    const firebaseConfig = {
        

            // apiKey: "AIzaSyBNSCkQCdD7YnlERmMR4DZpLtP-F_wtINA",
            // authDomain: "react-cv-builder-app.firebaseapp.com",
            // projectId: "react-cv-builder-app",
            // storageBucket: "react-cv-builder-app.appspot.com",
            // messagingSenderId: "434764566615",
            // appId: "1:434764566615:web:ae52895264cd6706fa1312"
          
        apiKey: import.meta.env.REACT_APP_API_KEY,
        authDomain: import.meta.env.REACT_APP_AUTH_DOMAIN,
        projectId: import.meta.env.REACT_APP_PROJECT_ID,
        storageBucket: import.meta.env.REACT_APP_STORAGE_BUCKET,
        messagingSenderId: import.meta.env.REACT_APP_MESSAGING_SENDER_ID,
        appId: import.meta.env.REACT_APP_APP_ID,
    };


    const app=getApps.length>0?getApp():initializeApp(firebaseConfig);
    const auth=getAuth(app);
    const db=getFirestore(app);
    const storage=getStorage(app);


    export {auth,db,storage}

