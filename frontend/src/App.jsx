import { useState } from 'react';
import { useTablero } from './hooks/useTablero.js';
import Boton from './componentes/Boton.jsx';
import Tablero from './componentes/Tablero.jsx';
import ModalTarea from './componentes/ModalTarea.jsx';
import ModalColumna from './componentes/ModalColumna.jsx';

export default function App() {
  const tablero = useTablero();
  const [modal, setModal] = useState(null);
  const cerrarModal = () => setModal(null);

  async function ejecutarYCerrar(accion) {
    const salioBien = await accion();
    if (salioBien) cerrarModal();
  }

  return (
    <main className="app-container">
      <header className="app-header">
        <p className="app-eyebrow">Buenas Prácticas · Proyecto final</p>
        <h1 className="app-title">Lista de Tareas CUC</h1>
        <p className="app-subtitle">Tablero estilo Trello</p>
      </header>

      {tablero.error && (
        <div className="aviso-error" role="alert">
          <span>{tablero.error}</span>
          <button type="button" aria-label="Cerrar aviso" onClick={tablero.cerrarError}>
            ✕
          </button>
        </div>
      )}

      <div className="board-actions">
        <Boton
          alHacerClic={() => setModal({ tipo: 'crearTarea' })}
          deshabilitado={tablero.columnas.length === 0}
        >
          + Agregar tarea
        </Boton>
      </div>

      {tablero.cargando ? (
        <p className="estado-carga">Cargando tablero...</p>
      ) : (
        <Tablero
          columnas={tablero.columnas}
          tareas={tablero.tareas}
          alMoverTarea={tablero.moverTarea}
          alEditarTarea={(tarea) => setModal({ tipo: 'editarTarea', tarea })}
          alEliminarTarea={tablero.eliminarTarea}
          alEditarColumna={tablero.editarColumna}
          alAgregarColumna={() => setModal({ tipo: 'crearColumna' })}
        />
      )}

      {modal?.tipo === 'crearTarea' && (
        <ModalTarea
          tarea={null}
          columnas={tablero.columnas}
          alGuardar={(datos) => ejecutarYCerrar(() => tablero.crearTarea(datos))}
          alCerrar={cerrarModal}
        />
      )}

      {modal?.tipo === 'editarTarea' && (
        <ModalTarea
          tarea={modal.tarea}
          columnas={tablero.columnas}
          alGuardar={(cambios) => ejecutarYCerrar(() => tablero.editarTarea(modal.tarea.id, cambios))}
          alCerrar={cerrarModal}
        />
      )}

      {modal?.tipo === 'crearColumna' && (
        <ModalColumna
          alGuardar={(datos) => ejecutarYCerrar(() => tablero.crearColumna(datos))}
          alCerrar={cerrarModal}
        />
      )}

      <footer className="app-footer">
        <p>Hecho para la clase de Buenas Prácticas de Desarrollo de Software · CUC</p>
      </footer>
    </main>
  );
}
