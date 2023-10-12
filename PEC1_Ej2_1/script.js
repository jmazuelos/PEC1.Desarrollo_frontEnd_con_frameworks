//Literales
const message_index_empty_error = ' requerid';
const message_index_acceptance_empty_error = 'No se ha aceptado la política de privacidad';
const message_index_incorrectEmail_error = 'Email incorrecto';
const message_index_minLength_error = ' debe tener al menos ';
const message_index_maxLength_error = ' debe tener como máximo ';
const message_index_matchedPassword_error = 'Confirmación de contraseña no coincide';
const message_index_age_error = 'Fecha de nacimiento debe ser inferior a 1000 años';
const message_index_incorrectPassword_error = 'Contraseña debe contener al menos una mayúscula, una minúscula, un número y un caracter especial';

//Etiquetas
const form = document.getElementById('form');
const formControls = document.getElementsByClassName('formControl');
const acceptance = document.getElementById('acceptance');

//Método que introduce borde rojo y mensaje de error cuando los inputs están vacíos
function showError(input, message){
    const formControl = input.parentElement;
    formControl.classList.remove('success');
    formControl.classList.add('error');

    const small = formControl.querySelector('small');
    small.innerText = message;
}

//Método que introduce borde verde y elimina mensaje de error cuando los inputs son correctos
function showSuccess(input){
    const formControl = input.parentElement;
    formControl.classList.remove('error');
    formControl.classList.add('success');
}

//Método que comprueba si el formato del email es válido
function isValidEmail(input){
    const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if(!re.test(String(input.value).toLowerCase())){
        message = message_index_incorrectEmail_error;
        showError(input, message);
    }else{
        showSuccess(input);
    }
}

//Método que comprueba si el formato de la contraseña es válida
function isValidPassword(input){
    const re = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[~@%&#/$`"'^*()_+=[\]{}<>|\\,.?!;:-]).{8,}$/;
    if(!re.test(String(input.value))){
        message = message_index_incorrectPassword_error;
        showError(input, message);
    }else{
        showSuccess(input);
    }
}
// /

//Método que comprueba la cantidad de caracteres en nombre de usuario
function isValidLength(input, label, min, max){
    let error = true;
    if(input.value.length < min){
        message = (input.id === 'password2' ? 'Confirmación de contraseña' : label.textContent) + message_index_minLength_error + min + ' caracteres' 
        showError(input, message);
        error = false;
    }else if(input.value.length > max){
        message = (input.id === 'password2' ? 'Confirmación de contraseña' : label.textContent) + message_index_maxLength_error + max + ' caracteres' 
        showError(input, message);
        error = false;
    }else{
        showSuccess(input);
    }

    return error;
}

//Método que comprueba si un campo está vacío y si el email es válido
function isEmpty(input, label){
    let error = false;
    if(input.value === ''){
        message = (input.id === 'password2' ? 'Confirmación de contraseña' : label.textContent) + message_index_empty_error + (input.id === 'username' || input.id === 'email' ? 'o' : 'a');
        showError(input, message);
        error = true;
    }else{
        showSuccess(input);
    }
    return error;
}

//Método que comprueba si la confirmación de contraseña coincide con la contraseña principal
function isMatchedPassword(password1, password2){
    if(password1.value !== password2.value){
        message = message_index_matchedPassword_error;
        showError(password2, message);
    }else{
        showSuccess(password2);
    }
}

//Método que comprueba la edad
function isValidAge(input){
    const date = new Date(input.value);
    const today = Date.now();
    var diff = (today - date.getTime()) / (3600000 * 8760);
    var maxDiff = 1000.67;
    if(diff >= maxDiff){
        message = message_index_age_error;
        showError(input, message);
    }else{
        showSuccess(input);
    }
}

//Método que comprueba si se ha aceptado la política de privacidad
function isAcceptedPolicy(acceptance){
    if(!acceptance.checked){
        message = message_index_acceptance_empty_error;
        showError(acceptance, message);
    }else{
        showSuccess(acceptance);
    }
}

//Evento 'listeners'
document.addEventListener('submit', function(e) {
    e.preventDefault();
    
    for(let i = 0; i < formControls.length; i++){
        input = formControls[i].querySelector('input');
        label = formControls[i].querySelector('label');
        
        isEmpty(input, label)
        
        if((input.id === 'username' || input.id === 'password') && !isEmpty(input, label)){
            if(input.id === 'username'){
                isValidLength(input, label, 3, 15);
            }else{
                if(isValidLength(input, label, 8, 25)){
                    isValidPassword(input);
                }
            }
        }else if(input.id === 'email' && !isEmpty(input, label)){
            isValidEmail(input);
        }else if(input.id === 'password2' && !isEmpty(input, label)){
            const password1 = document.getElementById('password');
            isMatchedPassword(password1, password2);
        }else if(input.id == 'age' && !isEmpty(input, label)){
            isValidAge(input);
        }
    }

    isAcceptedPolicy(acceptance);
});

function showPassword(){
    const inputPassword = document.getElementById("password");
    const visibilityIcon = document.getElementById("visibilityIcon");
    visibilityIcon.innerHTML += 'visibility';
    if(inputPassword.type == "password"){
        inputPassword.type = "text";
        visibilityIcon.innerText = 'visibility_off';
    }else{
        inputPassword.type = "password";
        visibilityIcon.innerText = 'visibility';
    }
}

function showPassword2(){
    const inputPassword2 = document.getElementById("password2");
    const visibilityIcon2 = document.getElementById("visibilityIcon2");
    if(inputPassword2.type == "password"){
        inputPassword2.type = "text";
        visibilityIcon2.innerText = 'visibility_off';
    }else{
        inputPassword2.type = "password";
        visibilityIcon2.innerText = 'visibility';
    }
}
