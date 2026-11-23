import { useEffect } from 'react';

export default function Modal({ titulo, children, acciones, alCerrar }) {
  useEffect(() => {
    const cerrarConEscape = (e) => {
      if (e.key === 'Escape') alCerrar();
    };
    document.addEventListener('keydown', cerrarConEscape);
    return () => document.removeEventListener('keydown', cerrarConEscape);
  }, [alCerrar]);

  return (
    <div className="modal-overlay" onClick={alCerrar}>
      <div className="modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal-title">{titulo}</h3>
        <div className="modal-body">{children}</div>
        <div className="modal-footer">{acciones}</div>
      </div>
    </div>
  );
}
