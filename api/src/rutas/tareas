import { Router } from 'express';
import {
  obtenerColumnas,
  obtenerTareas,
  guardarTareas
} from '../datos/repositorio.js';
import {
  validarNuevaTarea,
  validarActualizacionTarea,
  filtrarCampos
} from '../logica/reglas-tablero.js';
import { ErrorHttp, exigirValido, manejarAsync } from '../middleware/errores.js';
import { COLOR_TAREA_POR_DEFECTO } from '../config/constantes.js';

const router = Router();
const CAMPOS_EDITABLES = ['title', 'description', 'label', 'color', 'column'];

router.get('/', manejarAsync(async (_req, res) => {
  res.json(await obtenerTareas());
}));

router.post('/', manejarAsync(async (req, res) => {
  const {
    title,
    description = '',
    label = '',
    color = COLOR_TAREA_POR_DEFECTO,
    column
  } = req.body;

  exigirValido(
    validarNuevaTarea(
      { title, description, label, color, column },
      await obtenerColumnas()
    )
  );

  const tareas = await obtenerTareas();
  const nueva = {
    id: Date.now(),
    title: title.trim(),
    description,
    label,
    color,
    column
  };
  tareas.push(nueva);
  await guardarTareas(tareas);

  res.status(201).json(nueva);
}));

router.patch('/:id', manejarAsync(async (req, res) => {
  const tareas = await obtenerTareas();
  const indice = tareas.findIndex(t => String(t.id) === req.params.id);
  if (indice === -1) throw new ErrorHttp(404, 'Tarea no encontrada');

  exigirValido(validarActualizacionTarea(req.body, await obtenerColumnas()));

  const cambios = filtrarCampos(req.body, CAMPOS_EDITABLES);
  if (cambios.title !== undefined) cambios.title = cambios.title.trim();

  tareas[indice] = { ...tareas[indice], ...cambios };
  await guardarTareas(tareas);
  res.json(tareas[indice]);
}));

router.delete('/:id', manejarAsync(async (req, res) => {
  const tareas = await obtenerTareas();
  const filtradas = tareas.filter(t => String(t.id) !== req.params.id);
  if (filtradas.length === tareas.length) {
    throw new ErrorHttp(404, 'Tarea no encontrada');
  }
  await guardarTareas(filtradas);
  res.status(204).end();
}));

export default router;