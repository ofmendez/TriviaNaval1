    
    const content = document.getElementById('Content');
    let Questions = {}    

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
        fetch("./HTML/"+viewFile+".html")
        .then((response) => response.text())
        .then((textView) =>  page.change(new view(textView)) );
    }

    function loadDataFile() {
        fetch("./Data/data.txt")
        .then((response) => response.text())
        .then((textView) =>  {
            console.log(atob(textView));
            LoadQuestions( JSON.parse(atob(textView)))
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
        loadDataFile()
    }
    function GoQuestion() {
        loadViewFile("PreguntaVertical")
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
        console.log(Questions);
    }