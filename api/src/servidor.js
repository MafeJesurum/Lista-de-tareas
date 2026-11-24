
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import {
  leerDatos,
  guardarDatos
} from './datos/almacenamiento.js';

const app = express();

const PUERTO = process.env.PORT || 3000;
const ORIGEN_FRONTEND =
  process.env.FRONTEND_ORIGIN || 'http://localhost:5173';

app.use(cors({ origin: ORIGEN_FRONTEND }));
app.use(express.json({ limit: '100kb' }));

const columnasIniciales = [
  { id: 'todo', name: 'Por Hacer', color: null },
  { id: 'in-progress', name: 'En Progreso', color: null },
  { id: 'done', name: 'Completadas', color: null }
];

const tareasIniciales = [];

const responderError = (res, error, mensaje) => {
  console.error(error);
  res.status(500).json({ error: mensaje });
};

app.get('/api/salud', (_req, res) => {
  res.json({
    estado: 'ok',
    mensaje: 'Servidor funcionando correctamente'
  });
});

// COLUMNAS
app.get('/api/columnas', async (_req, res) => {
  try {
    res.json(await leerDatos('columnas', columnasIniciales));
  } catch (error) {
    responderError(res, error, 'Error al consultar columnas');
  }
});

app.post('/api/columnas', async (req, res) => {
  try {
    const { name, color = null } = req.body;

    if (typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'El nombre es obligatorio' });
    }

    const columnas = await leerDatos('columnas', columnasIniciales);
    const nueva = {
      id: `col-${Date.now()}`,
      name: name.trim(),
      color
    };

    columnas.push(nueva);
    await guardarDatos('columnas', columnas);
    res.status(201).json(nueva);
  } catch (error) {
    responderError(res, error, 'Error al crear columna');
  }
});

app.patch('/api/columnas/:id', async (req, res) => {
  try {
    const columnas = await leerDatos('columnas', columnasIniciales);
    const indice = columnas.findIndex(c => c.id === req.params.id);

    if (indice === -1) {
      return res.status(404).json({ error: 'Columna no encontrada' });
    }

    if (req.body.name !== undefined &&
        (typeof req.body.name !== 'string' || !req.body.name.trim())) {
      return res.status(400).json({ error: 'Nombre inválido' });
    }

    columnas[indice] = { ...columnas[indice], ...req.body };

    await guardarDatos('columnas', columnas);
    res.json(columnas[indice]);
  } catch (error) {
    responderError(res, error, 'Error al editar columna');
  }
});

app.delete('/api/columnas/:id', async (req, res) => {
  try {
    const columnas = await leerDatos('columnas', columnasIniciales);
    const tareas = await leerDatos('tareas', tareasIniciales);

    if (!columnas.some(c => c.id === req.params.id)) {
      return res.status(404).json({ error: 'Columna no encontrada' });
    }

    await guardarDatos(
      'columnas',
      columnas.filter(c => c.id !== req.params.id)
    );

    await guardarDatos(
      'tareas',
      tareas.filter(t => t.column !== req.params.id)
    );

    res.status(204).end();
  } catch (error) {
    responderError(res, error, 'Error al eliminar columna');
  }
});

// TAREAS
app.get('/api/tareas', async (_req, res) => {
  try {
    res.json(await leerDatos('tareas', tareasIniciales));
  } catch (error) {
    responderError(res, error, 'Error al consultar tareas');
  }
});

app.post('/api/tareas', async (req, res) => {
  try {
    const { title, description = '', label = '', color = '#2f6f4f', column } = req.body;

    if (typeof title !== 'string' || !title.trim() ||
        typeof column !== 'string') {
      return res.status(400).json({
        error: 'El título y la columna son obligatorios'
      });
    }

    const columnas = await leerDatos('columnas', columnasIniciales);

    if (!columnas.some(c => c.id === column)) {
      return res.status(400).json({ error: 'La columna no existe' });
    }

    const tareas = await leerDatos('tareas', tareasIniciales);

    const nueva = {
      id: Date.now(),
      title: title.trim(),
      description,
      label,
      color,
      column
    };

    tareas.push(nueva);
    await guardarDatos('tareas', tareas);
    res.status(201).json(nueva);
  } catch (error) {
    responderError(res, error, 'Error al crear tarea');
  }
});

app.patch('/api/tareas/:id', async (req, res) => {
  try {
    const tareas = await leerDatos('tareas', tareasIniciales);
    const indice = tareas.findIndex(t => String(t.id) === req.params.id);

    if (indice === -1) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    if (req.body.title !== undefined &&
        (typeof req.body.title !== 'string' || !req.body.title.trim())) {
      return res.status(400).json({ error: 'Título inválido' });
    }

    if (req.body.column !== undefined) {
      const columnas = await leerDatos('columnas', columnasIniciales);
      if (!columnas.some(c => c.id === req.body.column)) {
        return res.status(400).json({ error: 'La columna no existe' });
      }
    }

    tareas[indice] = { ...tareas[indice], ...req.body };
    tareas[indice].title = tareas[indice].title.trim();

    await guardarDatos('tareas', tareas);
    res.json(tareas[indice]);
  } catch (error) {
    responderError(res, error, 'Error al editar tarea');
  }
});

app.delete('/api/tareas/:id', async (req, res) => {
  try {
    const tareas = await leerDatos('tareas', tareasIniciales);
    const filtradas = tareas.filter(t => String(t.id) !== req.params.id);

    if (filtradas.length === tareas.length) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    await guardarDatos('tareas', filtradas);
    res.status(204).end();
  } catch (error) {
    responderError(res, error, 'Error al eliminar tarea');
  }
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(400).json({ error: 'Solicitud inválida' });
});

app.listen(PUERTO, () => {
  console.log(`Servidor activo en el puerto ${PUERTO}`);
});
