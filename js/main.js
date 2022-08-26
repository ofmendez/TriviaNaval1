    
    const content = document.getElementById('Content');
    

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
        fetch("../HTML/"+viewFile+".html")
        .then((response) => response.text())
        .then((textView) =>  page.change(new view(textView)) );
    }

    //NAVEGACION
    loadViewFile("Wellcome")

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
    }
    function GoQuestion() {
        loadViewFile("PreguntaVertical")
    }
