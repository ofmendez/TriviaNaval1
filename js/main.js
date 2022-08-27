    
    const content = document.getElementById('Content');
    let Questions = {}    
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
    // loadViewFile("Wellcome")
    GoToLobby()

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
        loadViewFile("EligeAmenaza")
        loadDataFile("txt")
    }
    function GoQuestion(qId) {
        loadViewFile("PreguntaVertical").then((res)=>{
            SetQuestion(Questions[qId])
        });
    }
    function GoRanking() {
        loadViewFile("Ranking")
    }
    
    function Answer(id){
        loadViewFile("Resultados")
        console.log("id: ",id);
    }
    /////////////////////////
    function LoadQuestions(data){
        Questions = data[0].Questions;
        console.log(Questions[0]);
    }

    function SetQuestion(question) {
        //for
        some('div',['EstiloRespuesta'],question.Answers[0].text,document.getElementById('answersList'))
    }

function some(tagToAdd, listClasses, content, targetParent ) {
    // Create element
    const el = document.createElement(tagToAdd);
    
    // Add classes to element
    el.classList.add(...listClasses);
    
    
    // Set the innerHTML of the element
    el.innerHTML = content;
    // Or add text content to element
    // el.textContent = content;
    console.log(targetParent);
    // add element to DOM
    targetParent.appendChild(el);
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
