import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import { PUERTO, ORIGEN_FRONTEND, LIMITE_JSON } from './config/constantes.js';
import rutasColumnas from './rutas/columnas.js';
import rutasTareas from './rutas/tareas.js';
import { manejarErrores } from './middleware/errores.js';

const app = express();

app.use(cors({
  origin: (origin, cb) => cb(null, origin === process.env.FRONTEND_ORIGIN)
}));
app.use(express.json({ limit: LIMITE_JSON }));

app.get('/api/salud', (_req, res) => {
  res.json({ estado: 'ok', mensaje: 'Servidor funcionando correctamente' });
});

app.use('/api/columnas', rutasColumnas);
app.use('/api/tareas', rutasTareas);

app.use(manejarErrores);

// Las pruebas levantan la app en un puerto libre, asi se evitan conflictos con el puerto 3000
if (process.env.NODE_ENV !== 'test') {
  app.listen(PUERTO, () => {
    console.log(`Servidor activo en el puerto ${PUERTO}`);
  });
}

export default app;
