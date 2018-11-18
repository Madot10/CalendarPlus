let colors = ["table-success","table-warning"];
let iM = 0, contW = 1, mesAc, poner = true;

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

            //if(datechk.getTime() > getTimefromDate(element))
                //break;
            
            if(datechk.getTime() === getTimefromDate(element))
                return true;
            
        }
    }

    for (let dferiado in feriados) {
        
       if(datechk.getTime() > getTimefromDate(dferiado)){
            continue;
       }

        if(datechk.getTime() === getTimefromDate(dferiado)){
            return true;
        }
    }
    return false;
}

function isInPerio(time){
    return ((time.getTime() <= getTimefromDate(dataSem.datos.finals[0])) || (time.getTime() >= getTimefromDate(dataSem.datos.inicios[1])))
}

function genWeek(eTable, dateInit){
    let dayAux = dateInit;
    let topDay = addDays(dateInit, 6);
    
    let rowWeek = document.createElement('tr');
    let colDay;

    if(dataSem.datos.finals.length >1){
        //Periodo no es corrido
        if(isInPerio(dayAux)) {
            //Si esta dentro de periodo
            //Establecemos Nro de semana
            colDay = document.createElement('td');
            colDay.innerHTML = `<b>${contW}</b>`;
            colDay.setAttribute("class", "table-active");
            rowWeek.appendChild(colDay);
            contW++;
        }else{
            //No es parte del periodo
            colDay = document.createElement('td');
            //colDay.innerHTML = '';
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

        //Generamos dia
        colDay = document.createElement('td');
        colDay.setAttribute("class", colors[iM]);
        colDay.innerHTML = `${dayAux.getDate()}`;
        //colDay.innerHTML = `<b>${dayAux.getDate()}</b>`;

        if(!isInPerio(dayAux)){
            //fuera de periodo
            colDay.setAttribute("class", "table-secondary");
        }else if(isFeriado(dayAux)){
            //feriado
            colDay.setAttribute("class", "table-danger");
            colDay.innerHTML = `<i>${dayAux.getDate()}</i>`;
        }else if(dayAux.getDay() == 0){
            //Domingo
            colDay.innerHTML = `<b id="dom">${dayAux.getDate()}</b>`;
            //colDay.setAttribute("class", "table-danger");
        }else if(dayAux.getDay() == 6){
            //sabado
            colDay.innerHTML = `<b>${dayAux.getDate()}</b>`;
            //colDay.setAttribute("class", "table-info");
        }else {
            //Dia normal
            colDay.innerHTML = `${dayAux.getDate()}`;
        }
        

        rowWeek.appendChild(colDay);
        dayAux = addDays(dayAux,1);
    }


    if(poner){
        colDay = document.createElement('td');
        colDay.setAttribute("class", colors[iM] + " texto-vertical-3");
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
    mesAc = initWeek.getMonth();
    while(initWeek.getTime() <= topWeek.getTime()){
        tableMain.appendChild(genWeek(tableMain,startOfWeek(initWeek)));
        initWeek = addDays(initWeek,7);
    }
    
}



window.onload = () => genCalendario();