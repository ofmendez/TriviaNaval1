import {getUserData, DeleteUser} from "./database.js";
import {emailToId} from './utils.js'

// populate table with new data
function updateTable(users, values) {
    const tbody = document.getElementById("t");
    // clear existing data from tbody if it exists
    tbody.innerHTML = "";
    let p = "";
    let id =1;
    users.forEach(user => {
        p += "<tr>";
        p += `<td>${id++}</td>`;
            values.forEach(value => {
                if (value === 'acceptAssesment'){
                    if( user[value] ==="Si"){
                        p += "<td>Si</td>";
                        p += "<td>&nbsp;</td>";
                    }else{
                        p += "<td>&nbsp;</td>";
                        p += "<td>No</td>";
                    }
                    return;
                } 
                p += "<td>" + user[value] + "</td>";
            })
        p += `<td><button onclick="Delete('${user["email"]}')">DELETE!</button></td>`;
        p += "</tr>";
    })

    tbody.insertAdjacentHTML("beforeend", p);
}

window.Delete = (email)=>{
    DeleteUser(emailToId( email)).then((res)=>{
        console.log("Borrado!: ",emailToId( email));
        Reload()
    }).catch((e)=>console.log("Problema borrando: "+e));
}

window.Reload = ()=>{
    getUserData().then((usrObj)=>{
        let users = []
        let usersYes = []
        for (const u in usrObj) 
            if (usrObj.hasOwnProperty(u)) 
                users.push(usrObj[u]);
            
        
        users.sort((a, b) => { return b.score - a.score; });
        document.getElementById('countYes').innerHTML =`(${users.filter(u => u.acceptAssesment === "Si").length})`
        document.getElementById('countNo').innerHTML =`(${users.filter(u => u.acceptAssesment === "No").length})`
        console.log("da: ",users.length);
        updateTable(users, ['acceptAssesment','username', 'email', 'score', 'company', 'mailBox']);
        
    })
}

function example() {
    // fetch initial data and populate table
    fetch("https://2k03zcp0bd.execute-api.us-east-1.amazonaws.com/ninjas", {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
        }
    }).then((res) => {
        res.json().then((data) => {
            updateTable(data.Items, [ 'acceptAssesment', 'email', 'score', 'timestamp', 'timestamp']);
        }).catch((err) => {
            console.log("ERROR: " + err);
        });
    });
}