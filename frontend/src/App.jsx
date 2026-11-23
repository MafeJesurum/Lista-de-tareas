import Boton from './componentes/Boton.jsx';

export default function App() {
  return (
    <main className="app-container">
      <header className="app-header">
        <p className="app-eyebrow">Buenas Prácticas · Proyecto final</p>
        <h1 className="app-title">Lista de Tareas CUC</h1>
        <p className="app-subtitle">Tablero estilo Trello</p>
      </header>

      <div className="board-actions">
        <Boton>+ Agregar tarea</Boton>
      </div>

      <footer className="app-footer">
        <p>Hecho para la clase de Buenas Prácticas de Desarrollo de Software · CUC</p>
      </footer>
    </main>
  );
}
