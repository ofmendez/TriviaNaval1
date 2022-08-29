    import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.9.3/firebase-app.js'
    import { getDatabase, set, ref } from 'https://www.gstatic.com/firebasejs/9.9.3/firebase-database.js'
    import { getAuth, signInAnonymously } from 'https://www.gstatic.com/firebasejs/9.9.3/firebase-auth.js'
    const firebaseConfig = {}
    const app = initializeApp(firebaseConfig);
    const database = getDatabase(app);
    // const auth = getAuth();
    function writeUserData(userId, name, email, imageUrl) {
        // signInAnonymously(auth).then(() => {
            set(ref(database, 'users/' + userId), {
                username: name,
                email: email,
                profile_picture : imageUrl
            });
        // }).catch((error) => {
        //     const errorCode = error.code;
        //     const errorMessage = error.message;
        // });
    }
    export {writeUserData}