/**
 * Regex is a library of a regular expressions to the APP
 */
import {Regex} from '../../../../regex';


/**
 * Function to validate Personal data form
 * @value {string} its the value of a field.
 * @type {string} its the type of a field by default will be type text.
 * @name {string} it will be used to check what kind of param it is.
 */
export function validator(value, name) {
  /**
     * If a field does not have value go this first conditional
     */
  //console.log("validator..............",value, name)
  if (value != null) {
    if (value.length<1) {
      return 'Este campo es requerido';
    }

    if (value.length < 3 && (name === 'nombre' || name === 'apellido' || name === 'direccion' || name === 'ciudad')) {
      return 'Este campo necessita minimo 3 caracteres';
    }

    if (name === 'DNIparticular' && !nif(value)) {
      return 'Este no es un DNI valido';
    }

    if (name === 'DNIempresa' && !Regex.regexDni.test(value)) {
      return 'Este no es un CIF valido';
    }

    // if (fn_ValidateIBAN(IBAN) && name === "cuenta")
    if (value.length < 24 && name === 'cuenta') {
      return 'Esta cuenta no es valida';
    }

    if (name === 'email' && !Regex.regexEmail.test(value)) {
      return 'Este no es un email valido';
    }


    if (name === 'numTlf' && !Regex.regexPhone.test(value)) {
      return 'No es un telefono valido';
    }

    if (name === 'codpostal' && !Regex.regexZip.test(value)) {
      return 'No es un codigo postal valido';
    }

    if (name === 'sim' && !Regex.regexSIM.test(value)) {
      return 'No es una sim valida';
    }

    if (name === 'birthday_omv' && !value.match(Regex.regexFNAC)) {
      return 'Esta fecha no es valida';
    }
  }
  return null;
}

function fn_ValidateIBAN(IBAN) {
  // Se pasa a Mayusculas
  IBAN = IBAN.toUpperCase();
  // Se quita los blancos de principio y final.
  IBAN = IBAN.trim();
  IBAN = IBAN.replace(/\s/g, ''); // Y se quita los espacios en blanco dentro de la cadena

  let letra1; let letra2; let num1; let num2;
  let isbanaux;
  let numeroSustitucion;
  // La longitud debe ser siempre de 24 caracteres
  if (IBAN.length != 24) {
    return false;
  }

  // Se coge las primeras dos letras y se pasan a números
  letra1 = IBAN.substring(0, 1);
  letra2 = IBAN.substring(1, 2);
  num1 = getnumIBAN(letra1);
  num2 = getnumIBAN(letra2);
  // Se sustituye las letras por números.
  isbanaux = String(num1) + String(num2) + IBAN.substring(2);
  // Se mueve los 6 primeros caracteres al final de la cadena.
  isbanaux = isbanaux.substring(6) + isbanaux.substring(0, 6);
  // Se calcula el resto, llamando a la función modulo97, definida más abajo
  resto = modulo97(isbanaux);
  if (resto == 1) {
    return true;
  } else {
    return false;
  }
}

function modulo97(iban) {
  const parts = Math.ceil(iban.length / 7);
  let remainer = '';
  for (let i = 1; i <= parts; i++) {
    remainer = String(parseFloat(remainer + iban.substr((i - 1) * 7, 7)) % 97);
  }
  return remainer;
}

function getnumIBAN(letra) {
  ls_letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return ls_letras.search(letra) + 10;
}

function nif(dni) {
  let numero
  let letr
  let letra
  let expresion_regular_dni

  expresion_regular_dni = /^\d{8}[a-zA-Z]$/;

  if (expresion_regular_dni.test(dni) == true) {
    numero = dni.substr(0, dni.length - 1);
    letr = dni.substr(dni.length - 1, 1);
    numero = numero % 23;
    letra = 'TRWAGMYFPDXBNJZSQVHLCKET';
    letra = letra.substring(numero, numero + 1);
    if (letra != letr.toUpperCase()) {
      return false
    } else {
      return true
    }
  } else {
    return false
  }
}