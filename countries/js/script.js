const select = document.querySelector("#allcountries")
const img = document.querySelector("#countries-img")
const submit = document.querySelector("#btn-submit")
const hora = document.querySelector("#hours")
const url = "https://restcountries.com/v3.1/all?fields="
let page =true

if(submit){
    create()
}else{
    hours()
}
 
function hours(){
    const title = document.querySelector("h1")
    //Pegar parametros
    const urlSearchParams = new URLSearchParams(window.location.search)
    const name =  urlSearchParams.get("name")
    const timezone = urlSearchParams.get("time")
    const operador = urlSearchParams.get("op")
    const time = parseInt(timezone.match(/\d+/g));

    const atualizador = setInterval(()=>{
        const data = new Date()
        let horas = data.getUTCHours()
        let minuto = data.getUTCMinutes()
        let segundos = data.getUTCSeconds()
      
        if(operador == "mais"){
            horas +=time
            if(horas > 24){
                horas -=24
            }
        }else if(operador == "menos"){
            horas -=time
            if(horas < 0){
                horas  = 24 +(horas)
            }
        }
        let horario
        if(minuto < 10){
            minuto = "0" + minuto
        }
        if(horas < 10){
            horas = "0" + horas
        }
        if(segundos < 10){
            segundos = "0"+segundos
        }
        
        horario = `${horas}:${minuto}:${segundos}`
        hora.textContent = horario
    },1000)
    document.body.style.backgroundImage=`url(${urlSearchParams.get("img")})`
    title.textContent = `Horario de(o) ${name} é`
   
}
 function create(){
    let imgs = [];
    let time = [];
    let name = [];
    let currenttime;
    let currentImgs;
    let currentName;
    const countries = getCountries().then((data,i)=>{
            data.map((countries,index)=>{
            const timezone = countries.timezones[0]
            var flags = countries.flags.svg
            const pais = countries.translations.por.common
            createSelect(pais,timezone)
            imgs[index] = flags
            time[index] = timezone
            name[index] = pais
        })
    }).catch(err=>{console.log(err)})
    //Eventos
    //section
    select.addEventListener("change",(e)=>{
        const indexSelecionado = e.target.selectedIndex
        currenttime = time[indexSelecionado-1]
        currentName = name[indexSelecionado-1]
        currentImgs = imgs[indexSelecionado-1]
        document.body.style.backgroundImage= `url(${currentImgs})`
         

    })
    //submit
    submit.addEventListener("click",(event)=>{
        event.preventDefault()
        console.log(currenttime)
        let operador;
        if(currenttime.includes("+")){
           operador = "mais"
        }else if(currenttime.includes("-")){
            operador = "menos"
        }else{
            operador = "utc"
        }
         window.location.href=`hours.html?time=${currenttime}&name=${currentName}&img=${currentImgs}&op=${operador}` 
    })
}
function createSelect(paisName,timezones){
    const option = document.createElement("option")
    const text = document.createTextNode(`  ${paisName} - ${timezones}   ` )
    option.setAttribute("value",paisName)
    option.appendChild(text)
    select.appendChild(option)
}
async function getCountries(){
    const response = await fetch(`${url}translations,timezones,flags`)
    const data = await response.json()
    return data;
}

