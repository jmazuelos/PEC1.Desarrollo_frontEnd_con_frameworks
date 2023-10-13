//Mensajes
const message_index_negativeNumber_error = 'La cantidad no puede ser negativa';

//Elementos del DOM
const currencyInElem = document.getElementById('currencyIn');
const currencyOutElem = document.getElementById('currencyOut');
const amountInElem = document.getElementById('amountIn');
const amountOutElem = document.getElementById('amountOut');
const rateElem = document.getElementById('rate'); 
const swapElem = document.getElementById('swap');

//Extrae las tasas convertidas y actualiza el DOM
function calculate(){
    const currencyIn = currencyInElem.value;
    const currencyOut = currencyOutElem.value;

    fetch(`https://api.exchangerate-api.com/v4/latest/${currencyIn}`)
        .then(res => {
            /*Cuando se inicia la consulta a la API, se fuerza manualmente un estado de espera con el logo en la zona de la cantidad a devolver*/
            showLoader();

            setTimeout(function(){
                hideLoader();
            },1000);

            /*Si la consulta API se realiza con exito, devuelve la respuesta en formato json. 
            En caso contrario, lanza un error que se mostrará en pantalla mediante un alert (situado en el catch)*/
            if (res.ok) {
                return res.json();   
            }

            throw new Error("HTTP status " + res.status + " - " + res.statusText);
        })
        .then(data => { 
            const rate = data.rates[currencyOut];
            
            rateElem.innerText = `1 ${currencyIn} = ${rate} ${currencyOut}`;

            /*Cuando se introduce un número negativo, se muestra un mensaje de error (indicando que no se permiten números negativos) 
            y no calcula la cantidad a devolver*/
            if(amountIn.value < 0){
                let message = message_index_negativeNumber_error
                showError(message);
            }else{
                showSuccess();

                amountOutElem.value = (amountIn.value*rate).toFixed(2);
            }
        })
        .catch(error =>{
            alert('Petición fallida. ' + error);
        });
}

//Método que muestra el error
function showError(message){
    const currencyElem = currencyInElem.parentElement;
    currencyElem.classList.add('error');

    const small = currencyElem.querySelector('small');
    small.innerText = message;
}

//Método que elimina el error
function showSuccess(){
    const currencyElem = currencyInElem.parentElement;
    currencyElem.classList.remove('error');
}

//Método que muestra el loader
function showLoader(){
    const loaderElem = document.getElementById('loaderContent');
    amountOutElem.setAttribute('hidden', true);
    loaderElem.removeAttribute('hidden');
}

//Método que oculta el loader
function hideLoader(){
    const loaderElem = document.getElementById('loaderContent');
    loaderElem.setAttribute('hidden', true);
    amountOutElem.removeAttribute('hidden');
} 

//Eventos 'listeners'

currencyInElem.addEventListener('change', calculate);
amountInElem.addEventListener('input', calculate);
currencyOutElem.addEventListener('change', calculate);
amountOutElem.addEventListener('input', calculate);

swapElem.addEventListener('click', () => {
    const temp = currencyInElem.value;
    currencyInElem.value = currencyOutElem.value;
    currencyOutElem.value = temp;
    calculate();
});

calculate();