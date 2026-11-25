export class ErrorHttp extends Error {
  constructor(estado, mensaje) {
    super(mensaje);
    this.estado = estado;
  }
}


export const exigirValido = (mensajeError) => {
  if (mensajeError) throw new ErrorHttp(400, mensajeError);
};


export const manejarAsync = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

export const manejarErrores = (error, _req, res, _next) => {
  if (error instanceof ErrorHttp) {
    return res.status(error.estado).json({ error: error.message });
  }
  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'JSON inválido' });
  }
  if (error.type === 'entity.too.large') {
    return res.status(413).json({ error: 'La solicitud es demasiado grande' });
  }
  console.error(error);
  res.status(500).json({ error: 'Error interno del servidor' });
};