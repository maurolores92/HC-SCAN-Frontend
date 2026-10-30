import * as yup from 'yup'

yup.setLocale({
  mixed: {
    default: 'Campo inválido',
    required: 'Este campo es obligatorio',
    oneOf: 'Debe ser uno de los siguientes valores: ${values}',
    notOneOf: 'No debe ser uno de los siguientes valores: ${values}',
    notType: 'El tipo de valor ingresado es incorrecto'
  },
  string: {
    length: 'Debe tener exactamente ${length} caracteres',
    min: 'Debe tener al menos ${min} caracteres',
    max: 'Debe tener como máximo ${max} caracteres',
    matches: 'Debe coincidir con el formato requerido',
    email: 'Debe ser un correo electrónico válido',
    url: 'Debe ser una URL válida',
    uuid: 'Debe ser un UUID válido',
    trim: 'No debe contener espacios al inicio o al final',
    lowercase: 'Debe estar en minúsculas',
    uppercase: 'Debe estar en mayúsculas'
  },
  number: {
    min: 'Debe ser mayor o igual a ${min}',
    max: 'Debe ser menor o igual a ${max}',
    lessThan: 'Debe ser menor a ${less}',
    moreThan: 'Debe ser mayor a ${more}',
    positive: 'Debe ser un número positivo',
    negative: 'Debe ser un número negativo',
    integer: 'Debe ser un número entero'
  },
  date: {
    min: 'La fecha debe ser posterior a ${min}',
    max: 'La fecha debe ser anterior a ${max}'
  },
  object: {
    noUnknown: 'Hay campos no especificados en la configuración'
  },
  array: {
    min: 'Debe contener al menos ${min} elementos',
    max: 'Debe contener como máximo ${max} elementos',
    length: 'Debe contener exactamente ${length} elementos'
  }
})

export default yup
