import { useState } from 'react';
import Modal from './Modal.jsx';
import Boton from './Boton.jsx';
import { COLOR_TAREA_POR_DEFECTO, MAX_ETIQUETA, MAX_TITULO_TAREA } from '../constantes.js';

export default function ModalTarea({ tarea, columnas, alGuardar, alCerrar }) {
  const esNueva = tarea === null;
  const [titulo, setTitulo] = useState(tarea?.title ?? '');
  const [descripcion, setDescripcion] = useState(tarea?.description ?? '');
  const [etiqueta, setEtiqueta] = useState(tarea?.label ?? '');
  const [color, setColor] = useState(tarea?.color ?? COLOR_TAREA_POR_DEFECTO);
  const [idColumna, setIdColumna] = useState(columnas[0]?.id);

  const tituloValido = titulo.trim() !== '';

  function guardar() {
    if (!tituloValido) return;
    const datos = {
      title: titulo.trim(),
      description: descripcion.trim(),
      label: etiqueta.trim(),
      color,
    };
    alGuardar(esNueva ? { ...datos, column: idColumna } : datos);
  }

  return (
    <Modal
      titulo={esNueva ? 'Agregar tarea' : 'Editar tarea'}
      alCerrar={alCerrar}
      acciones={
        <>
          <Boton variante="secundario" alHacerClic={alCerrar}>Cancelar</Boton>
          <Boton alHacerClic={guardar} deshabilitado={!tituloValido}>Guardar</Boton>
        </>
      }
    >
      <label className="modal-campo">
        <span className="modal-label">Título *</span>
        <input
          className="modal-input"
          placeholder="¿Qué hay que hacer?"
          maxLength={MAX_TITULO_TAREA}
          value={titulo}
          autoFocus
          onChange={(e) => setTitulo(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && guardar()}
        />
      </label>

      <label className="modal-campo">
        <span className="modal-label">Descripción</span>
        <textarea
          className="modal-input modal-textarea"
          placeholder="Detalles opcionales..."
          rows={3}
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
      </label>

      <label className="modal-campo">
        <span className="modal-label">Etiqueta</span>
        <input
          className="modal-input"
          placeholder="Ej. urgente, técnico..."
          maxLength={MAX_ETIQUETA}
          value={etiqueta}
          onChange={(e) => setEtiqueta(e.target.value)}
        />
      </label>

      <label className="modal-campo">
        <span className="modal-label">Color de etiqueta</span>
        <input type="color" className="modal-color" value={color} onChange={(e) => setColor(e.target.value)} />
      </label>

      {esNueva && (
        <label className="modal-campo">
          <span className="modal-label">Columna</span>
          <select className="modal-input" value={idColumna} onChange={(e) => setIdColumna(e.target.value)}>
            {columnas.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
      )}
    </Modal>
  );
}
