// Los límites también existen en el back (api/src/logica/). Si cambia uno,
// hay que cambiarlo en los dos lados: el back es el que manda (valida y responde 400),
// el front solo los usa para ayudar al usuario con el maxLength de los inputs.
export const MAX_TITULO_TAREA = 100;
export const MAX_ETIQUETA = 30;
export const MAX_NOMBRE_COLUMNA = 40;

export const COLOR_TAREA_POR_DEFECTO = '#2f6f4f';

export const COLORES_PREDEFINIDOS = [
  { label: 'Sin color', value: null },
  { label: 'Azul', value: '#dbeafe' },
  { label: 'Verde', value: '#dcfce7' },
  { label: 'Amarillo', value: '#fef9c3' },
  { label: 'Rosa', value: '#fce7f3' },
  { label: 'Naranja', value: '#ffedd5' },
  { label: 'Morado', value: '#ede9fe' },
];
