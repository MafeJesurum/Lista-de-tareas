import { useState } from 'react';
import { COLOR_TAREA_POR_DEFECTO } from '../constantes.js';

export default function TarjetaTarea({ tarea, alEditar, alEliminar, alEmpezarArrastre, alTerminarArrastre }) {
  const [arrastrando, setArrastrando] = useState(false);

  function empezar(e) {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(tarea.id));
    alEmpezarArrastre(tarea.id);
    // Si se marca en el mismo instante, la imagen que sigue al mouse también sale transparente.
    setTimeout(() => setArrastrando(true), 0);
  }

  function terminar() {
    setArrastrando(false);
    alTerminarArrastre();
  }

  return (
    <li
      className={'task-item' + (arrastrando ? ' dragging' : '')}
      draggable
      onDragStart={empezar}
      onDragEnd={terminar}
    >
      <div className="task-item-top">
        <span className="task-item-title">{tarea.title}</span>
        <div className="task-item-actions">
          <button type="button" className="task-item-edit" aria-label="Editar tarea" onClick={() => alEditar(tarea)}>
            ✎
          </button>
          <button
            type="button"
            className="task-item-delete"
            aria-label="Eliminar tarea"
            onClick={() => alEliminar(tarea.id)}
          >
            ✕
          </button>
        </div>
      </div>

      {tarea.description && <p className="task-item-desc">{tarea.description}</p>}

      {tarea.label && (
        <span className="task-item-tag" style={{ backgroundColor: tarea.color || COLOR_TAREA_POR_DEFECTO }}>
          {tarea.label}
        </span>
      )}
    </li>
  );
}
