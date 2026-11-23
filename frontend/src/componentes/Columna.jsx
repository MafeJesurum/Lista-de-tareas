import { useRef, useState } from 'react';
import TarjetaTarea from './TarjetaTarea.jsx';
import MenuColumna from './MenuColumna.jsx';
import { MAX_NOMBRE_COLUMNA } from '../constantes.js';

export default function Columna({
  columna,
  tareas,
  alSoltarTarea,
  alEmpezarArrastre,
  alTerminarArrastre,
  alEliminarTarea,
  alEditarColumna,
}) {
  const [resaltada, setResaltada] = useState(false);
  const [menuRect, setMenuRect] = useState(null);
  const [renombrando, setRenombrando] = useState(false);
  const [nombre, setNombre] = useState(columna.name);
  // dragenter y dragleave también se disparan al pasar sobre las tarjetas de adentro;
  // contar entradas y salidas evita que el resaltado parpadee.
  const contadorArrastre = useRef(0);

  function alEntrar(e) {
    e.preventDefault();
    contadorArrastre.current++;
    setResaltada(true);
  }

  function alSalir() {
    contadorArrastre.current--;
    if (contadorArrastre.current === 0) setResaltada(false);
  }

  function alSoltar(e) {
    e.preventDefault();
    contadorArrastre.current = 0;
    setResaltada(false);
    alSoltarTarea(columna.id);
  }

  function abrirMenu(e) {
    e.stopPropagation();
    setMenuRect(e.currentTarget.getBoundingClientRect());
  }

  function empezarRenombre() {
    setMenuRect(null);
    setNombre(columna.name);
    setRenombrando(true);
  }

  function guardarNombre() {
    setRenombrando(false);
    const limpio = nombre.trim();
    if (limpio && limpio !== columna.name) alEditarColumna(columna.id, { name: limpio });
  }

  function cambiarColor(color) {
    setMenuRect(null);
    alEditarColumna(columna.id, { color });
  }

  return (
    <section
      className={'column' + (resaltada ? ' drag-over' : '')}
      style={columna.color ? { backgroundColor: columna.color } : undefined}
      onDragEnter={alEntrar}
      onDragLeave={alSalir}
      onDragOver={(e) => e.preventDefault()}
      onDrop={alSoltar}
    >
      <div className="column-header">
        {renombrando ? (
          <input
            className="column-title-input"
            aria-label="Nombre de la columna"
            value={nombre}
            maxLength={MAX_NOMBRE_COLUMNA}
            autoFocus
            onChange={(e) => setNombre(e.target.value)}
            onBlur={guardarNombre}
            onKeyDown={(e) => {
              if (e.key === 'Enter') e.currentTarget.blur();
              if (e.key === 'Escape') setRenombrando(false);
            }}
          />
        ) : (
          <h2 className="column-title">{columna.name}</h2>
        )}

        <div className="column-header-right">
          <span className="column-counter">{tareas.length}</span>
          <button type="button" className="btn-column-menu" aria-label="Opciones de columna" onClick={abrirMenu}>
            ⋯
          </button>
        </div>
      </div>

      <ul className="task-list">
        {tareas.map((tarea) => (
          <TarjetaTarea
            key={tarea.id}
            tarea={tarea}
            alEliminar={alEliminarTarea}
            alEmpezarArrastre={alEmpezarArrastre}
            alTerminarArrastre={alTerminarArrastre}
          />
        ))}
      </ul>

      {menuRect && (
        <MenuColumna
          columna={columna}
          botonRect={menuRect}
          alRenombrar={empezarRenombre}
          alCambiarColor={cambiarColor}
          alCerrar={() => setMenuRect(null)}
        />
      )}
    </section>
  );
}
