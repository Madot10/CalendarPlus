var config = {
    apiKey: "AIzaSyCj2zcmgCakzQmcvNnW43pro8gUTMgkVfY",
    authDomain: "ucalendar-plus.firebaseapp.com",
    databaseURL: "https://ucalendar-plus.firebaseio.com",
    projectId: "ucalendar-plus",
    storageBucket: "ucalendar-plus.appspot.com",
    messagingSenderId: "1084269721715"
  };
  
firebase.initializeApp(config);

let provider = new firebase.auth.GoogleAuthProvider();
let u = firebase.auth().currentUser;
let userData;

function LogInPopup(){
  firebase.auth().signInWithPopup(provider).then(function(result) {
    userData = { email: result.user.email,
                 name: result.user.displayName
                };
    changeScreen("main");
    document.getElementById("navbarTog").style.display = "-ms-flexbox";    
  }).catch(function(error) {
    // Handle Errors here.
    popError(`Ocurrio un error al iniciar con la cuenta ${error.email} <br> ${error.message} <br> Codigo: ${error.code}`);
  });
}

function isAuth(){
    return !(firebase.auth().currentUser == null)
}

function LogOut(){
    firebase.auth().signOut().then(function() {
        // Sign-out successful.
        userData = null;
        changeScreen("start");
      }).catch(function(error) {
        // An error happened.
        popError(`Ocurrio un error al intentar cerrar con la cuenta ${error.email} <br> ${error.message} <br> Codigo: ${error.code}`);
      });
}