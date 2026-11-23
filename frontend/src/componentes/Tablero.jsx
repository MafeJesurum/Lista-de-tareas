import { useState } from 'react';
import Columna from './Columna.jsx';

export default function Tablero({
  columnas,
  tareas,
  alMoverTarea,
  alEditarTarea,
  alEliminarTarea,
  alEditarColumna,
  alAgregarColumna,
}) {
  const [idArrastrada, setIdArrastrada] = useState(null);

  function soltarEn(idColumna) {
    const tarea = tareas.find((t) => t.id === idArrastrada);
    if (tarea && tarea.column !== idColumna) alMoverTarea(tarea.id, idColumna);
    setIdArrastrada(null);
  }

  return (
    <div className="board">
      {columnas.map((columna) => (
        <Columna
          key={columna.id}
          columna={columna}
          tareas={tareas.filter((t) => t.column === columna.id)}
          alSoltarTarea={soltarEn}
          alEmpezarArrastre={setIdArrastrada}
          alTerminarArrastre={() => setIdArrastrada(null)}
          alEditarTarea={alEditarTarea}
          alEliminarTarea={alEliminarTarea}
          alEditarColumna={alEditarColumna}
        />
      ))}
      <button type="button" className="btn-add-column" onClick={alAgregarColumna}>
        + Añadir columna
      </button>
    </div>
  );
}
