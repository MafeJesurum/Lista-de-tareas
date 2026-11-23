import { useState } from 'react';
import { useTablero } from './hooks/useTablero.js';
import Boton from './componentes/Boton.jsx';
import Modal from './componentes/Modal.jsx';
import Tablero from './componentes/Tablero.jsx';

export default function App() {
  const tablero = useTablero();
  const [modalAbierto, setModalAbierto] = useState(false);
  const cerrarModal = () => setModalAbierto(false);

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
        <Boton alHacerClic={() => setModalAbierto(true)} deshabilitado={tablero.columnas.length === 0}>
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
          alEliminarTarea={tablero.eliminarTarea}
          alEditarColumna={tablero.editarColumna}
        />
      )}

      {modalAbierto && (
        <Modal
          titulo="Agregar tarea"
          alCerrar={cerrarModal}
          acciones={<Boton variante="secundario" alHacerClic={cerrarModal}>Cancelar</Boton>}
        >
          <p className="modal-text">Aquí va el formulario de la tarea.</p>
        </Modal>
      )}

      <footer className="app-footer">
        <p>Hecho para la clase de Buenas Prácticas de Desarrollo de Software · CUC</p>
      </footer>
    </main>
  );
}
