import Modal from './Modal.jsx';
import Boton from './Boton.jsx';

export default function ModalEliminarColumna({ columna, cantidadTareas, alConfirmar, alCerrar }) {
  return (
    <Modal
      titulo="Eliminar columna"
      alCerrar={alCerrar}
      acciones={
        <>
          <Boton variante="secundario" alHacerClic={alCerrar}>Cancelar</Boton>
          <Boton variante="peligro" alHacerClic={alConfirmar}>Eliminar</Boton>
        </>
      }
    >
      <p className="modal-text">
        ¿Eliminar la columna <strong>"{columna.name}"</strong>?
        {cantidadTareas > 0 && ` Tiene ${cantidadTareas} tarea(s) que también se van a borrar.`} Esta acción no
        se puede deshacer.
      </p>
    </Modal>
  );
}
