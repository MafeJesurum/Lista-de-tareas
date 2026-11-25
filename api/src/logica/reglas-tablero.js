
export const MAX_TITULO_TAREA = 100;
export const MAX_DESCRIPCION = 500;
export const MAX_ETIQUETA = 30;
export const MAX_NOMBRE_COLUMNA = 40;

const esTexto = (valor) => typeof valor === 'string';


const textoVacio = (valor) => !esTexto(valor) || !valor.trim();
const demasiadoLargo = (valor, maximo) => valor.trim().length > maximo;

function validarColor(color) {
  if (color !== undefined && color !== null && !esTexto(color)) {
    return 'El color debe ser texto';
  }
  return null;
}

function validarNombre(nombre, mensajeVacio) {
  if (textoVacio(nombre)) return mensajeVacio;
  if (demasiadoLargo(nombre, MAX_NOMBRE_COLUMNA)) {
    return `El nombre no puede superar ${MAX_NOMBRE_COLUMNA} caracteres`;
  }
  return null;
}

function validarTitulo(titulo, mensajeVacio) {
  if (textoVacio(titulo)) return mensajeVacio;
  if (demasiadoLargo(titulo, MAX_TITULO_TAREA)) {
    return `El título no puede superar ${MAX_TITULO_TAREA} caracteres`;
  }
  return null;
}


function validarCamposOpcionales({ description, label, color }) {
  if (
    description !== undefined &&
    (!esTexto(description) || description.length > MAX_DESCRIPCION)
  ) {
    return `La descripción debe ser texto de máximo ${MAX_DESCRIPCION} caracteres`;
  }

  if (label !== undefined && (!esTexto(label) || label.length > MAX_ETIQUETA)) {
    return `La etiqueta debe ser texto de máximo ${MAX_ETIQUETA} caracteres`;
  }

  return validarColor(color);
}

const columnaExiste = (columnas, id) => columnas.some((c) => c.id === id);

export function validarNombreColumna(name) {
  return validarNombre(name, 'El nombre es obligatorio');
}

export function validarNuevaColumna({ name, color }) {
  return validarNombreColumna(name) || validarColor(color);
}

export function validarActualizacionColumna(datos) {
  if (datos.name !== undefined) {
    const error = validarNombre(datos.name, 'Nombre inválido');
    if (error) return error;
  }

  return validarColor(datos.color);
}

export function validarNuevaTarea(datos, columnas) {
  const { title, column } = datos;

  if (textoVacio(title) || !esTexto(column)) {
    return 'El título y la columna son obligatorios';
  }

  const errorTitulo = validarTitulo(title);
  if (errorTitulo) return errorTitulo;

  if (!columnaExiste(columnas, column)) {
    return 'La columna no existe';
  }

  return validarCamposOpcionales(datos);
}

export function validarActualizacionTarea(datos, columnas) {
  if (datos.title !== undefined) {
    const error = validarTitulo(datos.title, 'Título inválido');
    if (error) return error;
  }

  if (datos.column !== undefined && !columnaExiste(columnas, datos.column)) {
    return 'La columna no existe';
  }

  return validarCamposOpcionales(datos);
}


export function filtrarCampos(objeto, permitidos) {
  return Object.fromEntries(
    Object.entries(objeto).filter(([clave]) => permitidos.includes(clave))
  );
}