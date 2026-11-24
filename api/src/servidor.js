
import 'dotenv/config';
import express from 'express';
import cors from 'cors';

const app = express();

const PUERTO = process.env.PORT || 3000;
const ORIGEN_FRONTEND =
  process.env.FRONTEND_ORIGIN || 'http://localhost:5173';

app.use(cors({
  origin: ORIGEN_FRONTEND
}));

app.use(express.json());

app.get('/api/salud', (_req, res) => {
  res.status(200).json({
    estado: 'ok',
    mensaje: 'Servidor funcionando correctamente'
  });
});

app.listen(PUERTO, () => {
  console.log(`Servidor activo en el puerto ${PUERTO}`);
});