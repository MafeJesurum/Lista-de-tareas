import { useEffect } from 'react';
import FilaColores from './FilaColores.jsx';

const SEPARACION_DEL_BOTON = 6;

export default function MenuColumna({ columna, botonRect, alRenombrar, alCambiarColor, alEliminar, alCerrar }) {
  useEffect(() => {
    const cerrarConEscape = (e) => {
      if (e.key === 'Escape') alCerrar();
    };
    document.addEventListener('click', alCerrar);
    document.addEventListener('keydown', cerrarConEscape);
    return () => {
      document.removeEventListener('click', alCerrar);
      document.removeEventListener('keydown', cerrarConEscape);
    };
  }, [alCerrar]);

  const posicion = {
    top: botonRect.bottom + SEPARACION_DEL_BOTON,
    right: window.innerWidth - botonRect.right,
  };

  return (
    <div className="dropdown" style={posicion} onClick={(e) => e.stopPropagation()}>
      <button type="button" className="dropdown-item" onClick={alRenombrar}>
        Editar nombre
      </button>
      <p className="dropdown-label">Color de fondo</p>
      <FilaColores colorActivo={columna.color} alElegir={alCambiarColor} />
      <hr className="dropdown-sep" />
      <button type="button" className="dropdown-item dropdown-item-danger" onClick={alEliminar}>
        Eliminar columna
      </button>
    </div>
  );
}
