window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

if (!window.indexedDB) {
    window.alert("Your browser doesn't support a stable version of IndexedDB.");
}

let req = indexedDB.open("dbCalendar", 1);
let db, objectStore;

req.onerror = function(event){
    //Error
    //ToDo: Manejar
    console.warn("ERROR! ", event);
}

req.onupgradeneeded = function (event){
    //FIRST TIME OK

    db = event.target.result;

    objectStore = db.createObjectStore("eventos", {autoIncrement : true});
    objectStore.createIndex("week", "week", {unique: false});
    objectStore.createIndex("dia", "dia", {unique: false});

    objectStore.transaction.oncomplete = function (event){
        console.log('create');
    }

}

req.onsuccess = function(event){
    //OK OPEN DB
    db = event.target.result;
    console.log('abierto');
}

function addEvento(dia,sem,titulo,hora,descrip){
    let at = new Date(dia);
    at.setHours(hora);

    let req = db.transaction(["eventos"], "readwrite")
    .objectStore("eventos")
    .add({dia: at.getTime(), week: sem, titulo, hora, data: descrip});

    req.onsuccess = function(event){
        console.log("ADD exitosamente!", sem);
        $('#newEvent').modal('hide');
    }

    req.onerror = function(event){
        console.error("ERROR al add evento");
    }
}

function delEvento(pkey, element){
    let todel = db.transaction("eventos", "readwrite")
                .objectStore("eventos")
                .delete(pkey)
    .onsuccess = function(event){
        element.parentNode.parentNode.removeChild(element.parentNode);
        console.log("Evento eliminado");
    }
}

function getCountEvent(time){
    let limit = IDBKeyRange.bound(time,time+86400000,false,true);

    let trns = db.transaction(["eventos"], "readonly")
                .objectStore("eventos")
                .index("dia")
                .count(limit);
     trns.onsuccess = function(event){
        console.log(trns.result);
        if(trns.result)
            return trns.result;
        else
            return "";
    }

}

function getHTLMevents(time,week, element){
    let limit, ind;

    
    if(time){
        limit = IDBKeyRange.bound(time,time+86400000,false,true);

        console.log("Consulta dia ", time, new Date(time));
        ind = db.transaction("eventos")
            .objectStore("eventos")
            .index("dia");
    }else if(week){
        limit = IDBKeyRange.only(week);
        console.log("Consulta week ", week);
        ind = db.transaction("eventos")
            .objectStore("eventos")
            .index("week");
    } 
    
    if(time || week){
        let ulElem = document.createElement("ul");
        ulElem.setAttribute("class", "list-group list-group-flush");
        let liElem;

        ind.openCursor(limit)
        .onsuccess = function(event){
            
            let cursor = event.target.result;
            if(cursor){
                console.log(cursor);
                
                liElem = document.createElement("li");
                liElem.setAttribute("class", "list-group-item justify-content-between align-items-center");
                liElem.innerHTML = `<span class="badge badge-danger badge-pill clicker" onclick="delEvento(${cursor.primaryKey}, this)" ontouchenter="delEvento(${cursor.primaryKey}, this)" >&times;</span><b>${cursor.value.titulo} (${getHr(cursor.value.hora)}):</b> <i>${cursor.value.data}</i>`;

                ulElem.appendChild(liElem);

                cursor.continue();
            }else{
                //Nada mas
                console.log("Nada mas",ulElem);
                element.innerHTML = "";
                element.appendChild(ulElem);
            }
            
        }
    }
}

function deleteAllData(){
    let trns = db.transaction(["eventos"], "readwrite")
                .objectStore("eventos")
                .clear();
    trns.onsuccess = function(ev){
        console.log("Eliminada data correctamente");
    }
}