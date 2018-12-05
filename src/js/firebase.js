let config = {
  apiKey: "AIzaSyCPkciAXvB2Mh4tOAjeaLParBd5OeObZCY",
  authDomain: "calendario-plus2018.firebaseapp.com",
  databaseURL: "https://calendario-plus2018.firebaseio.com",
  projectId: "calendario-plus2018",
  storageBucket: "calendario-plus2018.appspot.com",
  messagingSenderId: "106881987833"
};

firebase.initializeApp(config);

let provider = new firebase.auth.GoogleAuthProvider();
//let dbf = firebase.firestore();
//dbf.settings({ timestampsInSnapshots: true });

let u = firebase.auth().currentUser;
let userData, arrEventos = [];

function LogInPopup() {
  firebase.auth().signInWithPopup(provider).then(function (result) {
    userData = {
      email: result.user.email,
      name: result.user.displayName
    };
    //changeScreen("main");
    document.getElementById("navbarTog").style.display = "-ms-flexbox";

    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
      .then(function () {
        // Existing and future Auth states are now persisted in the current
        // session only. Closing the window would clear any existing state even
        // if a user forgets to sign out.
        // ...
        // New sign-in will be persisted with session persistence.
        //console.log("ok");
      })
      .catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
      });

  }).catch(function (error) {
    // Handle Errors here.
    popError(`Ocurrio un error al iniciar con la cuenta ${error.email} <br> ${error.message} <br> Codigo: ${error.code}`);
  });
}

function isAuth() {
  return !(firebase.auth().currentUser == null)
}

function LogOut() {
  firebase.auth().signOut().then(function () {
    // Sign-out successful.
    userData = null;
    changeScreen("start");
  }).catch(function (error) {
    // An error happened.
    popError(`Ocurrio un error al intentar cerrar con la cuenta ${error.email} <br> ${error.message} <br> Codigo: ${error.code}`);
  });
}

window.onload = () => {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      // User is signed in.
      //console.log("ok1", user);
      userData = {
        email: user.email,
        name: user.displayName
      };
      changeScreen("main");
    } else {
      // No user is signed in.
      //console.log("no1");
      changeScreen("start");
    }
  });
}

/*
function existUser(email){
    dbf.collection("users").doc(email)
        .get().then(function(doc){
            if(doc.exists){
                //Hay registro
                console.log("doc", doc.data());
            }else{
                //No hay registro
            }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });
}*/
/*
function syncToCloud(){
    arrEventos = [];
    db.transaction("eventos").objectStore("eventos").openCursor()
        .onsuccess = function(eve){
            var cursor = event.target.result;
            if (cursor) {
              console.log(cursor.value);
              arrEventos.push(cursor.value);

              //agregar cada uno al servidor
              dbf.collection("users").doc(userData.email).collection(dataSem.Periodo)
                    .add(cursor.value)
                    .then(function(docRef) {
                        console.log("Document written with ID: ", docRef.id);
                    })
                    .catch(function(error) {
                        console.error("Error adding document: ", error);
                    });

              cursor.continue();
            }
            else {
              console.log("No more entries!");
              
            }
          };
}

function syncLocal(){
    return dbf.collection("users").doc(userData.email)
        .collection(dataSem.Periodo).get()
        .then(function(querySnapshot) {
            deleteAllData().onsuccess = function (ev) {
                ///Totalmente bd borrada
                querySnapshot.forEach(function(doc) {
                    //Add eventos traidos
                    addEvento(doc.data().dia, doc.data().week, doc.data().titulo, doc.data().hora, doc.data().data);
                    console.log(doc.id, " => ", doc.data());
                });

            }    
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        });
}*/