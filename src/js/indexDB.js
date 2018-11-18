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

function addEvento(dia,sem, descrip){
    let req = db.transaction(["eventos"], "readwrite")
    .objectStore("eventos")
    .add({dia: dia, week: sem, data: descrip});

    req.onsuccess = function(event){
        console.log("ADD exitosamente!");
    }

    req.onerror = function(event){
        console.error("ERROR al add evento");
    }
}

