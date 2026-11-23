import TarjetaTarea from './TarjetaTarea.jsx';

export default function Columna({ columna, tareas, alEliminarTarea }) {
  return (
    <section className="column" style={columna.color ? { backgroundColor: columna.color } : undefined}>
      <div className="column-header">
        <h2 className="column-title">{columna.name}</h2>
        <span className="column-counter">{tareas.length}</span>
      </div>

      <ul className="task-list">
        {tareas.map((tarea) => (
          <TarjetaTarea key={tarea.id} tarea={tarea} alEliminar={alEliminarTarea} />
        ))}
      </ul>
    </section>
  );
}
