import {getUserData, DeleteUser} from "./database.js";
import {emailToId} from './utils.js'

// populate table with new data
function updateTable(users, values) {
    const tbody = document.getElementById("t");
    // clear existing data from tbody if it exists
    tbody.innerHTML = "";
    var p = "";
    users.forEach(user => {
        p += "<tr>";
            values.forEach(value => {
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
    getUserData().then((usrs)=>{
        let users = []
        for (const u in usrs) 
            if (usrs.hasOwnProperty(u)) 
                users.push(usrs[u]);
        users.sort((a, b) => { return b.score - a.score; });
        updateTable(users, ['username', 'email', 'score', 'company']);
        
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
            updateTable(data.Items, ['email', 'score', 'timestamp', 'timestamp']);
        }).catch((err) => {
            console.log("ERROR: " + err);
        });
    });
}