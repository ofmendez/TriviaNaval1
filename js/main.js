    
    const content = document.getElementById('Content');
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
    // loadDataFile("json")

    // CONTROL ESTADO DE LAS VISTAS
    const view = function(textView) {
        content.innerHTML = textView;
    }
    const PageState = function() {
        let currentState = new view("");
        this.change = state => currentState = state;
    }
    const page = new PageState();

    function loadViewFile(viewFile) {
        return new Promise((resolve,reject)=>{
            fetch("./HTML/"+viewFile+".html")
            .then((response) => response.text())
            .then((textView) =>  resolve(page.change(new view(textView)) ));
        });
    }

    function loadDataFile(ext) {
        fetch("./Data/data."+ext)
        .then((response) => response.text())
        .then((textView) =>  {
            if(ext === "json")
                console.log(b64EncodeUnicode(textView));
            else
                LoadQuestions( JSON.parse(b64DecodeUnicode(textView)))
        } );
    }

    //NAVEGACION
    loadViewFile("Wellcome")
    // GoToLobby()
    // GoToLobby()
    // GoRanking()

    function GoToRegister() {
        loadViewFile("Registro")
    }

    function TryLogin() {
        loadViewFile("Instrucciones01")
    }

    function GoToLastInstructions() {
        loadViewFile("Instrucciones02")
    } 

    function GoToLobby() {
        SetLobby()
        loadDataFile("txt")
    }

    function GoRanking() {
        loadViewFile("Ranking").then((res)=>{
            let container = document.getElementById('tablas._.');
            let tables0 = InsertElement('table',['ContenidosRanking'],'',container);
            let tr0 = InsertElement('tr',[],'',tables0);
            InsertElement('th',['PosicionJugadorRanking'],'#1',tr0)
            InsertElement('th',['NombreJugadorRanking'],'FABIAN MENDEZ',tr0)
            InsertElement('th',['PuntajeJugadorRanking'],'2342',tr0)
            for (let i = 2; i < 5; i++) {
                let tables = InsertElement('table',['ContenidosRanking'],'',container);
                let tr = InsertElement('tr',[],'',tables);
                InsertElement('th',['PosicionJugadorRanking'],'#'+i,tr);
                InsertElement('th',['NombreJugadorRanking'],'FABIAN '+i+' MENDEZ',tr);
                InsertElement('th',['PuntajeJugadorRanking'],23-i,tr);
                
            }
        });
    }

    function GoToResults() {
        loadViewFile("Resultados").then((res)=>{
            document.getElementById('correctAnswers').innerHTML =(Object.keys(answered).length-totalErrors)+'/'+Questions.length
            document.getElementById('totalTime').innerHTML =new Date(totalTime*1000).toISOString().substring(14, 19);
            document.getElementById('score').innerHTML = totalPoints;
        })
    }
    
    function SetLobby() {
        loadViewFile("EligeAmenaza").then((res)=>{
            let questionBtns = document.getElementsByClassName('questionBtn')
            ix =0
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
    function GoQuestion(qId) {
        loadViewFile("PreguntaVertical").then((res)=>{
            SetQuestionAndAnswers(Questions[qId]);
            SetPowerUp5050(Questions[qId])
            RunTimer(Questions[qId])
            SetPowerUpMultiplier()
        });
    }

    function SetPowerUp5050(q) {
        if(aviable5050)
            document.getElementById('powerUp5050').hidden =  false;
            document.getElementById('powerUp5050').addEventListener('click', () =>{
            document.body.classList.add('avoidEvents');
            document.getElementById('powerUp5050').hidden = true;
            Use5050(q)
        });
    }
    
    function Use5050(q) {
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
        Animate5050( document.getElementById('answer'+idWrong1), document.getElementById('answer'+idWrong2));
    }
    
    function Animate5050(el1, el2) {
        el1.setAttribute('transparent',true);el2.setAttribute('transparent',true);
        setTimeout(() => { el1.removeAttribute('transparent'); el2.removeAttribute('transparent');}, 200);
        setTimeout(() => { el1.setAttribute('transparent',true); el2.setAttribute('transparent',true);}, 400);
        setTimeout(() => { el1.removeAttribute('transparent'); el2.removeAttribute('transparent');}, 600);
        setTimeout(() => { el1.setAttribute('transparent',true); el2.setAttribute('transparent',true); document.body.classList.remove('avoidEvents');}, 800);
    }

    function RandomInt(max) {
        return Math.floor(Math.random() * max);
    }


    function RunTimer(q) {
        timeleft = timeByAns -1;
        countdownTimer = setInterval(() => {
            document.getElementsByClassName("FondoTiempo")[0].textContent =timeleft
            timeleft--;
            if (timeleft < 0) {
                clearInterval(countdownTimer);
                AnimateAnswer(document.getElementById('Pregunta'),'RespuestaIncorrecta','¡Incorrecto!', q.statement)
                AccumTime(timeByAns)
                // resolve(true);
            }
        }, 1000);
    }


    
    function AccumTime(time) {
        totalTime += time;
    }
    function AccumPoints(pointsT, pointsS) {
        multiplier = streak >2 ? (streak>4? 3:2):1;
        totalPoints += (pointsT+pointsS*multiplier)
        console.log(totalPoints);
    }
    
    function SetPowerUpMultiplier(){
        multiplier = streak >1 ? (streak>3? ShowTurbo(false, true):ShowTurbo( true, false)):ShowTurbo(false, false);
    }

    function ShowTurbo(showX2, showX3) {
        document.getElementById('turboIcon2').hidden = !showX2;
        document.getElementById('turboIcon3').hidden = !showX3
    }

    function AnimateAnswer(element, classTarget, innerTarget, ansText) {
        ConmuteClassAndInner(element,classTarget,'EstiloRespuesta',innerTarget)
        setTimeout(() => {ConmuteClassAndInner(element,'EstiloRespuesta',classTarget,ansText)}, 300);
        setTimeout(() => {ConmuteClassAndInner(element,classTarget,'EstiloRespuesta',innerTarget)}, 600);
        setTimeout(() => {ConmuteClassAndInner(element,'EstiloRespuesta',classTarget,ansText)}, 900);
        setTimeout(() => {ConmuteClassAndInner(element,classTarget,'EstiloRespuesta',innerTarget)}, 1200);
        setTimeout(() => {
            document.body.classList.remove('avoidEvents');
            clearInterval(countdownTimer);
            if (Object.keys(answered).length === Questions.length || totalErrors === 3)
                GoToResults();
            else
                SetLobby()
        }, 2000);
    }

    function Answer(ans, question){
        answered[question.id] = ans.isCorrect
        document.body.classList.add('avoidEvents');
        const element = document.getElementById('answer'+ans.id)
        let classTarget = ans.isCorrect ?'RespuestaCorrecta':'RespuestaIncorrecta';
        let innerTarget = ans.isCorrect ?'¡Correcto!':'¡Incorrecto!';
        totalErrors += ans.isCorrect? 0 : 1;
        AnimateAnswer(element, classTarget, innerTarget, ans.text);
        AccumTime(timeByAns-timeleft-1)
        streak = ans.isCorrect? streak + 1 : 0;
        if (ans.isCorrect)
            AccumPoints(timeleft+1,pointsBySuccess)
    }

    function ConmuteClassAndInner(element, c1, c2, in1){
        element.classList.add(c1)
        element.classList.remove(c2)
        element.innerHTML = in1
    }
    /////////////////////////
    function LoadQuestions(data){
        Questions = data[0].Questions;
        console.log(Questions);
    }

    function SetQuestionAndAnswers(question) {
        document.getElementById('Pregunta').innerHTML = question.statement;
        for(let ans of question.Answers){
            InsertElement('div',['space'+(ans.id === '0'?'2vh':'1vh')],'',document.getElementById('answersList'));
            InsertElement('div',['EstiloRespuesta'],ans.text,document.getElementById('answersList'),'answer'+ans.id).addEventListener("click", () => Answer(ans, question));
        }
    }

function InsertElement(tagToAdd, listClasses, content, targetParent, nameId ) {
    // Create element
    const el = document.createElement(tagToAdd);
    
    // Add classes to element
    el.classList.add(...listClasses);
    
    if( nameId !==undefined)
        el.id = nameId
    // Set the innerHTML of the element
    el.innerHTML = content;
    // Or add text content to element
    // el.textContent = content;
    // add element to DOM
    targetParent.appendChild(el);
    return el;
}




    function b64EncodeUnicode(str) {
        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
            function toSolidBytes(match, p1) {
                return String.fromCharCode('0x' + p1);
        }));
    }

    function b64DecodeUnicode(str) {
        return decodeURIComponent(atob(str).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    }
