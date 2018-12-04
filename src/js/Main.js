let colors = ["table-success","table-warning"];
let iM = 0, contW = 1, mesAc, poner = true, contDay;
let gTime, gWeek;

function startOfWeek(date) {
    var diff = date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
}

function addDays(dat,days) {
    var date = new Date(dat);
    date.setDate(date.getDate() + days);
    return date;
}

function getTimefromDate(strDate){
    let date = strDate.toString().split('/');
    date = new Date(date[2],date[1]-1,date[0]);
    return date.getTime();
}

function getMes(num) {
    switch (num + 1) {
        case 1:
            return 'Ene';
        case 2:
            return 'Feb';
        case 3:
            return 'Mar';
        case 4:
            return 'Abr';
        case 5:
            return 'May';
        case 6:
            return 'Jun';
        case 7:
            return 'Jul';
        case 8:
            return 'Ago';
        case 9:
            return 'Sept';
        case 10:
            return 'Oct';
        case 11:
            return 'Nov';
        case 12:
            return 'Dic';
    }
}

function isFeriado(datechk){
    let feriados = dataSem.datos.feriados;

    for (const dferiado in feriados) {
        if (feriados.hasOwnProperty(dferiado)) {
            const element = feriados[dferiado];
            //console.log(element,getTimefromDate(element));
            //console.log(datechk, element);
            if(getTimefromDate(element) > datechk.getTime() ){
                //console.info("break?");
                break;
            }
            
            if(datechk.getTime() === getTimefromDate(element))
                return true;
            
        }
    }

    return false;
}

function isInPerio(time){
    return ((time.getTime() <= getTimefromDate(dataSem.datos.finals[0])) || (time.getTime() >= getTimefromDate(dataSem.datos.inicios[1])))
}

function formatTimestamp(time, type){
    let auxDay = new Date(time);
    switch (type) {
        case 'long':
            return (auxDay.getDate() + " " + getMes(auxDay.getMonth()));
            break;
    
        default:
            return (auxDay.getDate() + "/" + (auxDay.getMonth()+1) + "/" + auxDay.getFullYear());
            break;
    }
}

function popDayResumen(time,week){
    //console.info("click ", time, new Date(time), " WEEK", week);
    //addEvento(time,week, "Descripcion de prueba")
    getHTLMevents(time, week,document.getElementById("eventFormat"));
    document.getElementById("dayFormat").innerHTML = formatTimestamp(time,"long");

    gTime = time;
    gWeek = week;

    $('#dayPop').modal('show');
    
}

function popNewEvento(){
    $('#dayPop').modal('hide');
    document.getElementById("inputTitulo").value = '';
    document.getElementById("timeRange").value = 12;
    document.getElementById("inputDescripcion").value = '';
    $('#newEvent').modal('show');
}

function genNewEvent(){
    let title = document.getElementById("inputTitulo").value;
    let hora = document.getElementById("timeRange").value;
    let des = document.getElementById("inputDescripcion").value;
    addEvento(gTime, gWeek, title, hora, des);
}

function getHr(value){
    let f;
    if(value > 12){
        f = `${value - 12}:00 PM`;
    }else{
        f = `${value}:00 AM`;
    }
    return f;
}

function rangeTime(ele){
    let spT = document.getElementById("timeToshow");
    spT.innerHTML = "";
    spT.innerHTML = getHr(ele.value)
    
}

function genWeek(eTable, dateInit){
    let dayAux = dateInit;
    let topDay = addDays(dateInit, 6);
    
    let rowWeek = document.createElement('tr');
    let colDay, auxW = 0;

    if(dataSem.datos.finals.length >1){
        //Periodo no es corrido
        auxW = contW;
        if(isInPerio(dayAux)) {
            //Si esta dentro de periodo
            //Establecemos Nro de semana
            colDay = document.createElement('td');
            colDay.innerHTML = `<b>${contW}</b>`;
            colDay.setAttribute("class", "table-active text-center");
            colDay.setAttribute("scope", "row");
            rowWeek.appendChild(colDay);
            contW++;
        }else{
            //No es parte del periodo
            colDay = document.createElement('td');
            //colDay.innerHTML = '';
            auxW = -1;
            colDay.setAttribute("class", "table-active");
            rowWeek.appendChild(colDay);
        }        
    }else{
        //Periodo corrido
        colDay = document.createElement('td');
        colDay.innerHTML = `<b>${contW}</b>`;
        colDay.setAttribute("class", "table-active");
        rowWeek.appendChild(colDay);
        contW++;
    }

    
    

    //Recorremos toda la semana
    while((dayAux.getDay() <= 6) && (dayAux.getTime() <= topDay.getTime())){
        //console.log(dayAux);
        if(dayAux.getMonth() != mesAc){
            //Cambio de mes ===> Cambio color
            mesAc = dayAux.getMonth();
            poner = true;
            if(iM){
                iM = 0;
            }else{
                iM = 1;
            }
        }


        /************ Generamos dia *******************/       
        getCountEvent(dayAux.getTime(), contDay);
        colDay = document.createElement('td');

        colDay.setAttribute("class", colors[iM] + " day");
        colDay.setAttribute("onclick", `popDayResumen(${dayAux.getTime()},${auxW})`);
        colDay.setAttribute("ontouchenter", `popDayResumen(${dayAux.getTime()},${auxW})`);
        colDay.innerHTML = `${dayAux.getDate()}`;
        //colDay.innerHTML = `<b>${dayAux.getDate()}</b>`;

        if(!isInPerio(dayAux)){
            //fuera de periodo
            colDay.setAttribute("class", "table-secondary" + " day");
        }else if(isFeriado(dayAux)){
            //feriado
            colDay.setAttribute("class", "table-danger" + " day");
            colDay.innerHTML = `<i>${colDay.innerHTML}</i>`;
        }else if(dayAux.getDay() == 0){
            //Domingo
            colDay.innerHTML = `<b id="dom">${colDay.innerHTML}</b>`;
            //colDay.setAttribute("class", "table-danger");
        }else if(dayAux.getDay() == 6){
            //sabado
            colDay.innerHTML = `<b>${colDay.innerHTML}</b>`;
            //colDay.setAttribute("class", "table-info");
        }else {
            //Dia normal
            colDay.innerHTML = `${colDay.innerHTML}`;
        }
        

        rowWeek.appendChild(colDay);
        dayAux = addDays(dayAux,1);
        contDay++;
    }


    if(poner){
        colDay = document.createElement('td');
        colDay.setAttribute("class", colors[iM] + " texto-vertical-3 text-center");
        colDay.innerHTML = `<span id="texto-vertical-3">${getMes(addDays(dayAux,-1).getMonth())}</span>`;
        rowWeek.appendChild(colDay);
        poner = false;
    }
    

    return rowWeek;
}

function genCalendario(){
    let auxi = dataSem.datos.inicios[0].split('/');
    //En caso de break largo
    let auxf = dataSem.datos.finals[dataSem.datos.finals.length-1].split('/');

    /***** PRIMER BLOQUE DE PERIODO*****/
    let initWeek = new Date(auxi[2],auxi[1]-1,auxi[0]);
    let topWeek =  new Date(auxf[2],auxf[1]-1,auxf[0]);

    let tableMain = document.getElementById('calendario').getElementsByTagName('tbody')[0];
    tableMain.innerHTML = '';

    contW = 1;
    contDay = 0;
    
    mesAc = initWeek.getMonth();
    while(initWeek.getTime() <= topWeek.getTime()){
        tableMain.appendChild(genWeek(tableMain,startOfWeek(initWeek)));
        initWeek = addDays(initWeek,7);
    }
    
}



//window.onload = () => genCalendario();


function changeScreen(scrName){
    let eMain = document.getElementById("main");
    let eStart = document.getElementById("start");
    let eConfig = document.getElementById("conf");

    eMain.style.display = "none";
    eStart.style.display = "none";
    eConfig.style.display = "none";

    //cerrar navbar
    document.getElementById("navbarTog").classList.remove("show");
    document.getElementById("navbarTog").classList.add("collapse");

    switch (scrName) {
        case "main":
            if(isAuth()){
                document.body.classList.remove("bg-primary");
                genCalendario();
                eMain.style.display = "block";
            }else{
                changeScreen("start");
                popError("Debes iniciar sesion para poder continuar");
            }

            break;

        case "conf":
            if(isAuth()){
                document.body.classList.remove("bg-primary");
                document.getElementById("emailAcount").innerHTML = userData.email;
                eConfig.style.display = "block";
            }else{
                changeScreen("start");
                popError("Debes iniciar sesion para poder continuar");
            }

            break;

        case "start":
                document.body.classList.add("bg-primary");
                eStart.style.display = "block";
            break;
    
        default:
            break;
    }
}

function popError(msg){
    document.getElementById("errText").innerHTML = msg;
    $('#errModal').modal('show');
}

if (navigator.serviceWorker.controller) {
    console.log('[PWA Builder] active service worker found, no need to register')
  } else {
    //Register the ServiceWorker
    navigator.serviceWorker.register('cplus-sw.js', {
      scope: './'
    }).then(function(reg) {
      console.log('Service worker has been registered for scope:'+ reg.scope);
    });
  }