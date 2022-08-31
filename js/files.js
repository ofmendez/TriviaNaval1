
    import {b64EncodeUnicode,b64DecodeUnicode } from "./codification.js";

    export function loadCredentials (){
        return new Promise((resolve,reject)=>{
            // fetch("./credentials/firebaseConfig.json")
            fetch("./Data/dataf.txt")
            .then((response) => response.text())
            .then((textView) =>  {
                    // console.log(b64EncodeUnicode(textView));
                    resolve( JSON.parse(b64DecodeUnicode(textView))[0].firebaseConfig );
            } );
        });
    }
    export function loadViewFile(viewFile) {
        return new Promise((resolve,reject)=>{
            fetch("./HTML/"+viewFile+".html")
            .then((response) => response.text())
            .then((textView) => resolve(textView) );
        });
    }
    // loadDataFile('json')s
    export function loadDataFile(ext) {
        return new Promise((resolve,reject)=>{
            fetch("./Data/data."+ext)
            .then((response) => response.text())
            .then((textView) =>  {
                if(ext === "json"){
                    console.log(b64EncodeUnicode(textView));
                    resolve("done")
                } else
                    resolve( JSON.parse(b64DecodeUnicode(textView)));
            } );
        });
    }
