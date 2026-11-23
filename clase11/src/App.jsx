// ============================================================
//  PASO 3 — Péguelo completo en  src/App.jsx
//  Clase 11 · Unidad 3.1 · Introducción y repaso de React js
//  Buenas Prácticas de Desarrollo de Software · CUC
// ============================================================

import { useState } from 'react';

function Boton({ children, alHacerClic, variante = 'primario', cargando = false }) {
  return (
    <button
      className={`boton boton--${variante}`}
      onClick={alHacerClic}
      disabled={cargando}
    >
      {cargando ? 'Procesando...' : children}
    </button>
  );
}

function FilaEstudiante({ estudiante }) {
  const estado = estudiante.nota >= 3.0 ? 'Aprobado' : 'Reprobado';
  return (
    <tr>
      <td>{estudiante.nombre}</td>
      <td>{estudiante.nota}</td>
      <td>{estado}</td>
    </tr>
  );
}

function App() {
  const [estudiantes, setEstudiantes] = useState([
    { id: 1, nombre: 'Ana', nota: 4.5 }
  ]);

  const [nombre, setNombre] = useState('');

  function agregar() {
    if (nombre.trim() === '') return;
    const nuevo = { id: Date.now(), nombre: nombre.trim(), nota: 3.2 };
    setEstudiantes([...estudiantes, nuevo]);
    setNombre('');
  }

  return (
    <>
      <h1 className='caja'>Notas</h1>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Nota</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {estudiantes.map(e => <FilaEstudiante key={e.id} estudiante={e} />)}
        </tbody>
      </table>
      <input value={nombre} onChange={e => setNombre(e.target.value)} />
      <Boton alHacerClic={agregar}>Agregar estudiante</Boton>
    </>
  );
}



export default App;


// ============================================================
//  PASO 4 — Rompa el código a propósito, uno por uno,
//  y devuélvalo antes de seguir con el siguiente.
// ============================================================
//
//  1) Cambie   key={e.id}   por   key={1}
//     Agregue tres estudiantes y mire la advertencia en la consola (F12).
//
//  2) Agregue   className="caja"   al <h1> y luego cámbielo por   class="caja"
//     React avisa en la consola. Lea el mensaje exacto que da.
//
//  3) Escriba   boton   en minúscula (en la función y en los dos usos).
//     React cree que es una etiqueta de HTML y no la encuentra.
//
//  4) Cambie   setEstudiantes([...estudiantes, nuevo]);
//        por   estudiantes.push(nuevo);
//     El arreglo cambia pero la pantalla NO se entera. Es el error más común.
//
//  5) Cambie   onClick={alHacerClic}   por   onClick={alHacerClic()}
//     Se ejecuta al cargar la página, no al hacer clic.
//
// ============================================================
