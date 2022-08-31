import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.9.3/firebase-app.js'
import { getDatabase, set , ref,onValue } from 'https://www.gstatic.com/firebasejs/9.9.3/firebase-database.js'
import {loadCredentials} from './files.js'

let firebaseConfig = {}
let database ={}
let app = {}
let existDatabase = false;


const getDB = function (){
    return new Promise((resolve,reject)=>{
        if (existDatabase){
            console.log("db", database);
            resolve(database)
        } else{
            existDatabase =true;
            loadCredentials().then((res)=>{
                firebaseConfig =res;
                app = initializeApp(firebaseConfig);
                database = getDatabase(app);
                console.log("creating", database);
                resolve(database);
            });
        }
        // writeUserData('fabian_email', 'fabiname', 'elEmail@mailSI.com', 'this is a url')
    });
};

export function getUserData() {
    return new Promise((resolve,reject)=>{
        getDB().then((db)=>{
            const starCountRef = ref(db, '/users');
            onValue(starCountRef, (snapshot) => {
                resolve(snapshot.val())
            }, {
                onlyOnce: false
            });
        }).catch((e)=> reject("error getDB: "+e))
    });
}


export function createUserData(userId, email, name, company, acceptAssesment) {
    return new Promise((resolve,reject)=>{
        getDB().then((db)=>{
            set(ref(db, 'users/' + userId), {
                username: name,
                email: email,
                company: company,
                acceptAssesment: acceptAssesment,
                score : 0
            }).then((res)=> resolve("writted"));
        }).catch((e)=> reject("error getDB: "+e))
    });
}

// export {createUserData }