//Elementos del DOM
const container = document.querySelector('.container');
const seats = document.querySelectorAll('.row .seat:not(.occupied)');
const count = document.getElementById('count');
const total = document.getElementById('total');
const movieSelect = document.getElementById('movie');
const currencySelectElem = document.getElementById('currencySelect');
const currencyOutElems = document.querySelectorAll('.currencyOut');

populateUI();

let ticketPrice = +movieSelect.value;

//Almacena la pelicula seleccionada y su precio en el navegador
function setMovieData(movieIndex, moviePrice) {
  localStorage.setItem('selectedMovieIndex', movieIndex);
  localStorage.setItem('selectedMoviePrice', moviePrice);
}

//Metodo para actualizar la cantidad de asientos seleccionados y su coste 
function updateSelectedCount() {
  const currencyIn = "USD";
  const currencySelected = currencySelectElem.value;
  const optionElems = document.querySelectorAll('option.currencyOut');

  const selectedSeats = document.querySelectorAll('.row .seat.selected');

  const seatsIndex = [...selectedSeats].map(seat => [...seats].indexOf(seat));

  localStorage.setItem('selectedSeats', JSON.stringify(seatsIndex));

  const selectedSeatsCount = selectedSeats.length;

  count.innerText = selectedSeatsCount;

  //Llamada a la API para actualizar el precio de la película y coste total dependiendo de la moneda
  fetch(`https://api.exchangerate-api.com/v4/latest/${currencyIn}`)
      .then(res => {
        /*Si la consulta API se realiza con exito, devuelve la respuesta en formato json. 
        En caso contrario, lanza un error que se mostrará en pantalla mediante un alert (situado en el catch)*/
        if (res.ok) {
            return res.json();   
        }

        throw new Error("HTTP status " + res.status + " - " + res.statusText);
      })
      .then(data => { 
        const rate = +data.rates[currencySelected];

        //Actualiza el precio de la pelicula
        optionElems.forEach((optionElem) => {
          let optionValue = optionElem.value;
          optionValue *= rate;

          optionValue = optionValue % Math.ceil(optionValue) === 0 ? Math.ceil(optionValue) : optionValue.toFixed(2).toString(); 

          optionElem.innerText = optionElem.textContent.replace(/[0-9.]*[0-9]*(?=\))/, `${optionValue}`);
        });

        //Actualiza el coste total
        if(ticketPrice > -1){
          total.innerText = (selectedSeatsCount * ticketPrice * rate).toFixed(2);
        }
      })
      .catch(error =>{
          alert('Petición fallida. ' + error);
      });
  
  //No entiendo el sentido de esta línea
  setMovieData(movieSelect.selectedIndex, movieSelect.value); //??????
}

//Metodo para recuperar los datos almacenados en el navegador e introducirlos
function populateUI() {
  const selectedSeats = JSON.parse(localStorage.getItem('selectedSeats'));

  if (selectedSeats !== null && selectedSeats.length > 0) {
    seats.forEach((seat, index) => {
      if (selectedSeats.indexOf(index) > -1) {
        seat.classList.add('selected');
      }
    });
  }

  const selectedMovieIndex = localStorage.getItem('selectedMovieIndex');

  if (selectedMovieIndex !== null) {
    movieSelect.selectedIndex = selectedMovieIndex;
  }
}

//Metodo que modifica el tipo de moneda
function changeCurrency(){
  const currencySelected = currencySelectElem.value;

  if(previous === "USD"){
    currencyOutElems.forEach((currencyOutElem) => {
      currencyOutElem.innerText = currencyOutElem.textContent.replace(`$`,`${currencySelected} `);
    });
  }else if(currencySelected === "USD"){
    currencyOutElems.forEach((currencyOutElem) => {
      currencyOutElem.innerText = currencyOutElem.textContent.replace(`${previous} `, `$`);
    });
  }else{
    currencyOutElems.forEach((currencyOutElem) => {
      currencyOutElem.innerText = currencyOutElem.textContent.replace(`${previous}`, `${currencySelected}`);
    });
  }
}

//Evento para seleccionar una película y actualizar el coste
movieSelect.addEventListener('change', e => {
  ticketPrice = +e.target.value;
  setMovieData(e.target.selectedIndex, e.target.value);
  updateSelectedCount();
});

//Eventos para seleccionar una moneda y actualizarla en pantalla junto con el coste
currencySelectElem.addEventListener('click',  function() {
  previous = this.value;
});

currencySelectElem.addEventListener('change', function(){
  changeCurrency();
  //changePrice();
  updateSelectedCount();
});

//Evento de seleccion de asiento al hacer click 
container.addEventListener('click', e => {
  if (
    e.target.classList.contains('seat') &&
    !e.target.classList.contains('occupied')
  ) {
    e.target.classList.toggle('selected');

    updateSelectedCount();
  }
});

//Recuento inicial de asientos y coste.
updateSelectedCount();


/*Logica: 
  - select moneda -> modifica moneda y precio de película (total)
  - select pelicula -> modifica precio total
  - select asientos -> modifica precio total*/