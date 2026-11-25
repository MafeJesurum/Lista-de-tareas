import { Router } from 'express';
import {
  obtenerColumnas,
  guardarColumnas,
  obtenerTareas,
  guardarTareas
} from '../datos/repositorio.js';
import {
  validarNuevaColumna,
  validarActualizacionColumna,
  filtrarCampos
} from '../logica/reglas-tablero.js';
import { ErrorHttp, exigirValido, manejarAsync } from '../middleware/errores.js';

const router = Router();
const CAMPOS_EDITABLES = ['name', 'color'];

router.get('/', manejarAsync(async (_req, res) => {
  res.json(await obtenerColumnas());
}));

router.post('/', manejarAsync(async (req, res) => {
  const { name, color = null } = req.body;
  exigirValido(validarNuevaColumna({ name, color }));

  const columnas = await obtenerColumnas();
  const nueva = { id: `col-${Date.now()}`, name: name.trim(), color };
  columnas.push(nueva);
  await guardarColumnas(columnas);

  res.status(201).json(nueva);
}));

router.patch('/:id', manejarAsync(async (req, res) => {
  const columnas = await obtenerColumnas();
  const indice = columnas.findIndex(c => c.id === req.params.id);
  if (indice === -1) throw new ErrorHttp(404, 'Columna no encontrada');

  exigirValido(validarActualizacionColumna(req.body));

  const cambios = filtrarCampos(req.body, CAMPOS_EDITABLES);
  if (cambios.name !== undefined) cambios.name = cambios.name.trim();

  columnas[indice] = { ...columnas[indice], ...cambios };
  await guardarColumnas(columnas);
  res.json(columnas[indice]);
}));

router.delete('/:id', manejarAsync(async (req, res) => {
  const columnas = await obtenerColumnas();
  if (!columnas.some(c => c.id === req.params.id)) {
    throw new ErrorHttp(404, 'Columna no encontrada');
  }
  const tareas = await obtenerTareas();

  await guardarColumnas(columnas.filter(c => c.id !== req.params.id));
  await guardarTareas(tareas.filter(t => t.column !== req.params.id));
  res.status(204).end();
}));

export default router;