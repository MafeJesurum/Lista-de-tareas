import { useState } from 'react';
import Modal from './Modal.jsx';
import Boton from './Boton.jsx';
import FilaColores from './FilaColores.jsx';
import { MAX_NOMBRE_COLUMNA } from '../constantes.js';

export default function ModalColumna({ alGuardar, alCerrar }) {
  const [nombre, setNombre] = useState('');
  const [color, setColor] = useState(null);

  const nombreValido = nombre.trim() !== '';

  function guardar() {
    if (!nombreValido) return;
    alGuardar({ name: nombre.trim(), color });
  }

  return (
    <Modal
      titulo="Nueva columna"
      alCerrar={alCerrar}
      acciones={
        <>
          <Boton variante="secundario" alHacerClic={alCerrar}>Cancelar</Boton>
          <Boton alHacerClic={guardar} deshabilitado={!nombreValido}>Crear columna</Boton>
        </>
      }
    >
      <label className="modal-campo">
        <span className="modal-label">Nombre *</span>
        <input
          className="modal-input"
          placeholder="Ej: Revisión, Bloqueadas..."
          maxLength={MAX_NOMBRE_COLUMNA}
          value={nombre}
          autoFocus
          onChange={(e) => setNombre(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && guardar()}
        />
      </label>

      <div>
        <span className="modal-label">Color de fondo</span>
        <FilaColores colorActivo={color} alElegir={setColor} />
      </div>
    </Modal>
  );
}
