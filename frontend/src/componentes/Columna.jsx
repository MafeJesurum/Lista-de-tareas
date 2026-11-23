import { useRef, useState } from 'react';
import TarjetaTarea from './TarjetaTarea.jsx';

export default function Columna({
  columna,
  tareas,
  alSoltarTarea,
  alEmpezarArrastre,
  alTerminarArrastre,
  alEliminarTarea,
}) {
  const [resaltada, setResaltada] = useState(false);
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
        <h2 className="column-title">{columna.name}</h2>
        <span className="column-counter">{tareas.length}</span>
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
    </section>
  );
}
