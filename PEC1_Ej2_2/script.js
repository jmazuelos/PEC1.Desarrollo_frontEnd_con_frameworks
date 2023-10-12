const message_index_negativeNumber_error = 'La cantidad no puede ser negativa';

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
            console.log(res);
            if (res.ok) {
                return res.json();   
            }

            throw new Error("HTTP status " + res.status + " - " + res.statusText);
        })
        .then(data => {
            console.log(data);
            document.onreadystatechange = function () {
                var state = document.readyState
                if (state == 'interactive') {
                     document.getElementById('contents').style.visibility="hidden";
                } else if (state == 'complete') {
                    setTimeout(function(){
                       document.getElementById('interactive');
                       document.getElementById('load').style.visibility="hidden";
                       document.getElementById('contents').style.visibility="visible";
                    },3000);
                }
            }

            const rate = data.rates[currencyOut];
            
            rateElem.innerText = `1 ${currencyIn} = ${rate} ${currencyOut}`;

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

