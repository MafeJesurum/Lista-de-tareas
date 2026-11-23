import { useState } from 'react';
import Boton from './componentes/Boton.jsx';
import Modal from './componentes/Modal.jsx';

export default function App() {
  const [modalAbierto, setModalAbierto] = useState(false);
  const cerrarModal = () => setModalAbierto(false);

  return (
    <main className="app-container">
      <header className="app-header">
        <p className="app-eyebrow">Buenas Prácticas · Proyecto final</p>
        <h1 className="app-title">Lista de Tareas CUC</h1>
        <p className="app-subtitle">Tablero estilo Trello</p>
      </header>

      <div className="board-actions">
        <Boton alHacerClic={() => setModalAbierto(true)}>+ Agregar tarea</Boton>
      </div>

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
