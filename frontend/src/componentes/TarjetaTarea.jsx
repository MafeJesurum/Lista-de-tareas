import { COLOR_TAREA_POR_DEFECTO } from '../constantes.js';

export default function TarjetaTarea({ tarea, alEliminar }) {
  return (
    <li className="task-item">
      <div className="task-item-top">
        <span className="task-item-title">{tarea.title}</span>
        <button
          type="button"
          className="task-item-delete"
          aria-label="Eliminar tarea"
          onClick={() => alEliminar(tarea.id)}
        >
          ✕
        </button>
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
