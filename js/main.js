import {InsertElement, RandomInt, ConmuteClassAndInner, AnimateWithTransparent, emailToId} from './utils.js'
import {createUserData ,getUserData, updateScore} from "./database.js";
import {loadDataFile} from './files.js'
import * as views from "./views.js";


let Questions = {}    
let countdownTimer = {}
let totalTime = 0 
let aviable5050 = true
let answered = {}
let totalErrors = 0
let streak = 0
let totalPoints = 0
let pointsBySuccess = 100
let multiplier = 1;
let timeByAns = 60
let timeleft = timeByAns-1
let userID = ''
window.views = views

views.GoTo("Wellcome")

window.TryLogin = (form)=>{
    getUserData().then((res)=>{
        let exist = false
        for (const u in res) 
            if (res.hasOwnProperty(u)) 
                exist |= u===emailToId(form.elements['idCorreo'].value)
        if(exist)
            GoRanking()
        else
            Login(form)
        return false;

    }).catch((res)=> {
        console.log("Error login: "+res)
        alert("Ranking, Ha ocurrido un error, intente nuevamente.")
        return false;
    });
    return false;
}

window.GoToLobby = ()=>{
    SetLobby();
    loadDataFile("txt").then((res)=>{
        Questions = res[0].Questions;
    });
}

const Login = (form)=>{
    createUserData(
        emailToId(form.elements['idCorreo'].value),
        form.elements['idCorreo'].value,
        form.elements['idNombreCompleto'].value,
        form.elements['idEmpresa'].value,
        form.elements['idAssesment'].value
    ).then((res)=>{
        userID = emailToId(form.elements['idCorreo'].value);
        views.GoTo("Instrucciones01")
    }).catch(()=> {
        alert("Ha ocurrido un error, intente nuevamente.")
    })
}

const SetLobby = ()=>{
    views.GoTo("EligeAmenaza").then((res)=>{
        let questionBtns = document.getElementsByClassName('questionBtn')
        let ix =0
        for (let b of questionBtns) {
            b.id = ix++; 
            if (b.id in answered){
                b.src ='../Images/IconoPregunta0'+(parseInt(b.id)+1)+(answered[b.id]?'_Bien':'_Mal')+'.svg'
            }else{
                b.classList.add('interactable');
                b.addEventListener('click', ()=> GoQuestion(b.id) );
            }
        }
    });
}

window.GoRanking = ()=>{
    views.GoTo("Ranking").then((res)=>{
        getUserData().then((res)=>{
            FillRanking(res);
            document.getElementById('loadingMessage').hidden =true;
        }).catch((res)=> {
            console.log("Error ranking: "+res)
            alert("Ranking, Ha ocurrido un error, intente nuevamente.")
        })
    });
}

// GoRanking()

//////////////////////////////////////////////
const FillRanking = (usersObj)=>{
    let users = []
    for (const u in usersObj) 
        if (usersObj.hasOwnProperty(u)) 
            users.push(usersObj[u]);
    users.sort((a, b) => { return b.score - a.score; });
    
    let container = document.getElementById('tablasRR');
    for (let i = 0; i < users.length; i++) {
        let tables = InsertElement('table',['ContenidosRanking'],'',container);
        let tr = InsertElement('tr',[],'',tables);
        InsertElement('th',['PosicionJugadorRanking'],'#'+(i+1),tr);
        InsertElement('th',['NombreJugadorRanking'],users[i].username,tr);
        InsertElement('th',['PuntajeJugadorRanking'],users[i].score,tr);
    }
    
}

const GoToResults = ()=>{
    document.body.classList.add('avoidEvents');

    updateScore( userID, totalPoints).then((res)=>{
        views.GoTo("Resultados").then((res)=>{
            document.getElementById('correctAnswers').innerHTML =(Object.keys(answered).length-totalErrors)+'/'+Questions.length
            document.getElementById('totalTime').innerHTML =new Date(totalTime*1000).toISOString().substring(14, 19);
            document.getElementById('score').innerHTML = totalPoints;
            document.body.classList.remove('avoidEvents');
        });
    }).catch(() =>{
        alert("Ocurrió un error, intenta nuevamente.");
        document.body.classList.remove('avoidEvents');
        GoToResults();
    });
}


const GoQuestion = (qId)=>{
    views.GoTo("PreguntaVertical").then((res)=>{
        SetQuestionAndAnswers(Questions[qId]);
        SetPowerUp5050(Questions[qId])
        RunTimer(Questions[qId])
        SetPowerUpMultiplier()
    });
}


//////////////////////////////////////////////////////////////////////

const SetPowerUp5050 = (q)=>{
    if(aviable5050)
        document.getElementById('powerUp5050').hidden =  false;
    document.getElementById('powerUp5050').addEventListener('click', () =>{
        document.getElementById('powerUp5050').hidden = true;
        Use5050(q)
    });
}

const Use5050 = (q)=>{
    aviable5050 = false;
    let idWrong1 = -1
    let idWrong2 = -1
    while(idWrong1 < 0  ){
        let n1 = RandomInt(4) 
        if(q.Answers[n1].isCorrect)
            continue
        idWrong1 = n1
    }
    while(idWrong2 < 0  ){
        let n2 = RandomInt(4) 
        if(q.Answers[n2].isCorrect || n2 === idWrong1)
            continue
        idWrong2 = n2
    }
    AnimateWithTransparent( document.getElementById('answer'+idWrong1), document.getElementById('answer'+idWrong2),200);
}


const AccumTime = (time)=>{
    totalTime += time;
}
const AccumPoints = (pointsT, pointsS)=>{
    multiplier = streak >2 ? (streak>4? 3:2):1;
    totalPoints += (pointsT+pointsS*multiplier)
}

const SetPowerUpMultiplier = ()=>{
    multiplier = streak >1 ? (streak>3? ShowTurbo(false, true):ShowTurbo( true, false)):ShowTurbo(false, false);
}

const ShowTurbo = (showX2, showX3)=>{
    document.getElementById('turboIcon2').hidden = !showX2;
    document.getElementById('turboIcon3').hidden = !showX3
}

const AnimateAnswer = (element, classTarget, innerTarget, ansText, interval)=>{
    document.body.classList.add('avoidEvents');
    ConmuteClassAndInner(element,classTarget,'EstiloRespuesta',innerTarget)
    setTimeout(() => {ConmuteClassAndInner(element,'EstiloRespuesta',classTarget,ansText)}, interval);
    setTimeout(() => {ConmuteClassAndInner(element,classTarget,'EstiloRespuesta',innerTarget)}, interval*2);
    setTimeout(() => {ConmuteClassAndInner(element,'EstiloRespuesta',classTarget,ansText)}, interval*3);
    setTimeout(() => {ConmuteClassAndInner(element,classTarget,'EstiloRespuesta',innerTarget)}, interval*4);
    setTimeout(() => {ReturnLobbyOrResults(); document.body.classList.remove('avoidEvents');}, interval*5);
}

const ReturnLobbyOrResults = ()=>{
    clearInterval(countdownTimer);
    if (Object.keys(answered).length === Questions.length || totalErrors === 3)
        GoToResults();
    else
        SetLobby();
}
const UpdateStatus = (q, time, isCorrect)=>{
    answered[q.id] = isCorrect;
    totalErrors += isCorrect? 0 : 1;
    streak = isCorrect? streak + 1 : 0;
    AccumTime(time)
    if (isCorrect)
        AccumPoints(timeleft+1,pointsBySuccess)
}

const RunTimer = (question)=>{
    timeleft = timeByAns -1;
    countdownTimer = setInterval(() => {
        document.getElementsByClassName("FondoTiempo")[0].textContent =timeleft
        timeleft--;
        if (timeleft < 0) {
            UpdateStatus(question, timeByAns, false)
            AnimateAnswer(document.getElementById('Pregunta'),'RespuestaIncorrecta','¡Incorrecto!', question.statement, 300);
        }
    }, 1000);//Second by second
}

const Answer = (ans, question)=>{
    UpdateStatus(question, timeByAns-timeleft-1, ans.isCorrect)
    let classTarget = ans.isCorrect ?'RespuestaCorrecta':'RespuestaIncorrecta';
    let innerTarget = ans.isCorrect ?'¡Correcto!':'¡Incorrecto!';
    AnimateAnswer(document.getElementById('answer'+ans.id), classTarget, innerTarget, ans.text, 300);

}


const SetQuestionAndAnswers = (question)=>{
    document.getElementById('Pregunta').innerHTML = question.statement;
    for(let ans of question.Answers){
        InsertElement('div',['space'+(ans.id === '0'?'2vh':'1vh')],'',document.getElementById('answersList'));
        InsertElement('div',['EstiloRespuesta'],ans.text,document.getElementById('answersList'),'answer'+ans.id).addEventListener("click", () => Answer(ans, question));
    }
}

